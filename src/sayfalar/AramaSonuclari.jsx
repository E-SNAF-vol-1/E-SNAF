import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UrunKartlari from "../components/UrunKartlari";

// Merkezi API yapılandırması
const api = axios.create({
    baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api"
});

export default function AramaSonuclari() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const aramaSorgusu = queryParams.get("q") || ""; 

    const [sonuclar, setSonuclar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        const verileriGetir = async () => {
            const temizSorgu = aramaSorgusu.trim();
            if (!temizSorgu) {
                setSonuclar([]);
                return;
            }

            if (isMounted) setYukleniyor(true);
            setHata(null);

            try {
                const res = await api.get(`/products/search?q=${encodeURIComponent(temizSorgu)}`);
                
                if (isMounted) {
                    if (Array.isArray(res.data)) {
                        setSonuclar(res.data);
                    } else {
                        setSonuclar([]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Arama hatası:", err);
                    setHata("Sonuçlar yüklenirken bir sorun oluştu.");
                }
            } finally {
                if (isMounted) setYukleniyor(false);
            }
        };

        verileriGetir();
        return () => { isMounted = false; };
    }, [aramaSorgusu]);

    return (
        <div className="bg-brand-bg min-h-screen transition-colors duration-500 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 py-10">
                
                {/* Üst Bölüm: Geri Dön Butonu ve Başlık */}
                <div className="mb-8 border-b border-brand-text/10 pb-6">
                    <div className="flex items-center gap-4">
                        {/* Geri Dön Butonu - Ana Sayfaya Yönlendirir */}
                        <button 
                            onClick={() => navigate("/")} 
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-card border border-brand-text/10 text-brand-text hover:bg-brand-accent hover:text-black transition-all duration-300 shadow-sm group"
                            title="Ana Sayfaya Dön"
                        >
                            <i className="bx bx-left-arrow-alt text-2xl group-hover:-translate-x-1 transition-transform"></i>
                        </button>

                        <h1 className="text-2xl md:text-3xl font-serif text-brand-text">
                            {aramaSorgusu ? (
                                <>
                                    "<span className="font-bold italic text-brand-accent">{aramaSorgusu}</span>" için sonuçlar
                                </>
                            ) : (
                                "Tüm Ürünler"
                            )}
                        </h1>
                    </div>
                    
                    {!yukleniyor && (
                        <p className="text-sm text-brand-text/60 mt-2 ml-14">
                            {sonuclar.length} ürün bulundu.
                        </p>
                    )}
                </div>

                {/* İçerik Alanı */}
                <div className="min-h-[400px]">
                    {yukleniyor ? (
                        <div className="flex flex-col justify-center items-center py-32 text-center">
                            <i className="bx bx-loader-alt animate-spin text-5xl text-brand-accent"></i>
                            <p className="mt-4 text-brand-text/60 font-light italic text-xl">Aranıyor, lütfen bekleyin...</p>
                        </div>
                    ) : hata ? (
                        <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20 text-red-500">
                            <i className="bx bx-error-circle text-5xl mb-4"></i>
                            <p className="font-bold">{hata}</p>
                        </div>
                    ) : sonuclar.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sonuclar.map((urun) => (
                                <UrunKartlari key={urun.id} urun={urun} gorunumModu="grid" />
                            ))}
                        </div>
                    ) : (
                        /* Bulunamadı Ekranı */
                        <div className="text-center py-20 bg-brand-card rounded-[2.5rem] border border-dashed border-brand-text/20 shadow-sm">
                            <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bx bx-search-alt text-4xl text-brand-accent"></i>
                            </div>
                            <h3 className="text-lg font-bold text-brand-text mb-2">E-SNAF'ta Bulamadık</h3>
                            <p className="text-brand-text/60 max-w-xs mx-auto">
                                "<span className="font-semibold">{aramaSorgusu}</span>" ile eşleşen bir ürünümüz yok.
                                Farklı kelimelerle tekrar denemek ister misiniz?
                            </p>
                            <button 
                                onClick={() => navigate("/")}
                                className="mt-6 px-6 py-2 bg-brand-accent text-black font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}