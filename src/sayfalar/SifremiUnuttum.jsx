import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SifremiUnuttum() {
  const [step, setStep] = useState(1); // 1: Email isteme, 2: Kod ve Yeni Şifre
  const [email, setEmail] = useState('');
  const [kod, setKod] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [mesaj, setMesaj] = useState({ tip: '', icerik: '' });
  const navigate = useNavigate();

  // AŞAMA 1: E-posta gönderimi (Kod talebi)
  const handleRequestCode = async (e) => {
    e.preventDefault();
    try {
      // Backend'deki forgot-password endpoint'ine istek atıyoruz
      console.log("Kod talep ediliyor:", email);
      setMesaj({ tip: 'basari', icerik: 'Doğrulama kodu e-postanıza gönderiliyor...' });
      
      // Buraya gerçek API isteğini ekleyeceksin (Örn: axios.post('/api/auth/forgot-password', { email }))
      
      setStep(2); // Simülasyon için doğrudan 2. adıma geçiyoruz
    } catch (err) {
      setMesaj({ tip: 'hata', icerik: 'E-posta gönderilemedi. Lütfen tekrar deneyin.' });
    }
  };

  // AŞAMA 2: Kod doğrulama ve Şifre sıfırlama
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      console.log("Şifre sıfırlanıyor:", { email, kod, yeniSifre });
      
      // Buraya gerçek API isteğini ekleyeceksin (Örn: axios.post('/api/auth/reset-password', { email, kod, yeniSifre }))
      
      setMesaj({ tip: 'basari', icerik: 'Şifreniz başarıyla değiştirildi! Giriş sayfasına yönlendiriliyorsunuz.' });
      setTimeout(() => navigate('/giris-yap'), 3000);
    } catch (err) {
      setMesaj({ tip: 'hata', icerik: 'Kod hatalı veya süresi dolmuş.' });
    }
  };

  const styles = {
    wrapper: { backgroundColor: '#f8f5eb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Tahoma, sans-serif" },
    card: { background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)', width: '100%', maxWidth: '450px', textAlign: 'center' },
    title: { color: '#5d4037', fontSize: '24px', fontWeight: '900', marginBottom: '15px' },
    text: { color: '#8d6e63', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' },
    input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#f9f8f5', marginBottom: '15px', outline: 'none', boxSizing: 'border-box' },
    otpContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
    button: { width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#5d4037', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '20px' },
    alert: { padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '600' },
    link: { color: '#5d4037', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Şifre Sıfırlama</h1>
        
        {mesaj.icerik && (
          <div style={{...styles.alert, backgroundColor: mesaj.tip === 'basari' ? '#e8f5e9' : '#ffebee', color: mesaj.tip === 'basari' ? '#2e7d32' : '#c62828'}}>
            {mesaj.icerik}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode}>
            <p style={styles.text}>Kayıtlı e-posta adresinizi girin, size 6 haneli doğrulama kodunu gönderelim.</p>
            <input 
              type="email" placeholder="E-posta Adresiniz" style={styles.input} required 
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" style={styles.button}>Doğrulama Kodu Gönder</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <p style={styles.text}>E-postanıza gelen 6 haneli kodu ve yeni şifrenizi giriniz.</p>
            
            <input 
              type="text" placeholder="6 Haneli Kod" style={{...styles.input, textAlign: 'center', letterSpacing: '5px', fontWeight: 'bold'}} 
              maxLength="6" required value={kod} onChange={(e) => setKod(e.target.value)}
            />
            
            <input 
              type="password" placeholder="Yeni Şifreniz" style={styles.input} required 
              value={yeniSifre} onChange={(e) => setYeniSifre(e.target.value)}
            />
            
            <button type="submit" style={styles.button}>Şifreyi Güncelle</button>
            <button type="button" onClick={() => setStep(1)} style={{...styles.button, backgroundColor: '#eee', color: '#5d4037', marginTop: '-10px'}}>Geri Dön</button>
          </form>
        )}

        <Link to="/giris-yap" style={styles.link}>Giriş Sayfasına Dön</Link>
      </div>
    </div>
  );
}