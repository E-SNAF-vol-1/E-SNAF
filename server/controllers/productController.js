const pool = require("../db");

// Yardımcı Fonksiyon: DB satırlarını frontend formatına dönüştürür
function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    isim: row.urun_adi,
    ad: row.urun_adi,
    aciklama: row.aciklama || "",
    fiyat: row.fiyat ? Number(row.fiyat) : 0,
    stok: row.stok_adedi || 0,
    kategori: row.kategori_adi || "Genel",
    altKategori: row.alt_kategori_adi || "Genel", // Bu isim eski koddakiyle aynı olmalı
    resim: row.gorsel_yolu || "/images/bos.jpg",
    renk: "Standart"
  };
}

// 1. Canlı Arama (Eski koda uyumlu hale getirildi)
exports.liveSearch = async (req, res) => {
  const { q } = req.query;
  const queryTerm = `%${q}%`;

  if (!q || q.length < 2) {
    return res.json({ urunler: [], kategoriler: [], altKategoriler: [] });
  }

  try {
    // Ürünlerde Ara
    const urunler = await pool.query(`
      SELECT u.id, u.urun_adi, u.fiyat, k.kategori_adi, ak.alt_kategori_adi,
      (SELECT ug.gorsel_yolu FROM public.urun_gorsel ug WHERE ug.urun_id = u.id LIMIT 1) as gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE u.urun_adi ILIKE $1 
      LIMIT 5
    `, [queryTerm]);

    // Kategorilerde Ara
    const kategoriler = await pool.query(
      "SELECT id, kategori_adi as ad FROM public.kategori WHERE kategori_adi ILIKE $1 LIMIT 3",
      [queryTerm]
    );

    // Alt Kategorilerde Ara (Eski sütun ismi kullanıldı)
    const altKategoriler = await pool.query(
      "SELECT id, alt_kategori_adi as ad FROM public.alt_kategori WHERE alt_kategori_adi ILIKE $1 LIMIT 3",
      [queryTerm]
    );

    res.json({
      urunler: urunler.rows.map(mapProduct),
      kategoriler: kategoriler.rows,
      altKategoriler: altKategoriler.rows
    });
  } catch (err) {
    console.error("Canlı arama hatası:", err);
    res.status(500).json({ mesaj: "Hata oluştu" });
  }
};

// 2. Genel Arama (Eski çalışan yapıya sadık kalındı)
exports.searchProducts = async (req, res) => {
  const { q } = req.query;
  const queryTerm = `%${q}%`;

  try {
    const query = `
      SELECT u.id, u.urun_adi, u.aciklama, u.fiyat, u.stok_adedi, k.kategori_adi, ak.alt_kategori_adi,
      (SELECT ug.gorsel_yolu FROM public.urun_gorsel ug WHERE ug.urun_id = u.id ORDER BY ug.ana_gorsel_mi DESC LIMIT 1) as gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE u.urun_adi ILIKE $1 
         OR u.aciklama ILIKE $1 
         OR k.kategori_adi ILIKE $1 
         OR ak.alt_kategori_adi ILIKE $1
      ORDER BY u.eklenme_tarihi DESC
    `;
    const result = await pool.query(query, [queryTerm]);
    res.json(result.rows.map(mapProduct));
  } catch (err) {
    console.error("Arama hatası:", err);
    res.status(500).json({ mesaj: "Arama hatası" });
  }
};

// 3. Mevcut Tüm Ürünleri Getir (Eski çalışan yapı)
exports.getAll = async (req, res) => {
  try {
    const { q, kategori_id, alt_kategori_id } = req.query;

    let query = `
      SELECT u.id, u.urun_adi, u.aciklama, u.fiyat, u.stok_adedi, k.kategori_adi, ak.alt_kategori_adi,
      (SELECT ug.gorsel_yolu FROM public.urun_gorsel ug WHERE ug.urun_id = u.id ORDER BY ug.ana_gorsel_mi DESC LIMIT 1) AS gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE 1=1
    `;

    const params = [];
    let i = 1;

    if (q) {
      query += ` AND (LOWER(u.urun_adi) LIKE LOWER($${i}) OR LOWER(COALESCE(u.aciklama, '')) LIKE LOWER($${i}))`;
      params.push(`%${q}%`);
      i++;
    }

    if (kategori_id) {
      query += ` AND k.id = $${i}`;
      params.push(kategori_id);
      i++;
    }

    if (alt_kategori_id) {
      query += ` AND ak.id = $${i}`;
      params.push(alt_kategori_id);
      i++;
    }

    query += ` ORDER BY u.eklenme_tarihi DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows.map(mapProduct));
  } catch (err) {
    console.error("Ürün listeleme hatası:", err);
    res.status(500).json({ mesaj: "Ürünler alınamadı" });
  }
};

// --- Diğer fonksiyonlar (getOne, create, update, remove) eski haliyle devam eder ---
exports.getOne = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.urun_adi, u.aciklama, u.fiyat, u.stok_adedi, k.kategori_adi, ak.alt_kategori_adi,
      (SELECT ug.gorsel_yolu FROM public.urun_gorsel ug WHERE ug.urun_id = u.id LIMIT 1) AS gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE u.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ mesaj: "Ürün bulunamadı" });
    res.json(mapProduct(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Ürün alınamadı" });
  }
};

exports.create = async (req, res) => {
  try {
    const { alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi, gorsel_yolu } = req.body;
    const urunResult = await pool.query(`
      INSERT INTO public.urun (alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi]);

    const urun = urunResult.rows[0];
    if (gorsel_yolu) {
      await pool.query("INSERT INTO public.urun_gorsel (urun_id, gorsel_yolu, ana_gorsel_mi) VALUES ($1, $2, true)", [urun.id, gorsel_yolu]);
    }
    res.status(201).json({ mesaj: "Ürün eklendi", urun });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Ürün eklenemedi" });
  }
};

exports.update = async (req, res) => {
  try {
    const { alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi, gorsel_yolu } = req.body;
    await pool.query(`
      UPDATE public.urun SET alt_kategori_id = $1, urun_adi = $2, aciklama = $3, fiyat = $4, stok_adedi = $5
      WHERE id = $6
    `, [alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi, req.params.id]);

    if (gorsel_yolu) {
      const kontrol = await pool.query("SELECT id FROM public.urun_gorsel WHERE urun_id = $1 AND ana_gorsel_mi = true", [req.params.id]);
      if (kontrol.rows.length > 0) {
        await pool.query("UPDATE public.urun_gorsel SET gorsel_yolu = $1 WHERE urun_id = $2 AND ana_gorsel_mi = true", [gorsel_yolu, req.params.id]);
      } else {
        await pool.query("INSERT INTO public.urun_gorsel (urun_id, gorsel_yolu, ana_gorsel_mi) VALUES ($1, $2, true)", [req.params.id, gorsel_yolu]);
      }
    }
    res.json({ mesaj: "Ürün güncellendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Ürün güncellenemedi" });
  }
};

exports.remove = async (req, res) => {
  try {
    await pool.query("DELETE FROM public.urun WHERE id = $1", [req.params.id]);
    res.json({ mesaj: "Ürün silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Ürün silinemedi" });
  }
};