import React, { useEffect } from 'react';
import Baslik from '../components/Baslik';
import UrunKartlari from '../components/UrunKartlari';
import AltBilgi from '../components/AltBilgi';
import { useLocation } from 'react-router-dom';


export default function AnaLayout({ children }) {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); //react tek sayfalı olduğundan sayfa değiştiğinde otomatik olarak en üste çıkması için
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen font-serif text-[#5d4037]">
            <Baslik />
            <main className="flex-grow">
                {children}
            </main>
            <AltBilgi />
        </div>
    )
}
