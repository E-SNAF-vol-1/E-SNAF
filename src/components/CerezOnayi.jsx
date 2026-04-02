import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CerezOnayi() {
    const [goster, setGoster] = useState(false);

    useEffect(() => {
        const onayDurumu = localStorage.getItem("cerezOnayi");
        if (!onayDurumu) {
            setGoster(true);
        }
    }, []);

    const handleKabulEt = () => {
        localStorage.setItem("cerezOnayi", "kabul");
        setGoster(false);
    };

    if (!goster) return null;

    return (
        /* ekranın sol alt köşesinde*/
        <div className="fixed bottom-6 left-6 w-[340px] z-[9999] bg-[#fdfaf1] border border-[#d2b48c] p-5 rounded-[2rem] shadow-[0_15px_40px_rgba(43,36,26,0.15)] flex flex-col gap-4 animate-in fade-in slide-in-from-left-10 duration-700">

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🍪</span>
                    <h4 className="text-[#5d4037] font-black text-sm uppercase tracking-wider">Çerez Kullanımı</h4>
                </div>
                <p className="text-[#8d6e63] text-[13px] leading-relaxed">
                    Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz. Devam ederek bu durumu kabul etmiş sayılırsınız.
                </p>
            </div>

            <div className="flex items-center justify-between mt-1 border-t border-[#f5f0db] pt-4">

                <Link
                    to="/CerezPolitikasi"
                    className="text-[#8d6e63] text-[11px] font-bold hover:text-orange-600 transition-colors uppercase tracking-widest"
                >
                    Detaylı Bilgi
                </Link>

                <button
                    onClick={handleKabulEt}
                    className="px-6 py-2.5 rounded-xl font-black bg-[#2b241a] text-[#f5f5dc] hover:bg-orange-600 hover:text-white transition-all duration-300 active:scale-95 shadow-md text-[10px] uppercase tracking-[0.1em]"
                >
                    Anladım
                </button>
            </div>

        </div>
    );
}