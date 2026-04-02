import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function GirisYap() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- GELİŞMİŞ API GİRİŞ FONKSİYONU ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Arkadaşının server/controllers/authController.js dosyasına gidecek olan yapı
      console.log("Sunucuya istek gönderiliyor...", { email, password });
      
      // Gerçek API bağlantısı örneği:
      // const response = await fetch('http://localhost:5000/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // Simülasyon (1.5 saniye bekleme)
      setTimeout(() => {
        setIsLoading(false);
        alert("E-SNAF Sistemine Başarıyla Giriş Yapıldı!");
        navigate("/"); 
      }, 1500);

    } catch (error) {
      console.error("Giriş Hatası:", error);
      alert("Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.");
      setIsLoading(false);
    }
  };

  // --- PROFESYONEL STİL SİSTEMİ ---
  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f5eb', // Anasayfa ile uyumlu bej arka plan
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: '#ffffff',
      padding: '50px 40px',
      borderRadius: '32px',
      boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)',
      width: '100%',
      maxWidth: '440px',
      textAlign: 'center',
      transition: 'transform 0.3s ease'
    },
    logoArea: {
      marginBottom: '30px'
    },
    title: {
      color: '#5d4037',
      fontSize: '32px',
      fontWeight: '900',
      margin: '0',
      letterSpacing: '2px'
    },
    subtitle: {
      color: '#a68b6d',
      fontSize: '15px',
      marginTop: '10px',
      fontWeight: '500'
    },
    form: {
      marginTop: '40px',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      color: '#5d4037',
      fontSize: '13px',
      fontWeight: '700',
      marginBottom: '8px',
      marginLeft: '4px'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1.5px solid #eee',
      backgroundColor: '#fdfdfd',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      color: '#333'
    },
    passwordToggle: {
      position: 'absolute',
      right: '15px',
      top: '42px',
      background: 'none',
      border: 'none',
      color: '#d2b48c',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '11px'
    },
    forgotPassword: {
      display: 'block',
      textAlign: 'right',
      color: '#a68b6d',
      fontSize: '13px',
      textDecoration: 'none',
      marginTop: '-10px',
      marginBottom: '25px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    submitBtn: {
      width: '100%',
      padding: '18px',
      backgroundColor: isLoading ? '#d2b48c' : '#5d4037',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '800',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 20px rgba(93, 64, 55, 0.15)'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '35px 0',
      color: '#e0d5c1'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#eee'
    },
    dividerText: {
      padding: '0 15px',
      fontSize: '13px',
      fontWeight: '600'
    },
    socialGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    socialBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '14px',
      border: '1.5px solid #eee',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#555',
      transition: 'background 0.2s'
    },
    footer: {
      marginTop: '40px',
      fontSize: '15px',
      color: '#8b7355'
    },
    footerLink: {
      color: '#5d4037',
      fontWeight: '800',
      cursor: 'pointer',
      marginLeft: '8px',
      textDecoration: 'underline'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Üst Kısım */}
        <div style={styles.logoArea}>
          <h1 style={styles.title}>E<span style={{color:'#d2b48c'}}>-</span>SNAF</h1>
          <p style={styles.subtitle}>Dijital Esnaf Kapınıza Geliyor</p>
        </div>

        {/* Form Kısmı */}
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-POSTA ADRESİ</label>
            <input 
              type="email" 
              placeholder="örnek@mail.com" 
              style={styles.input}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ŞİFRE</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              style={styles.input}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              style={styles.passwordToggle} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "GİZLE" : "GÖSTER"}
            </button>
          </div>

          <span style={styles.forgotPassword} onClick={() => navigate("/sifremi-unuttum")}>
            Şifremi Unuttum?
          </span>

          <button type="submit" style={styles.submitBtn} disabled={isLoading}>
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Ayraç */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>veya şununla devam et</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Sosyal Medya Butonları */}
        <div style={styles.socialGroup}>
          <button style={styles.socialBtn} onClick={() => alert("Google Girişi")}>
            <span style={{color:'#EA4335', fontSize:'18px', fontWeight:'bold'}}>G</span> Google ile Giriş
          </button>
          <button style={{...styles.socialBtn, color: '#1877F2'}} onClick={() => alert("Facebook Girişi")}>
            <span style={{fontSize:'18px', fontWeight:'bold'}}>f</span> Facebook ile Giriş
          </button>
        </div>

        {/* Alt Kısım */}
        <div style={styles.footer}>
          Hesabınız yok mu? 
          <span style={styles.footerLink} onClick={() => navigate("/kayit-ol")}>
            Ücretsiz Kayıt Ol
          </span>
        </div>
      </div>
    </div>
  );
}