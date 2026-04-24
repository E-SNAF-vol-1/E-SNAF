import React from 'react';
import { Link } from 'react-router-dom';

export default function Iletisim() {
  const styles = {
    wrapper: { 
      backgroundColor: '#f8f5eb', 
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: "'Segoe UI', Tahoma, sans-serif", 
      display: 'flex', 
      justifyContent: 'center' 
    },
    container: { maxWidth: '600px', width: '100%' },
    card: { 
      background: '#ffffff', 
      padding: '30px', 
      borderRadius: '24px', 
      boxShadow: '0 20px 60px rgba(93, 64, 55, 0.08)' 
    },
    title: { 
      color: '#5d4037', 
      fontSize: '24px', 
      fontWeight: '900', 
      marginBottom: '25px', 
      textAlign: 'center' 
},
    table: { 
      width: '100%', 
      borderCollapse: 'collapse', 
      marginBottom: '30px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      border: '1px solid #eee' 
    },
    row: { display: 'flex', borderBottom: '1px solid #eee' },
    labelCell: { 
      flex: 1, 
      padding: '15px 20px', 
      backgroundColor: '#f9f8f5', 
      color: '#5d4037', 
      fontWeight: '700', 
      fontSize: '14px' 
    },
    valueCell: { 
      flex: 2, 
      padding: '15px 20px', 
      color: '#8d6e63', 
      fontSize: '14px', 
      backgroundColor: '#ffffff' 
},
    mapContainer: { 
      borderRadius: '16px', 
      overflow: 'hidden', 
      border: '3px solid #5d4037', 
      height: '350px',
      marginBottom: '30px'
},
    backBtn: { 
      display: 'block', 
      width: '200px', 
      margin: '0 auto', 
      textAlign: 'center', 
      padding: '14px', 
      borderRadius: '14px', 
      backgroundColor: '#5d4037', 
      color: '#fff', 
      textDecoration: 'none', 
      fontWeight: '800' 
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>İletişim ve Konum</h1>


          <div style={styles.table}>
            <div style={styles.row}><div style={styles.labelCell}>İşletme Adı</div><div style={styles.valueCell}>E-SNAF Bilgi Teknolojileri</div></div>
            <div style={styles.row}><div style={styles.labelCell}>Ticaret Ünvanı</div><div style={styles.valueCell}>E-SNAF Paz. ve Tic. A.Ş.</div></div>
            <div style={styles.row}><div style={styles.labelCell}>Sorumlu Öğretmen</div><div style={styles.valueCell}>Aykut Durgut</div></div>
            <div style={styles.row}><div style={styles.labelCell}>KEP Adresi</div><div style={styles.valueCell}>esnaf@hs02.kep.tr</div></div>
            <div style={styles.row}><div style={styles.labelCell}>MERSİS No</div><div style={styles.valueCell}>0739014655600017</div></div>
            <div style={styles.row}><div style={styles.labelCell}>Merkez Ofis</div><div style={styles.valueCell}>Altınoluk MYO, Edremit / Balıkesir</div></div>
            <div style={styles.row}><div style={styles.labelCell}>Çağrı Merkezi</div><div style={styles.valueCell}>0 850 222 44 44</div></div>
          </div>


          <div style={styles.mapContainer}>
            <iframe 
              title="Altınoluk MYO Konumu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.6181867412956!2d26.756343075834252!3d39.56821597158859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b09679a5cc9623%3A0x6315aad2f59c5b6f!2sBal%C4%B1kesir%20%C3%9Cniversitesi%20Alt%C4%B1noluk%20Meslek%20Y%C3%BCksek%20Okulu!5e0!3m2!1str!2str!4v1776952757850!5m2!1str!2str" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <Link to="/" style={styles.backBtn}>Alışverişe Dön</Link>
        </div>
      </div>
    </div>
  );
}
