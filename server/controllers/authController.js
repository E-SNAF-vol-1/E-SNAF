const pool = require("../db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// --- E-POSTA YAPILANDIRMASI ---
// Gmail kullanıyorsanız .env dosyanızda EMAIL_USER ve EMAIL_PASS (Uygulama Şifresi) tanımlı olmalıdır.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- KAYIT VE GİRİŞ FONKSİYONLARI ---

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
    
    req.session.save(() => {
      res.status(201).json({
        mesaj: "Kayıt başarılı",
        user: result.rows[0]
      });
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

    req.session.user.isGoogleLogin = false;

    req.session.save(() => {
      res.json({
        mesaj: "Giriş başarılı",
        user: req.session.user
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sunucu hatası" });
  }
};

// --- ŞİFREMİ UNUTTUM VE DOĞRULAMA KODU İŞLEMLERİ ---

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT id, ad FROM public.musteri WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mesaj: "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı." });
    }

    // 6 haneli rastgele kod üret
    const dogrulamaKodu = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Kodu ve e-postayı session'a kaydet (10 dakika geçerli)
    req.session.resetCode = dogrulamaKodu;
    req.session.resetEmail = email;

    const mailOptions = {
      from: `"E-SNAF Destek" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "E-SNAF Şifre Sıfırlama Doğrulama Kodu",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; color: #5d4037;">
          <h2>Şifre Sıfırlama Talebi</h2>
          <p>Merhaba ${result.rows[0].ad},</p>
          <p>Hesabınızın şifresini sıfırlamak için doğrulama kodunuz:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 15px; background-color: #f8f5eb; display: inline-block; border-radius: 10px; letter-spacing: 5px;">
            ${dogrulamaKodu}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #8d6e63;">Bu kod kısa bir süre için geçerlidir. Talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ mesaj: "Doğrulama kodu e-postanıza gönderildi." });
  } catch (err) {
    console.error("E-posta gönderim hatası:", err);
    res.status(500).json({ mesaj: "E-posta gönderilemedi." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, yeniSifre, kod } = req.body;
    
    if (!email || !yeniSifre || !kod) {
      return res.status(400).json({ mesaj: "Tüm alanlar (Email, Yeni Şifre, Kod) gereklidir." });
    }

    // Kod kontrolü
    if (kod !== req.session.resetCode || email !== req.session.resetEmail) {
      return res.status(400).json({ mesaj: "Doğrulama kodu geçersiz veya süresi dolmuş." });
    }

    const sifreHash = await bcrypt.hash(yeniSifre, 10);

    const result = await pool.query(
      "UPDATE public.musteri SET sifre = $1 WHERE email = $2 RETURNING id",
      [sifreHash, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mesaj: "Kullanıcı bulunamadı." });
    }

    // Başarılı işlemden sonra session verilerini temizle
    delete req.session.resetCode;
    delete req.session.resetEmail;

    res.json({ mesaj: "Şifreniz başarıyla güncellendi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Şifre güncellenirken sunucu hatası oluştu." });
  }
};

// --- GOOGLE LOGIN DESTEĞİ ---

exports.googleCallback = (req, res) => {
  if (req.user) {
    req.session.user = {
      id: req.user.id || req.user.googleId,
      ad: req.user.displayName || req.user.ad,
      email: req.user.emails ? req.user.emails[0].value : req.user.email,
      isGoogleLogin: true
    };

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? "https://esnaf.apps.srv.aykutdurgut.com.tr" 
      : (process.env.CLIENT_URL || "http://localhost:5173");
    
    const finalRedirect = `${baseUrl}/hesabim?v=${Date.now()}`;

    req.session.save((err) => {
      if (err) {
        console.error("Session kaydedilemedi:", err);
        return res.redirect(`${baseUrl}/giris-yap?error=session`);
      }
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.redirect(finalRedirect);
    });
  } else {
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${baseUrl}/giris-yap?error=auth_failed`);
  }
};

// --- ADMIN VE GENEL İŞLEMLER ---

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

    req.session.save(() => {
      res.json({
        mesaj: "Admin girişi başarılı",
        admin: req.session.admin
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Sunucu hatası" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Çıkış hatası:", err);
    res.clearCookie('connect.sid');
    res.json({ mesaj: "Çıkış başarılı" });
  });
};

exports.me = (req, res) => {
  res.json({
    user: req.session.user || null,
    admin: req.session.admin || null
  });
};