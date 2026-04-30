const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Sadece tek bir callbackURL bırakıyoruz.
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://esnaf.apps.srv.aykutdurgut.com.tr/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      // Burası kritik: Kullanıcıyı veritabanınızda (PostgreSQL) 
      // aramalı veya yoksa kaydetmelisiniz.
      return done(null, profile);
    }
  )
);

// Serialize/Deserialize işlemleri session'ın temelidir.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Veritabanı ile senkronize çalışmak için ideal yer burasıdır.
  done(null, user);
});