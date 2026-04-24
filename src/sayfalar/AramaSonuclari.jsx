import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import UrunKartlari from "../components/UrunKartlari";

// Merkezi API yapılandırması
const api = axios.create({
    baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api"
});

export default function AramaSonuclari() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const aramaSorgusu = queryParams.get("q") || ""; // Boş sorgu koruması

    const [sonuclar, setSonuclar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState(null);

    useEffect(() => {
        const verileriGetir = async () => {
            // Sorgu çok kısaysa veya boşsa boş sonuç dön
            if (!aramaSorgusu.trim() || aramaSorgusu.length < 2) {
                setSonuclar([]);
                return;
            }

            setYukleniyor(true);
            setHata(null);

            try {
                // Backend'deki genel arama endpoint'ine istek atıyoruz
                const res = await api.get(`/products/search?q=${encodeURIComponent(aramaSorgusu)}`);

                // Gelen verinin dizi olduğundan emin oluyoruz
                if (Array.isArray(res.data)) {
                    setSonuclar(res.data);
                } else {
                    setSonuclar([]);
                }
            } catch (err) {
                console.error("Arama sonuçları getirilemedi:", err);
                setHata("Sonuçlar yüklenirken bir sorun oluştu.");
            } finally {
                setYukleniyor(false);
            }
        };

        verileriGetir();
    }, [aramaSorgusu]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
            {/* Başlık Bölümü */}
            <div className="mb-8 border-b border-[#f0ebe0] pb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-[#5d4037]">
                    {aramaSorgusu ? (
                        <>
                            "<span className="font-bold italic text-[#d2b48c]">{aramaSorgusu}</span>" için sonuçlar
                        </>
                    ) : (
                        "Tüm Ürünler"
                    )}
                </h1>
                {!yukleniyor && sonuclar.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">{sonuclar.length} ürün bulundu.</p>
                )}
            </div>

            {/* İçerik Alanı */}
            {yukleniyor ? (
                <div className="flex flex-col justify-center items-center py-32">
                    <i className="bx bx-loader-alt animate-spin text-5xl text-[#d2b48c]"></i>
                    <p className="mt-4 text-[#a68b6d] font-light italic">Aranıyor, lütfen bekleyin</p>
                </div>
            ) : hata ? (
                <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 text-red-600">
                    <i className="bx bx-error-circle text-5xl mb-4"></i>
                    <p>{hata}</p>
                </div>
            ) : sonuclar.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sonuclar.map((urun) => (
                        // urun nesnesi varsa ve id'si varsa render et (Çifte koruma)
                        urun && urun.id && (
                            <UrunKartlari key={urun.id} urun={urun} gorunumModu="grid" />
                        )
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#d2b48c] shadow-sm">
                    <div className="w-20 h-20 bg-[#f8f5eb] rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="bx bx-search-alt text-4xl text-[#d2b48c]"></i>
                    </div>
                    <h3 className="text-lg font-bold text-[#5d4037] mb-2">E-SNAF'ta Bulamadık</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        "<span className="font-semibold">{aramaSorgusu}</span>" ile eşleşen bir ürünümüz yok.
                        Farklı kelimelerle tekrar denemek ister misiniz?
                    </p>
                </div>
            )}
        </div>
    );
}