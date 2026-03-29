const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        k.id,
        k.kategori_adi,
        k.aktif_mi,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ak.id,
              'alt_kategori_adi', ak.alt_kategori_adi
            )
          ) FILTER (WHERE ak.id IS NOT NULL),
          '[]'
        ) AS alt_kategoriler
      FROM public.kategori k
      LEFT JOIN public.alt_kategori ak ON ak.ana_kategori_id = k.id
      WHERE k.aktif_mi = true
      GROUP BY k.id
      ORDER BY k.kategori_adi ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Kategori listesi alınamadı" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { kategori_adi } = req.body;

    const result = await pool.query(
      `INSERT INTO public.kategori (kategori_adi)
       VALUES ($1)
       RETURNING *`,
      [kategori_adi]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Kategori eklenemedi" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await pool.query("DELETE FROM public.kategori WHERE id = $1", [req.params.id]);
    res.json({ mesaj: "Kategori silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Kategori silinemedi" });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { ana_kategori_id, alt_kategori_adi } = req.body;

    const result = await pool.query(
      `INSERT INTO public.alt_kategori (ana_kategori_id, alt_kategori_adi)
       VALUES ($1, $2)
       RETURNING *`,
      [ana_kategori_id, alt_kategori_adi]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Alt kategori eklenemedi" });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    await pool.query("DELETE FROM public.alt_kategori WHERE id = $1", [req.params.id]);
    res.json({ mesaj: "Alt kategori silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Alt kategori silinemedi" });
  }
};