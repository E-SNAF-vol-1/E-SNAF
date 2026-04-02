import React, { useState, useEffect } from 'react';
import { useSepet } from '../context/SepetContext.jsx'

export default function DetayKarti({ urun }) {
    // Ana görselin hafızası artık kartın kendi içinde tutuluyor
    const [anaGorsel, setAnaGorsel] = useState("");
    const { dispatch } = useSepet();

    // DÜZELTME BURADA: payload kısmına "item" değil, "urun" veriyoruz!
    const handleSepeteEkle = () => {
        dispatch({ type: "SEPETEEKLE", payload: urun });
    };

    // Ürün bilgisi geldiğinde ana görseli varsayılan resim yapıyoruz
    useEffect(() => {
        if (urun) {
            setAnaGorsel(urun.resim);
        }
    }, [urun]);

    const resmiDegistir = (src) => {
        const el = document.getElementById('anaGorsel');
        if (el) {
            el.animate([
                { opacity: '0.4', filter: 'brightness(1.3)' },
                { opacity: '1', filter: 'brightness(1)' }
            ], { duration: 300 });
        }
        setAnaGorsel(src);
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 max-h-[90vh]">

            {/* Sol: Görsel Galerisi */}
            <div className="p-6 flex flex-col md:flex-row gap-6 bg-white overflow-hidden">
                <div className="flex md:flex-col gap-3 order-2 md:order-1 justify-center">
                    {/* Küçük Resim */}
                    <img
                        onClick={() => resmiDegistir(urun.resim)}
                        src={urun.resim}
                        alt="Ürün Küçültülmüş Görsel"
                        className={`w-16 h-20 object-contain p-2 rounded-xl border-2 cursor-pointer transition-all ${anaGorsel === urun.resim ? 'border-orange-500' : 'border-transparent'}`}
                    />
                </div>

                <div className="flex-1 bg-white rounded-3xl flex items-center justify-center overflow-hidden relative">
                    <img
                        id="anaGorsel"
                        src={anaGorsel}
                        alt={urun.isim || urun.ad}
                        className="w-full h-full max-h-[400px] object-contain p-6 transition-transform duration-500 hover:scale-110"
                    />
                </div>
            </div>

            {/* Sağ: Dinamik Ürün Bilgileri */}
            <div className="p-10 lg:p-12 flex flex-col justify-center">
                <span className="text-orange-600 font-bold text-[10px] uppercase tracking-[0.2em] bg-orange-50 px-3 py-1 rounded-md w-fit">
                    {urun.kategori}
                </span>

                <h2 className="text-3xl font-black text-slate-900 mt-2 leading-tight">
                    {urun.ad || urun.isim}
                </h2>

                <div className="flex items-baseline gap-2 mb-4 mt-2">
                    <span className="text-2xl font-bold text-slate-900">{urun.fiyat} TL</span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed border-t pt-4">
                    {urun.aciklama}
                </p>

                {/* Sepete Ekle Butonu */}
                <button
                    onClick={handleSepeteEkle}
                    className="mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-xl cursor-pointer"
                >
                    Sepete Ekle
                </button>
            </div>

        </div>
    );
}