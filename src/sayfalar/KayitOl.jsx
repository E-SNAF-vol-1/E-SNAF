import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

export default function KayitOl() {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    sifre: '',
    sifreTekrar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.sifre !== formData.sifreTekrar) {
      alert("Hata: Şifreler eşleşmiyor!");
      return;
    }

    setIsLoading(true);
    try {
      // DÜZELTME: kayitVerisi yerine formData kullanıldı
      const response = await axios.post('https://esnaf.apps.srv.aykutdurgut.com.tr/api/auth/register', formData);
      alert("Hesabınız başarıyla oluşturuldu.");
      navigate("/giris-yap");
    } catch (error) {
      console.error("Kayıt hatası:", error); // Hatayı konsolda görelim
      alert("Kayıt sırasında bir hata oluştu: " + (error.response?.data?.mesaj || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f5eb', padding: '20px', fontFamily: "'Segoe UI', Tahoma, sans-serif" },
    card: { background: '#ffffff', padding: '30px', borderRadius: '32px', boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)', width: '100%', maxWidth: '460px' },
    title: { color: '#5d4037', fontSize: '26px', fontWeight: '900', textAlign: 'center', margin: '0 0 5px 0' },
    subTitle: { color: '#8d6e63', fontSize: '14px', textAlign: 'center', marginBottom: '25px' },
    label: { display: 'block', color: '#5d4037', fontSize: '12px', fontWeight: '700', marginBottom: '6px', marginLeft: '4px' },
    input: { width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #eee', backgroundColor: '#fdfdfd', fontSize: '14px', marginBottom: '15px', boxSizing: 'border-box' },
    passwordWrapper: { position: 'relative' },
    // DÜZELTME: 'px' yerine '18px' yapıldı
    eyeBtn: { position: 'absolute', right: '15px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
    submitBtn: { width: '100%', padding: '16px', backgroundColor: '#5d4037', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', marginTop: '10px' },
    footer: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#8d6e63' },
    link: { color: '#5d4037', fontWeight: '700', textDecoration: 'none' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>KAYIT OL</h1>
        <p style={styles.subTitle}>E-SNAF ailesine bugün katılın.</p>
        
        <form onSubmit={handleRegister}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>AD</label>
              <input style={styles.input} type="text" placeholder="Adınız" required onChange={(e) => setFormData({...formData, ad: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>SOYAD</label>
              <input style={styles.input} type="text" placeholder="Soyadınız" required onChange={(e) => setFormData({...formData, soyad: e.target.value})} />
            </div>
          </div>

          <label style={styles.label}>E-POSTA</label>
          <input style={styles.input} type="email" placeholder="örnek@mail.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />

          <label style={styles.label}>TELEFON</label>
          <input 
            style={styles.input} type="tel" maxLength="11" placeholder="05xxxxxxxxx" required 
            value={formData.telefon}
            onChange={(e) => setFormData({...formData, telefon: e.target.value.replace(/[^0-9]/g, '')})} 
          />

          <div style={{display: 'flex', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={styles.label}>ŞİFRE</label>
              <div style={styles.passwordWrapper}>
                <input style={styles.input} type={showPassword ? "text" : "password"} placeholder="••••••••" required onChange={(e) => setFormData({...formData, sifre: e.target.value})} />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div style={{flex: 1}}>
              <label style={styles.label}>TEKRAR</label>
              <input style={styles.input} type="password" placeholder="••••••••" required onChange={(e) => setFormData({...formData, sifreTekrar: e.target.value})} />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={isLoading}>
            {isLoading ? "İşleniyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div style={styles.footer}>
          Zaten hesabınız var mı? <Link to="/giris-yap" style={styles.link}>Giriş Yapın</Link>
        </div>
      </div>
    </div>
  );
}
