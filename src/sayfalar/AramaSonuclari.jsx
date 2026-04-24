import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import UrunKartlari from "../components/UrunKartlari";

const api = axios.create({
    baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api"
});

export default function AramaSonuclari() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const aramaSorgusu = queryParams.get("q"); // URL'deki ?q= değerini alır

    const [sonuclar, setSonuclar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);

    useEffect(() => {
        const verileriGetir = async () => {
            if (!aramaSorgusu) return;

            setYukleniyor(true);
            try {
                // Backend'deki arama endpoint'ine istek atıyoruz
                const res = await api.get(`/products/search?q=${encodeURIComponent(aramaSorgusu)}`);
                setSonuclar(res.data);
            } catch (err) {
                console.error("Arama sonuçları getirilemedi:", err);
            } finally {
                setYukleniyor(false);
            }
        };

        verileriGetir();
    }, [aramaSorgusu]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
            <h1 className="text-2xl font-serif text-[#5d4037] mb-8">
                "<span className="font-bold">{aramaSorgusu}</span>" için arama sonuçları
            </h1>

            {yukleniyor ? (
                <div className="flex justify-center items-center py-20">
                    <i className="bx bx-loader-alt animate-spin text-4xl text-[#d2b48c]"></i>
                </div>
            ) : sonuclar.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sonuclar.map((urun) => (
                        <UrunKartlari key={urun.id} urun={urun} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#d2b48c]">
                    <i className="bx bx-search-alt text-6xl text-gray-200 mb-4"></i>
                    <p className="text-gray-500 italic">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                </div>
            )}
        </div>
    );
}