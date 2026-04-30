const express = require("express");
const router = express.Router();
const passport = require("passport"); // Google Login için eklendi
const controller = require("../controllers/authController");

// --- MEVCUT ROTALAR ---
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/admin/login", controller.loginAdmin);
router.post("/logout", controller.logout);
router.get("/me", controller.me);

// --- ŞİFREMİ UNUTTUM ROTALARI (Yeni eklendi) ---

// 1. Şifre sıfırlama talebi oluşturma (E-posta kontrolü)
router.post("/forgot-password", controller.forgotPassword);

// 2. Yeni şifreyi veritabanına kaydetme
router.post("/reset-password", controller.resetPassword);

// --- GOOGLE LOGIN ROTLARI ---

// 1. Google ile Giriş Başlatma Rotası
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google'dan Dönüş (Callback) Rotası
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=google-failed" }),
  controller.googleCallback // controller içindeki yönlendirme fonksiyonu
);

module.exports = router;