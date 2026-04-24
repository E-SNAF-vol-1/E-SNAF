const pool = require("../db");

// Yardımcı Fonksiyon: DB satırlarını frontend formatına dönüştürür
function mapProduct(row) {
    if (!row) return null;
    return {
        id: row.id,
        isim: row.urun_adi || "İsimsiz Ürün",
        ad: row.urun_adi || "İsimsiz Ürün",
        aciklama: row.aciklama || "",
        fiyat: row.fiyat ? Number(row.fiyat) : 0,
        stok: row.stok_adedi || 0,
        kategori: row.kategori_adi || "Genel", // Hata veren kısım burasıydı, artık boş kalamaz
        altKategori: row.alt_kategori_adi || "Genel",
        resim: row.gorsel_yolu || "/images/bos.jpg",
        renk: "Standart"
    };
}

// Canlı Arama (Dropdown için)
exports.liveSearch = async (req, res) => {
    const { q } = req.query;
    const queryTerm = `%${q}%`;
    if (!q || q.length < 2) return res.json({ urunler: [], kategoriler: [], altKategoriler: [] });

    try {
        const urunler = await pool.query(`
      SELECT u.id, u.urun_adi, u.fiyat, k.kategori_adi, ak.alt_kategori_adi,
      (SELECT ug.gorsel_yolu FROM public.urun_gorsel ug WHERE ug.urun_id = u.id LIMIT 1) as gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE u.urun_adi ILIKE $1 LIMIT 5
    `, [queryTerm]);

        res.json({
            urunler: urunler.rows.map(mapProduct),
            kategoriler: [], // Hata almamak için boş dizi gönderiyoruz
            altKategoriler: []
        });
    } catch (err) {
        console.error("Canlı Arama Hatası:", err);
        res.status(500).json({ mesaj: "Hata" });
    }
};

// Genel Arama (Sayfa için)
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
      WHERE u.urun_adi ILIKE $1 OR u.aciklama ILIKE $1 OR k.kategori_adi ILIKE $1 OR ak.alt_kategori_adi ILIKE $1
      ORDER BY u.eklenme_tarihi DESC
    `;
        const result = await pool.query(query, [queryTerm]);
        res.json(result.rows.map(mapProduct));
    } catch (err) {
        console.error("Arama Hatası:", err);
        res.status(500).json({ mesaj: "Hata" });
    }
};