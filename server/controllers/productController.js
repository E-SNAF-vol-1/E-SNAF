const pool = require("../db");

function mapProduct(row) {
  return {
    id: row.id,
    isim: row.urun_adi,
    ad: row.urun_adi,
    aciklama: row.aciklama,
    fiyat: Number(row.fiyat),
    stok: row.stok_adedi,
    kategori: row.kategori_adi,
    altKategori: row.alt_kategori_adi,
    resim: row.gorsel_yolu || "/images/canta.jpg",
    renk: "Standart"
  };
}

exports.getAll = async (req, res) => {
  try {
    const { q, kategori_id, alt_kategori_id } = req.query;

    let query = `
      SELECT
        u.id,
        u.urun_adi,
        u.aciklama,
        u.fiyat,
        u.stok_adedi,
        k.kategori_adi,
        ak.alt_kategori_adi,
        (
          SELECT ug.gorsel_yolu
          FROM public.urun_gorsel ug
          WHERE ug.urun_id = u.id
          ORDER BY ug.ana_gorsel_mi DESC, ug.id ASC
          LIMIT 1
        ) AS gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE 1=1
    `;

    const params = [];
    let i = 1;

    if (q) {
      query += ` AND (
        LOWER(u.urun_adi) LIKE LOWER($${i})
        OR LOWER(COALESCE(u.aciklama, '')) LIKE LOWER($${i})
        OR LOWER(COALESCE(k.kategori_adi, '')) LIKE LOWER($${i})
        OR LOWER(COALESCE(ak.alt_kategori_adi, '')) LIKE LOWER($${i})
      )`;
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
    console.error(err);
    res.status(500).json({ mesaj: "Ürünler alınamadı" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.urun_adi,
        u.aciklama,
        u.fiyat,
        u.stok_adedi,
        k.kategori_adi,
        ak.alt_kategori_adi,
        (
          SELECT ug.gorsel_yolu
          FROM public.urun_gorsel ug
          WHERE ug.urun_id = u.id
          ORDER BY ug.ana_gorsel_mi DESC, ug.id ASC
          LIMIT 1
        ) AS gorsel_yolu
      FROM public.urun u
      LEFT JOIN public.alt_kategori ak ON ak.id = u.alt_kategori_id
      LEFT JOIN public.kategori k ON k.id = ak.ana_kategori_id
      WHERE u.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mesaj: "Ürün bulunamadı" });
    }

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
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi]);

    const urun = urunResult.rows[0];

    if (gorsel_yolu) {
      await pool.query(`
        INSERT INTO public.urun_gorsel (urun_id, gorsel_yolu, ana_gorsel_mi)
        VALUES ($1, $2, true)
      `, [urun.id, gorsel_yolu]);
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
      UPDATE public.urun
      SET alt_kategori_id = $1,
          urun_adi = $2,
          aciklama = $3,
          fiyat = $4,
          stok_adedi = $5
      WHERE id = $6
    `, [alt_kategori_id, urun_adi, aciklama, fiyat, stok_adedi, req.params.id]);

    if (gorsel_yolu) {
      const kontrol = await pool.query(
        "SELECT id FROM public.urun_gorsel WHERE urun_id = $1 AND ana_gorsel_mi = true",
        [req.params.id]
      );

      if (kontrol.rows.length > 0) {
        await pool.query(
          "UPDATE public.urun_gorsel SET gorsel_yolu = $1 WHERE urun_id = $2 AND ana_gorsel_mi = true",
          [gorsel_yolu, req.params.id]
        );
      } else {
        await pool.query(
          "INSERT INTO public.urun_gorsel (urun_id, gorsel_yolu, ana_gorsel_mi) VALUES ($1, $2, true)",
          [req.params.id, gorsel_yolu]
        );
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