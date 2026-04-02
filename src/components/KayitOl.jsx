import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function KayitOl() {
  const [formData, setFormData] = useState({
    adSoyad: '',
    email: '',
    telefon: '',
    sifre: '',
    sifreTekrar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- KAYIT FONKSİYONU ---
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Şifre kontrolü
    if (formData.sifre !== formData.sifreTekrar) {
      alert("Hata: Girdiğiniz şifreler birbiriyle eşleşmiyor!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Yeni kullanıcı verisi gönderiliyor:", formData);
      
      // Simülasyon
      setTimeout(() => {
        setIsLoading(false);
        alert("Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
        navigate("/giris-yap"); 
      }, 1500);

    } catch (error) {
      alert("Kayıt sırasında bir hata oluştu.");
      setIsLoading(false);
    }
  };

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f5eb',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, sans-serif"
    },
    card: {
      background: '#ffffff',
      padding: '40px',
      borderRadius: '32px',
      boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)',
      width: '100%',
      maxWidth: '460px',
      textAlign: 'center'
    },
    title: { color: '#5d4037', fontSize: '28px', fontWeight: '900', margin: '0', letterSpacing: '1px' },
    subtitle: { color: '#a68b6d', fontSize: '14px', marginTop: '8px', fontWeight: '500' },
    form: { marginTop: '30px', textAlign: 'left' },
    label: { display: 'block', color: '#5d4037', fontSize: '12px', fontWeight: '700', marginBottom: '6px', marginLeft: '4px' },
    input: {
      width: '100%',
      padding: '14px 18px',
      borderRadius: '14px',
      border: '1.5px solid #eee',
      backgroundColor: '#fdfdfd',
      fontSize: '14px',
      outline: 'none',
      marginBottom: '15px',
      boxSizing: 'border-box',
      color: '#333'
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      backgroundColor: isLoading ? '#d2b48c' : '#5d4037',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: '800',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      marginTop: '15px',
      boxShadow: '0 8px 16px rgba(93, 64, 55, 0.1)'
    },
    footer: { marginTop: '30px', fontSize: '14px', color: '#8b7355' },
    footerLink: { color: '#5d4037', fontWeight: '800', cursor: 'pointer', marginLeft: '6px', textDecoration: 'underline' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>KAYIT OL</h1>
        <p style={styles.subtitle}>E-SNAF ailesine bugün katılın.</p>

        <form style={styles.form} onSubmit={handleRegister}>
          <label style={styles.label}>AD SOYAD</label>
          <input 
            type="text" placeholder="Adınız ve Soyadınız" style={styles.input} required 
            onChange={(e) => setFormData({...formData, adSoyad: e.target.value})}
          />

          <label style={styles.label}>E-POSTA</label>
          <input 
            type="email" placeholder="ornek@mail.com" style={styles.input} required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <label style={styles.label}>TELEFON</label>
          <input 
            type="tel" placeholder="05XX XXX XX XX" style={styles.input} required 
            onChange={(e) => setFormData({...formData, telefon: e.target.value})}
          />

          <div style={{display: 'flex', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={styles.label}>ŞİFRE</label>
              <input 
                type="password" placeholder="••••••" style={styles.input} required 
                onChange={(e) => setFormData({...formData, sifre: e.target.value})}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={styles.label}>TEKRAR</label>
              <input 
                type="password" placeholder="••••••" style={styles.input} required 
                onChange={(e) => setFormData({...formData, sifreTekrar: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={isLoading}>
            {isLoading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div style={styles.footer}>
          Zaten üye misiniz? 
          <span style={styles.footerLink} onClick={() => navigate("/giris-yap")}>
            Giriş Yap
          </span>
        </div>
      </div>
    </div>
  );
}