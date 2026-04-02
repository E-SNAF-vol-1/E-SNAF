const pool = require("../db");

exports.getMyAddresses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        s.sehir_adi
      FROM public.adres a
      LEFT JOIN public.sehir s ON s.id = a.sehir_id
      WHERE a.musteri_id = $1
      ORDER BY a.id DESC
    `, [req.session.user.id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Adresler alınamadı" });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { sehir_id, adres_basligi, tam_adres, posta_kodu } = req.body;

    if (!sehir_id || !tam_adres) {
      return res.status(400).json({ mesaj: "Şehir ve tam adres zorunludur" });
    }

    const result = await pool.query(`
      INSERT INTO public.adres (musteri_id, sehir_id, adres_basligi, tam_adres, posta_kodu)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      req.session.user.id,
      sehir_id,
      adres_basligi || null,
      tam_adres,
      posta_kodu || null
    ]);

    res.status(201).json({
      mesaj: "Adres eklendi",
      adres: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Adres eklenemedi" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { sehir_id, adres_basligi, tam_adres, posta_kodu } = req.body;

    const result = await pool.query(`
      UPDATE public.adres
      SET sehir_id = $1,
          adres_basligi = $2,
          tam_adres = $3,
          posta_kodu = $4
      WHERE id = $5 AND musteri_id = $6
      RETURNING *
    `, [
      sehir_id,
      adres_basligi || null,
      tam_adres,
      posta_kodu || null,
      req.params.id,
      req.session.user.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mesaj: "Adres bulunamadı" });
    }

    res.json({
      mesaj: "Adres güncellendi",
      adres: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Adres güncellenemedi" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM public.adres
      WHERE id = $1 AND musteri_id = $2
      RETURNING *
    `, [req.params.id, req.session.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mesaj: "Adres bulunamadı" });
    }

    res.json({ mesaj: "Adres silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Adres silinemedi" });
  }
};