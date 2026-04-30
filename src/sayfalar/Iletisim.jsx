import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Iletisim() {
  const [formData, setFormData] = useState({ ad: '', email: '', mesaj: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gönderilen Mesaj:", formData);
    alert("Mesajınız iletildi!");
  };

  const styles = {
    wrapper: { 
      backgroundColor: '#f8f5eb', 
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: "'Segoe UI', Tahoma, sans-serif", 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center' 
    },
    container: { maxWidth: '1100px', width: '100%' },
    title: { 
      color: '#5d4037', 
      fontSize: '28px', 
      fontWeight: '900', 
      marginBottom: '30px', 
      textAlign: 'center' 
    },
    contentWrapper: {
      display: 'flex',
      gap: '25px',
      flexWrap: 'wrap',
      alignItems: 'stretch' // Kartların boylarını birbirine eşitler
    },
    card: { 
      background: '#ffffff', 
      padding: '30px', 
      borderRadius: '24px', 
      boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)',
      flex: 1, 
      minWidth: '350px',
      display: 'flex',
      flexDirection: 'column'
    },
    subTitle: { 
      color: '#5d4037', 
      fontSize: '18px', 
      fontWeight: '800', 
      marginBottom: '20px', 
      borderBottom: '2px solid #f8f5eb', 
      paddingBottom: '10px' 
    },
    table: { 
      width: '100%', 
      borderCollapse: 'collapse', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      border: '1px solid #eee',
      marginBottom: '20px'
    },
    row: { display: 'flex', borderBottom: '1px solid #eee' },
    labelCell: { 
      flex: 1, 
      padding: '12px 15px', 
      backgroundColor: '#f9f8f5', 
      color: '#5d4037', 
      fontWeight: '700', 
      fontSize: '13px' 
    },
    valueCell: { 
      flex: 1.5, 
      padding: '12px 15px', 
      color: '#8d6e63', 
      fontSize: '13px', 
      backgroundColor: '#ffffff' 
    },
    form: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '15px',
      flexGrow: 1 // Formun kartın içini doldurmasını sağlar
    },
    input: {
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #eee',
      backgroundColor: '#f9f8f5',
      outline: 'none',
      fontFamily: 'inherit'
    },
    textarea: {
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #eee',
      backgroundColor: '#f9f8f5',
      outline: 'none',
      fontFamily: 'inherit',
      resize: 'none',
      flexGrow: 1, // Mesaj kutusunu kartın boyuna göre uzatır
      minHeight: '200px' // İki tarafın eşitlenmesi için başlangıç boyu artırıldı
    },
    submitBtn: {
      backgroundColor: '#5d4037',
      color: '#fff',
      border: 'none',
      padding: '14px',
      borderRadius: '10px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '10px'
    },
    mapContainer: { 
      borderRadius: '16px', 
      overflow: 'hidden', 
      border: '2px solid #eee', 
      height: '250px',
      width: '100%',
      marginTop: 'auto' // Tablonun altına yaslar
    },
    backBtn: { 
      display: 'inline-block', 
      padding: '14px 40px', 
      borderRadius: '14px', 
      backgroundColor: '#5d4037', 
      color: '#fff', 
      textDecoration: 'none', 
      fontWeight: '800',
      marginTop: '30px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>İletişim ve Konum</h1>

        <div style={styles.contentWrapper}>
          {/* SOL TARAF: KURUMSAL BİLGİLER VE HARİTA */}
          <div style={styles.card}>
            <h2 style={styles.subTitle}>Kurumsal Bilgiler</h2>
            <div style={styles.table}>
              <div style={styles.row}><div style={styles.labelCell}>İşletme Adı</div><div style={styles.valueCell}>E-SNAF Bilgi Teknolojileri</div></div>
              <div style={styles.row}><div style={styles.labelCell}>Sorumlu Öğretmen</div><div style={styles.valueCell}>Aykut Durgut</div></div>
              <div style={styles.row}><div style={styles.labelCell}>KEP Adresi</div><div style={styles.valueCell}>esnaf@hs02.kep.tr</div></div>
              <div style={styles.row}><div style={styles.labelCell}>Çağrı Merkezi</div><div style={styles.valueCell}>0 850 222 44 44</div></div>
              <div style={styles.row}><div style={styles.labelCell}>Merkez Ofis</div><div style={styles.valueCell}>Altınoluk MYO, Edremit</div></div>
            </div>
            
            <div style={styles.mapContainer}>
              <iframe 
                title="Altınoluk MYO Konumu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.6181867412956!2d26.756343075834252!3d39.56821597158859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b09679a5cc9623%3A0x6315aad2f59c5b6f!2sBal%C4%B1kesir%20%C3%9Cniversitesi%20Alt%C4%B1noluk%20Meslek%20Y%C3%BCksek%20Okulu!5e0!3m2!1str!2str!4v1776952757850!5m2!1str!2str" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* SAĞ TARAF: MESAJ FORMU */}
          <div style={styles.card}>
            <h2 style={styles.subTitle}>Bize Yazın</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
              <input 
                type="text" name="ad" placeholder="Adınız Soyadınız" 
                style={styles.input} required onChange={handleChange} 
              />
              <input 
                type="email" name="email" placeholder="E-posta Adresiniz" 
                style={styles.input} required onChange={handleChange} 
              />
              <textarea 
                name="mesaj" placeholder="Mesajınızı buraya detaylıca yazabilirsiniz..." 
                style={styles.textarea} required onChange={handleChange} 
              />
              <button type="submit" style={styles.submitBtn}>Mesajı Gönder</button>
            </form>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={styles.backBtn}>Alışverişe Dön</Link>
        </div>
      </div>
    </div>
  );
}