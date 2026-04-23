import React, { useEffect, useState } from 'react'; // useState eklendi
import Baslik from '../components/Baslik';
import AltBilgi from '../components/AltBilgi';
import { useLocation } from 'react-router-dom';

export default function AnaLayout({ children }) {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false); // Butonun görünürlük durumu

    // Sayfa değiştiğinde en üste çıkma (Sizin mevcut kodunuz)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Kaydırma miktarını izleyen efekt
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Manuel yukarı çıkma fonksiyonu
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="flex flex-col min-h-screen font-serif text-[#5d4037] bg-[#fdfbf7]">
            <Baslik />

            <main className="flex-grow">
                {children}
            </main>

            <AltBilgi />

            {/*yukarı çıkma butonu */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[9999] bg-[#5d4037] text-[#fdfbf7] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center border-2 border-[#d2b48c] hover:bg-[#4d3a2e] hover:scale-110 transition-all duration-300 animate-in fade-in zoom-in"
                >
                    <i className='bx bx-chevron-up text-3xl'></i>
                </button>
            )}
        </div>
    );
}