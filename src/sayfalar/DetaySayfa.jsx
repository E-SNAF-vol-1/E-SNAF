import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { urunler } from '../data/Urunler';
import DetayKarti from '../components/DetayKarti'; // Zanaatkarımızı çağırdık

export default function DetaySayfa() {
    // urlden idyi al
    const { id } = useParams();

    // ürünü bul
    const urun = urunler.find(u => u.id === parseInt(id));

    // ürün yoksa hata ekranı göster
    if (!urun) {
        return (
            <div className="bg-orange-100 h-screen flex flex-col gap-4 items-center justify-center font-sans">
                <div className="text-2xl font-bold text-slate-900">Ürün bulunamadı...</div>
                <Link to="/" className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-colors">
                    Anasayfaya Dön
                </Link>
            </div>
        );
    }

    // ürün varsa tasarımı çağır
    return (
        <div className="bg-orange-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <main className="container mx-auto max-w-6xl">
                <DetayKarti urun={urun} />
            </main>
        </div>
    );
}