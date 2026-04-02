import React from 'react';
import { useNavigate } from "react-router-dom";

export default function SifremiUnuttum() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f5eb' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{color: '#5d4037'}}>Şifremi Unuttum</h2>
        <p style={{color: '#a68b6d', fontSize: '14px', margin: '15px 0'}}>E-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim.</p>
        <input type="email" placeholder="E-posta Adresiniz" style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #e8dcc4', marginBottom: '20px', outline: 'none' }} />
        <button style={{ width: '100%', padding: '16px', backgroundColor: '#5d4037', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Bağlantı Gönder</button>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#8b7355', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate("/giris-yap")}>Giriş Sayfasına Dön</p>
      </div>
    </div>
  );
}
