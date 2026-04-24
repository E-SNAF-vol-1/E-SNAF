const pool = require("../db");

exports.createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const musteriId = req.session?.user?.id || null;
    const {
      addressInfo,
      customerInfo,
      items,
      totalPrice,
      isGuest,
      odeme_yontemi,
      adres_id,
      notlar // Yeni eklenen alan
    } = req.body;

    let nihaiAdresId = adres_id;

    if (!nihaiAdresId && addressInfo) {
      const yeniAdresResult = await client.query(`
                INSERT INTO public.adres (musteri_id, adres_basligi, tam_adres, posta_kodu, sehir, ilce)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `, [musteriId, addressInfo.baslik, addressInfo.detay, addressInfo.postaKodu, addressInfo.sehir, addressInfo.ilce]);
      nihaiAdresId = yeniAdresResult.rows[0].id;
    }

    const sepet = items || [];
    if (sepet.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mesaj: "Sepet boş." });
    }

    const misafirData = isGuest ? {
      ad: customerInfo?.ad,
      soyad: customerInfo?.soyad,
      email: customerInfo?.email,
      telefon: customerInfo?.telefon
    } : null;

    // Sipariş Kaydı - "notlar" sütunu eklendi
    const siparisResult = await client.query(`
            INSERT INTO public.siparis (musteri_id, adres_id, toplam_tutar, durum, misafir_bilgileri, odeme_yontemi, notlar)
            VALUES ($1, $2, $3, 'Hazırlanıyor', $4, $5, $6)
            RETURNING id
        `, [musteriId, nihaiAdresId, totalPrice, misafirData, odeme_yontemi, notlar || ""]);

    const siparisId = siparisResult.rows[0].id;

    for (const item of sepet) {
      await client.query(`
                INSERT INTO public.siparis_detay (siparis_id, urun_id, adet, birim_fiyat)
                VALUES ($1, $2, $3, $4)
            `, [siparisId, item.urun_id || item.id, item.miktar || item.adet || 1, item.fiyat || 0]);
    }

    if (musteriId) {
      await client.query(`UPDATE public.sepet_detay SET sepet_icerigi = '[]'::jsonb WHERE musteri_id = $1`, [musteriId]);
    }

    await client.query("COMMIT");
    res.status(201).json({ mesaj: "Sipariş oluşturuldu.", siparis_id: siparisId });

  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error("Sipariş Kayıt Hatası:", err);
    res.status(500).json({ mesaj: "Teknik hata oluştu." });
  } finally {
    client.release();
  }
};