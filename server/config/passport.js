const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // DÜZELTME: CALLBACK_URL yerine GOOGLE_CALLBACK_URL yapıldı
      callbackURL: process.env.GOOGLE_CALLBACK_URL, 
      callbackURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Kullanıcıyı session'a kaydetme (Giriş yaptıktan sonra hatırla)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
