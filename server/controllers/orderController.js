const pool = require("../db");

/**
 * SİPARİŞ KONTROLLERİ
 * Bu dosya hem kullanıcıların hem de yöneticilerin sipariş işlemlerini yönetir.
 */

// --- SİPARİŞ OLUŞTURMA (FRONTEND İÇİN) ---
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
      notlar // Veritabanına eklenen yeni sütun
    } = req.body;

    let nihaiAdresId = adres_id;

    // 1. Adres İşlemleri (Zorunlu sehir ve ilce alanları dahil)
    if (!nihaiAdresId && addressInfo) {
      const yeniAdresResult = await client.query(`
                INSERT INTO public.adres (musteri_id, adres_basligi, tam_adres, posta_kodu, sehir, ilce)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `, [musteriId, addressInfo.baslik, addressInfo.detay, addressInfo.postaKodu, addressInfo.sehir, addressInfo.ilce]);
      nihaiAdresId = yeniAdresResult.rows[0].id;
    }

    // 2. Sepet Doğrulama
    const sepet = items || [];
    if (sepet.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mesaj: "Sepet boş, sipariş oluşturulamaz." });
    }

    // 3. Misafir Bilgileri (JSONB)
    const misafirData = isGuest ? {
      ad: customerInfo?.ad,
      soyad: customerInfo?.soyad,
      email: customerInfo?.email,
      telefon: customerInfo?.telefon
    } : null;

    // 4. Sipariş Kaydı
    const siparisResult = await client.query(`
            INSERT INTO public.siparis (musteri_id, adres_id, toplam_tutar, durum, misafir_bilgileri, odeme_yontemi, notlar)
            VALUES ($1, $2, $3, 'Hazırlanıyor', $4, $5, $6)
            RETURNING id
        `, [musteriId, nihaiAdresId, totalPrice, misafirData, odeme_yontemi, notlar || ""]);

    const siparisId = siparisResult.rows[0].id;

    // 5. Sipariş Detaylarını Ekleme
    for (const item of sepet) {
      await client.query(`
                INSERT INTO public.siparis_detay (siparis_id, urun_id, adet, birim_fiyat)
                VALUES ($1, $2, $3, $4)
            `, [siparisId, item.urun_id || item.id, item.miktar || item.adet || 1, item.fiyat || 0]);
    }

    // 6. Kayıtlı Kullanıcıların Sepetini Sıfırlama
    if (musteriId) {
      await client.query(`
                UPDATE public.sepet_detay
                SET sepet_icerigi = '[]'::jsonb, guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE musteri_id = $1
            `, [musteriId]);
    }

    await client.query("COMMIT");
    res.status(201).json({ mesaj: "Sipariş başarıyla oluşturuldu.", siparis_id: siparisId });

  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error("Sipariş Kayıt Hatası:", err);
    res.status(500).json({ mesaj: "Sipariş oluşturulurken teknik bir hata oluştu." });
  } finally {
    client.release();
  }
};

// --- KULLANICI FONKSİYONLARI ---

// Kullanıcının kendi siparişlerini listeler
exports.getMyOrders = async (req, res) => {
  try {
    if (!req.session?.user) return res.status(401).json({ mesaj: "Giriş yapmalısınız" });
    const result = await pool.query(`
            SELECT * FROM public.siparis 
            WHERE musteri_id = $1 
            ORDER BY siparis_tarihi DESC
        `, [req.session.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Siparişler alınamadı" });
  }
};

// Kullanıcının belirli bir siparişinin detaylarını getirir
exports.getMyOrderDetail = async (req, res) => {
  try {
    if (!req.session?.user) return res.status(401).json({ mesaj: "Giriş yapmalısınız" });
    const siparisResult = await pool.query(`
            SELECT s.*, a.adres_basligi, a.tam_adres, a.posta_kodu
            FROM public.siparis s
            LEFT JOIN public.adres a ON a.id = s.adres_id
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

// --- ADMIN FONKSİYONLARI ---

// Tüm sistemdeki siparişleri listeler (Admin paneli için)
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

// Herhangi bir siparişin tam detaylarını getirir (Admin paneli için)
exports.getOrderDetailAdmin = async (req, res) => {
  try {
    const siparisResult = await pool.query(`
            SELECT s.*, m.ad, m.soyad, m.email, m.telefon, a.adres_basligi, a.tam_adres, a.posta_kodu, a.sehir, a.ilce
            FROM public.siparis s
            LEFT JOIN public.musteri m ON m.id = s.musteri_id
            LEFT JOIN public.adres a ON a.id = s.adres_id
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
    console.error("Admin Detay Hatası:", err);
    res.status(500).json({ mesaj: "Sipariş detayı alınamadı." });
  }
};

// Sipariş durumunu günceller (Hazırlanıyor -> Kargoya Verildi vb.)
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