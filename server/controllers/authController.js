const pool = require("../db");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { ad, soyad, email, sifre, telefon } = req.body;

    if (!ad || !soyad || !email || !sifre) {
      return res.status(400).json({ mesaj: "Zorunlu alanlar eksik" });
    }

    const mevcut = await pool.query(
      "SELECT id FROM public.musteri WHERE email = $1",
      [email]
    );

    if (mevcut.rows.length > 0) {
      return res.status(409).json({ mesaj: "Bu email zaten kayıtlı" });
    }

    const sifreHash = await bcrypt.hash(sifre, 10);

    const result = await pool.query(
      `INSERT INTO public.musteri (ad, soyad, email, sifre, telefon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, ad, soyad, email, telefon`,
      [ad, soyad, email, sifreHash, telefon || null]
    );

    req.session.user = result.rows[0];

    res.status(201).json({
      mesaj: "Kayıt başarılı",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sunucu hatası" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    const result = await pool.query(
      "SELECT * FROM public.musteri WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mesaj: "Kullanıcı bulunamadı" });
    }

    const user = result.rows[0];
    const sifreDogru = await bcrypt.compare(sifre, user.sifre);

    if (!sifreDogru) {
      return res.status(401).json({ mesaj: "Şifre hatalı" });
    }

    req.session.user = {
      id: user.id,
      ad: user.ad,
      soyad: user.soyad,
      email: user.email,
      telefon: user.telefon
    };

    res.json({
      mesaj: "Giriş başarılı",
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sunucu hatası" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { kullanici_adi, sifre } = req.body;

    const result = await pool.query(
      "SELECT * FROM public.yonetim_hesaplari WHERE kullanici_adi = $1",
      [kullanici_adi]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mesaj: "Admin bulunamadı" });
    }

    const admin = result.rows[0];
    const sifreDogru = await bcrypt.compare(sifre, admin.sifre);

    if (!sifreDogru) {
      return res.status(401).json({ mesaj: "Şifre hatalı" });
    }

    req.session.admin = {
      id: admin.id,
      kullanici_adi: admin.kullanici_adi,
      rol: admin.rol
    };

    res.json({
      mesaj: "Admin girişi başarılı",
      admin: req.session.admin
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sunucu hatası" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ mesaj: "Çıkış başarılı" });
  });
};

exports.me = (req, res) => {
  res.json({
    user: req.session.user || null,
    admin: req.session.admin || null
  });
};