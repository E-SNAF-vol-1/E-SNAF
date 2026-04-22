const pool = require("../db");

exports.createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const musteriId = req.session?.user?.id || null;
    const { addressInfo, customerInfo, items, totalPrice, isGuest } = req.body;

    let nihaiAdresId = req.body.adres_id;

    if (!nihaiAdresId && addressInfo) {
      const yeniAdresResult = await client.query(`
        INSERT INTO public.adres (musteri_id, adres_basligi, tam_adres, posta_kodu)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [musteriId, addressInfo.baslik, addressInfo.detay, addressInfo.postaKodu]);
      nihaiAdresId = yeniAdresResult.rows[0].id;
    }

    const sepet = items || [];

    if (!sepet.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mesaj: "Sepet boş" });
    }

    // Misafir bilgilerine mail adresini de ekledik
    const siparisNotu = isGuest
      ? `Misafir: ${customerInfo.ad} ${customerInfo.soyad} - E-posta: ${customerInfo.email} - Tel: ${customerInfo.telefon}`
      : null;

    const siparisResult = await client.query(`
      INSERT INTO public.siparis (musteri_id, adres_id, toplam_tutar, durum, notlar)
      VALUES ($1, $2, $3, 'Hazırlanıyor', $4)
      RETURNING *
    `, [musteriId, nihaiAdresId, totalPrice, siparisNotu]);

    const siparis = siparisResult.rows[0];

    for (const item of sepet) {
      await client.query(`
        INSERT INTO public.siparis_detay (siparis_id, urun_id, adet, birim_fiyat)
        VALUES ($1, $2, $3, $4)
      `, [siparis.id, item.id || item.urun_id, item.miktar, item.fiyat]);
    }

    if (musteriId) {
      await client.query(`
        UPDATE public.sepet_detay
        SET sepet_icerigi = '[]'::jsonb, guncelleme_tarihi = CURRENT_TIMESTAMP
        WHERE musteri_id = $1
      `, [musteriId]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      mesaj: "Sipariş oluşturuldu",
      siparis_id: siparis.id
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ mesaj: "Sipariş oluşturulamadı" });
  } finally {
    client.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    if (!req.session?.user) return res.status(401).json({ mesaj: "Giriş yapmalısınız" });
    const result = await pool.query(`
      SELECT *
      FROM public.siparis
      WHERE musteri_id = $1
      ORDER BY siparis_tarihi DESC
    `, [req.session.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Siparişler alınamadı" });
  }
};

exports.getMyOrderDetail = async (req, res) => {
  try {
    if (!req.session?.user) return res.status(401).json({ mesaj: "Giriş yapmalısınız" });
    const siparisResult = await pool.query(`
      SELECT s.*, a.adres_basligi, a.tam_adres, a.posta_kodu, se.sehir_adi
      FROM public.siparis s
      LEFT JOIN public.adres a ON a.id = s.adres_id
      LEFT JOIN public.sehir se ON se.id = a.sehir_id
      WHERE s.id = $1 AND s.musteri_id = $2
    `, [req.params.id, req.session.user.id]);

    if (siparisResult.rows.length === 0) return res.status(404).json({ mesaj: "Sipariş bulunamadı" });

    const detayResult = await pool.query(`
      SELECT sd.*, u.urun_adi
      FROM public.siparis_detay sd
      LEFT JOIN public.urun u ON u.id = sd.urun_id
      WHERE sd.siparis_id = $1
    `, [req.params.id]);

    res.json({ siparis: siparisResult.rows[0], urunler: detayResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sipariş detayı alınamadı" });
  }
};

exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, m.ad, m.soyad, m.email
      FROM public.siparis s
      LEFT JOIN public.musteri m ON m.id = s.musteri_id
      ORDER BY s.siparis_tarihi DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Admin sipariş listesi alınamadı" });
  }
};

exports.getOrderDetailAdmin = async (req, res) => {
  try {
    const siparisResult = await pool.query(`
      SELECT s.*, m.ad, m.soyad, m.email, m.telefon, a.adres_basligi, a.tam_adres, a.posta_kodu, se.sehir_adi
      FROM public.siparis s
      LEFT JOIN public.musteri m ON m.id = s.musteri_id
      LEFT JOIN public.adres a ON a.id = s.adres_id
      LEFT JOIN public.sehir se ON se.id = a.sehir_id
      WHERE s.id = $1
    `, [req.params.id]);

    if (siparisResult.rows.length === 0) return res.status(404).json({ mesaj: "Sipariş bulunamadı" });

    const detayResult = await pool.query(`
      SELECT sd.*, u.urun_adi
      FROM public.siparis_detay sd
      LEFT JOIN public.urun u ON u.id = sd.urun_id
      WHERE sd.siparis_id = $1
    `, [req.params.id]);

    res.json({ siparis: siparisResult.rows[0], urunler: detayResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sipariş detayı alınamadı" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { durum } = req.body;
    const result = await pool.query(`
      UPDATE public.siparis
      SET durum = $1
      WHERE id = $2
      RETURNING *
    `, [durum, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sipariş durumu güncellenemedi" });
  }
};