import React from "react";
import { Link } from "react-router-dom";

export default function UrunKartlari({ urun, gorunumModu }) {
    // Veri hiç gelmezse veya id eksikse bileşeni render etmiyoruz
    if (!urun || !urun.id) return null;

    const isList = gorunumModu === "list";

    // URL için güvenli metin dönüştürücü (Boşlukları tire yapar, küçük harfe çevirir)
    const slugify = (text) => {
        return (text || "genel")
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')         // Boşlukları tire yap
            .replace(/[^\w\-]+/g, '')     // Alfanumerik olmayanları sil
            .replace(/\-\-+/g, '-');      // Çift tireleri teke indir
    };

    // Link yapısını güvenli hale getiriyoruz
    const kategoriPath = slugify(urun.kategori);
    const altKategoriPath = slugify(urun.altKategori);
    const isimPath = slugify(urun.isim || urun.ad);

    return (
        <Link
            // URL yapısını App.jsx'teki rotaya tam uyumlu hale getirdik
            to={`/urun/${kategoriPath}/${altKategoriPath}/${isimPath}/${urun.id}`}
            className={`flex bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isList ? 'flex-row gap-4' : 'flex-col gap-2'
                }`}
        >
            {/* Ürün Görseli */}
            <div className={`overflow-hidden rounded-[10px] shrink-0 ${isList ? 'w-[110px] h-[110px]' : 'w-full h-[180px]'}`}>
                <img
                    src={urun.resim || "/images/bos.jpg"}
                    alt={urun.isim || "Ürün"}
                    className="w-full h-full object-cover"
                    // Görsel yüklenemezse varsayılan görseli göster
                    onError={(e) => { e.target.src = "/images/bos.jpg"; }}
                />
            </div>

            {/* Ürün Bilgileri */}
            <div className={`flex w-full ${isList ? 'flex-row items-center justify-between' : 'flex-col'}`}>
                <div className="flex flex-col">
                    <div className="font-bold text-[#2b241a] text-lg line-clamp-1">
                        {urun.isim || urun.ad || "İsimsiz Ürün"}
                    </div>
                    <div className="text-[12px] text-[#666]">
                        {urun.kategori || "Genel Kategori"}
                    </div>
                </div>
                <div className="font-bold text-[#5d4037] text-lg mt-1">
                    {Number(urun.fiyat || 0).toLocaleString('tr-TR')} TL
                </div>
            </div>
        </Link>
    );
}