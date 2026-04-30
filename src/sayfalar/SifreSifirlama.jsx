import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SifreSifirlama() {
  const [formData, setFormData] = useState({ email: '', code: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }
    // Backend API bağlantısı buraya gelecek
    alert("Şifreniz başarıyla güncellendi!");
    navigate("/giris-yap");
  };

  const styles = {
    wrapper: { backgroundColor: '#f8f5eb', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Segoe UI', sans-serif" },
    card: { background: '#ffffff', padding: '50px', borderRadius: '32px', boxShadow: '0 30px 80px rgba(93, 64, 55, 0.15)', width: '100%', maxWidth: '480px' },
    title: { color: '#5d4037', fontSize: '28px', fontWeight: '900', marginBottom: '35px', textAlign: 'center' },
    input: { width: '100%', padding: '16px', borderRadius: '16px', border: '1.5px solid #e0e0e0', marginBottom: '15px', boxSizing: 'border-box', fontSize: '16px' },
    button: { width: '100%', padding: '16px', backgroundColor: '#5d4037', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Yeni Şifre Belirle</h2>
        <form onSubmit={handleResetPassword}>
          <input style={styles.input} placeholder="E-posta adresiniz" type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input style={styles.input} placeholder="Doğrulama Kodu" type="text" required onChange={(e) => setFormData({...formData, code: e.target.value})} />
          <input style={styles.input} placeholder="Yeni Şifre" type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <input style={styles.input} placeholder="Yeni Şifre (Tekrar)" type="password" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          <button type="submit" style={styles.button}>Şifremi Güncelle</button>
        </form>
      </div>
    </div>
  );
}
