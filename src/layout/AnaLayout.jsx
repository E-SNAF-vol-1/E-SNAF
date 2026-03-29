import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Baslik from '../components/Baslik';
import UrunKartlari from '../components/UrunKartlari';
import AltBilgi from '../components/AltBilgi';
import HavaDurumu from '../components/HavaDurumu';

export default function AnaLayout({ children }) {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // react tek sayfalı olduğundan sayfa değiştiğinde otomatik olarak en üste çıkması için
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen font-serif text-[#5d4037]">
            <Baslik />
            
            <div style={{ 
                position: 'absolute', 
                top: '310px',      // Kurların altına inmesi için değeri artırdık
                right: '33px',     // Döviz kutusuyla tam aynı hizada durması için sağdan boşluk
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <HavaDurumu />
            </div>

            <main className="flex-grow">
                {children}
            </main>
            
            <AltBilgi />
        </div>
    );
}