const pool = require("../db");

// Yardımcı Fonksiyon: DB satırlarını frontend formatına dönüştürür
function mapProduct(row) {
  if (!row) return null; //
  return {
    id: row.id, //
    isim: row.urun_adi, //
    ad: row.urun_adi, //
    aciklama: row.aciklama || "", //
    fiyat: row.fiyat ? Number(row.fiyat) : 0, //
    stok: row.stok_adedi || 0, //
    kategori: row.kategori_adi || "Genel", //
    altKategori: row.alt_kategori_adi || "Genel", //
    resim: row.gorsel_yolu || "/images/bos.jpg", //
    renk: "Standart" //
  };
}

// 1. Canlı Arama (Kategori ve Alt Kategori İsimleri Frontend ile Barıştırıldı)
exports.liveSearch = async (req, res) => {
  const { q } = req.query; //
  const queryTerm = `%${q}%`; //

  if (!q || q.length < 2) {
    return res.json({ urunler: [], kategoriler: [], altKategoriler: [] }); //
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
    `, [queryTerm]); //

    // Kategorilerde Ara (Frontend "ad" veya "kategori_adi" bekleyebilir, ikisini de veriyoruz)
    const kategoriler = await pool.query(`
      SELECT id, kategori_adi, kategori_adi as ad 
      FROM public.kategori 
      WHERE kategori_adi ILIKE $1 
      LIMIT 3
    `, [queryTerm]); //

    // Alt Kategorilerde Ara (Frontend "ad" veya "alt_kategori_adi" bekleyebilir)
    const altKategoriler = await pool.query(`
      SELECT id, alt_kategori_adi, alt_kategori_adi as ad 
      FROM public.alt_kategori 
      WHERE alt_kategori_adi ILIKE $1 
      LIMIT 3
    `, [queryTerm]); //

    // Kraliçem, buradaki "rows" eki frontend'in veriye ulaşmasını sağlar
    res.json({
      urunler: urunler.rows.map(mapProduct),
      kategoriler: kategoriler.rows,
      altKategoriler: altKategoriler.rows
    });
  } catch (err) {
    console.error("Canlı arama hatası:", err); //
    res.status(500).json({ mesaj: "Canlı arama hatası" }); //
  }
};

// 2. Genel Arama (Eski çalışan düzene sadık kalındı)
exports.searchProducts = async (req, res) => {
  const { q } = req.query; //
  const queryTerm = `%${q}%`; //

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
    `; //
    const result = await pool.query(query, [queryTerm]); //
    res.json(result.rows.map(mapProduct)); //
  } catch (err) {
    console.error("Arama hatası:", err); //
    res.status(500).json({ mesaj: "Arama hatası" }); //
  }
};

// 3. Tüm Ürünleri Getir (Eski tam çalışan yapı)
exports.getAll = async (req, res) => {
  try {
    const { q, kategori_id, alt_kategori_id } = req.query; //

    let query = `
      SELECT u.id, u.urun_adi, u.aciklama, u.fiyat, u.stok_adedi, k.kategori_adi, ak.alt_kategori_adi,
      (SELECT ug.gorsel_yolu FROM public.urun_gorsel ug WHERE ug.urun_id = u.id ORDER BY ug.ana_gorsel_mi DESC LIMIT 1) AS gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE 1=1
    `; //

    const params = [];
    let i = 1;

    if (q) {
      query += ` AND (LOWER(u.urun_adi) LIKE LOWER($${i}) OR LOWER(COALESCE(u.aciklama, '')) LIKE LOWER($${i}))`; //
      params.push(`%${q}%`);
      i++;
    }

    if (kategori_id) {
      query += ` AND k.id = $${i}`; //
      params.push(kategori_id);
      i++;
    }

    if (alt_kategori_id) {
      query += ` AND ak.id = $${i}`; //
      params.push(alt_kategori_id);
      i++;
    }

    query += ` ORDER BY u.eklenme_tarihi DESC`; //
    const result = await pool.query(query, params); //
    res.json(result.rows.map(mapProduct)); //
  } catch (err) {
    console.error("Ürün listeleme hatası:", err); //
    res.status(500).json({ mesaj: "Ürünler alınamadı" }); //
  }
};