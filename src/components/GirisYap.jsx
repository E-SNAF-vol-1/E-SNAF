import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function GirisYap() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const { girisYap } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHata('');

    try {
      await girisYap(email, sifre);
      navigate("/hesabim");
    } catch (err) {
      const mesaj = err?.response?.data?.mesaj || "Giriş başarısız. E-posta veya şifrenizi kontrol edin.";
      setHata(mesaj);
    } finally {
      setIsLoading(false);
    }
  };

  const s = {
    wrapper: {
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', backgroundColor: '#f8f5eb',
      padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: '#ffffff', padding: '50px 40px', borderRadius: '32px',
      boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)',
      width: '100%', maxWidth: '440px', textAlign: 'center'
    },
    title: { color: '#5d4037', fontSize: '32px', fontWeight: '900', margin: '0', letterSpacing: '2px' },
    subtitle: { color: '#a68b6d', fontSize: '15px', marginTop: '10px', fontWeight: '500' },
    form: { marginTop: '35px', textAlign: 'left' },
    label: {
      display: 'block', color: '#5d4037', fontSize: '13px',
      fontWeight: '700', marginBottom: '8px', marginLeft: '4px'
    },
    inputGroup: { position: 'relative', marginBottom: '20px' },
    input: {
      width: '100%', padding: '16px 20px', borderRadius: '16px',
      border: '1.5px solid #eee', backgroundColor: '#fdfdfd',
      fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#333'
    },
    inputHata: {
      width: '100%', padding: '16px 20px', borderRadius: '16px',
      border: '1.5px solid #e53935', backgroundColor: '#fff8f8',
      fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#333'
    },
    passwordToggle: {
      position: 'absolute', right: '15px', top: '42px',
      background: 'none', border: 'none', color: '#d2b48c',
      cursor: 'pointer', fontWeight: 'bold', fontSize: '11px'
    },
    hataKutu: {
      backgroundColor: '#fff3f3', border: '1px solid #ffcdd2',
      borderRadius: '12px', padding: '14px 18px',
      color: '#c62828', fontSize: '14px', marginBottom: '20px',
      display: 'flex', alignItems: 'center', gap: '10px'
    },
    submitBtn: {
      width: '100%', padding: '18px',
      backgroundColor: isLoading ? '#d2b48c' : '#5d4037',
      color: '#fff', border: 'none', borderRadius: '16px',
      fontSize: '16px', fontWeight: '800',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      boxShadow: '0 10px 20px rgba(93, 64, 55, 0.15)', marginTop: '8px'
    },
    forgotLink: {
      display: 'block', textAlign: 'right', color: '#a68b6d',
      fontSize: '13px', marginTop: '-10px', marginBottom: '25px',
      cursor: 'pointer', fontWeight: '600', textDecoration: 'none'
    },
    divider: { display: 'flex', alignItems: 'center', margin: '30px 0', color: '#e0d5c1' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#eee' },
    dividerText: { padding: '0 15px', fontSize: '13px', fontWeight: '600' },
    footer: { marginTop: '35px', fontSize: '15px', color: '#8b7355' },
    footerLink: {
      color: '#5d4037', fontWeight: '800', cursor: 'pointer',
      marginLeft: '8px', textDecoration: 'underline'
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div>
          <h1 style={s.title}>E<span style={{ color: '#d2b48c' }}>-</span>SNAF</h1>
          <p style={s.subtitle}>Hesabınıza giriş yapın</p>
        </div>

        <form style={s.form} onSubmit={handleLogin}>
          {/* Hata mesajı */}
          {hata && (
            <div style={s.hataKutu}>
              <span>⚠️</span>
              <span>{hata}</span>
            </div>
          )}

          <div style={s.inputGroup}>
            <label style={s.label}>E-POSTA ADRESİ</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              style={hata ? s.inputHata : s.input}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>ŞİFRE</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              style={hata ? s.inputHata : s.input}
              required
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              style={s.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "GİZLE" : "GÖSTER"}
            </button>
          </div>

          <Link to="/sifremi-unuttum" style={s.forgotLink}>Şifremi Unuttum?</Link>

          <button type="submit" style={s.submitBtn} disabled={isLoading}>
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div style={s.divider}>
          <div style={s.dividerLine}></div>
          <span style={s.dividerText}>veya</span>
          <div style={s.dividerLine}></div>
        </div>

        <div style={s.footer}>
          Hesabınız yok mu?
          <span style={s.footerLink} onClick={() => navigate("/kayit-ol")}>
            Ücretsiz Kayıt Ol
          </span>
        </div>
      </div>
    </div>
  );
}
