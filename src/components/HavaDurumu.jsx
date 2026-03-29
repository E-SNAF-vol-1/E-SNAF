import React, { useState, useEffect } from 'react';

const HavaDurumu = () => {
    const [veri, setVeri] = useState(null);
    const [hata, setHata] = useState(false);

    const apiKey = "58430826a23bfb77c50997e97c139ca8"; 
    const sehir = "Istanbul";

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${sehir}&appid=${apiKey}&units=metric&lang=tr`)
            .then(res => {
                if (!res.ok) throw new Error("API Hatası");
                return res.json();
            })
            .then(data => setVeri(data))
            .catch(err => {
                console.error(err);
                setHata(true);
            });
    }, [apiKey]);

    if (hata) return null; // Hata varsa hiçbir şey gösterme, site bozulmasın
    if (!veri) return null; // Yüklenirken boş kalsın

    
return (
    <div style={{
        background: 'white',
        padding: '12px 0',      // İç boşluğu düzenledik
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #efebe9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '85px',         // Döviz kutularının genişliğiyle eşitledik
        textAlign: 'center'
    }}>
        <img 
            src={`https://openweathermap.org/img/wn/${veri.weather[0].icon}@2x.png`} 
            alt="ikon" 
            style={{ width: '40px', height: '40px', marginBottom: '-5px' }} 
        />
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#5d4037' }}>
            {Math.round(veri.main.temp)}°C
        </span>
        <span style={{ fontSize: '9px', color: '#8d6e63', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {veri.name.toUpperCase()}
        </span>
    </div>
);
};

export default HavaDurumu;