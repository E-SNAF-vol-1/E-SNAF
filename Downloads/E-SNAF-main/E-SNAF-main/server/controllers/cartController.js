const pool = require("../db");

exports.getCart = async (req, res) => {
  try {
    const musteriId = req.session.user.id;

    const result = await pool.query(
      "SELECT sepet_icerigi FROM public.sepet_detay WHERE musteri_id = $1",
      [musteriId]
    );

    if (result.rows.length === 0) {
      return res.json([]);
    }

    res.json(result.rows[0].sepet_icerigi || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sepet alınamadı" });
  }
};

exports.saveCart = async (req, res) => {
  try {
    const musteriId = req.session.user.id;
    const { sepet } = req.body;

    await pool.query(`
      INSERT INTO public.sepet_detay (musteri_id, sepet_icerigi, guncelleme_tarihi)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (musteri_id)
      DO UPDATE SET
        sepet_icerigi = EXCLUDED.sepet_icerigi,
        guncelleme_tarihi = CURRENT_TIMESTAMP
    `, [musteriId, JSON.stringify(sepet)]);

    res.json({ mesaj: "Sepet kaydedildi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sepet kaydedilemedi" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const musteriId = req.session.user.id;

    await pool.query(`
      INSERT INTO public.sepet_detay (musteri_id, sepet_icerigi, guncelleme_tarihi)
      VALUES ($1, '[]'::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (musteri_id)
      DO UPDATE SET
        sepet_icerigi = '[]'::jsonb,
        guncelleme_tarihi = CURRENT_TIMESTAMP
    `, [musteriId]);

    res.json({ mesaj: "Sepet temizlendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sepet temizlenemedi" });
  }
};