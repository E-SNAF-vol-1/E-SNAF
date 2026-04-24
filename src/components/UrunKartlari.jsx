import React from "react";
import { Link } from "react-router-dom";

// Kraliçe Müdahalesi: 'item' yerine 'urun' kullanarak AramaSonuclari ile uyumlu hale getirdik
export default function UrunKartlari({ urun, gorunumModu }) {
    // Veri gelmezse bileşenin çökmesini engellemek için güvenlik kalkanı
    if (!urun) return null;

    const isList = gorunumModu === "list";

    // URL'deki undefined hatalarını önlemek için güvenli değerler
    const kategori = urun.kategori || "genel";
    const altKategori = urun.altKategori || "genel";
    const isim = urun.isim || "urun";
    const id = urun.id || "";

    return (
        <Link
            to={`/urun/${kategori}/${altKategori}/${isim}/${id}`}
            className={`flex bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isList ? 'flex-row gap-4' : 'flex-col gap-2'}`}
        >
            <div className={`overflow-hidden rounded-[10px] shrink-0 ${isList ? 'w-[110px] h-[110px]' : 'w-full h-[180px]'}`}>
                <img
                    src={urun.resim || "/images/bos.jpg"}
                    alt={urun.isim}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className={`flex w-full ${isList ? 'flex-row items-center justify-between' : 'flex-col'}`}>
                <div className="flex flex-col">
                    <div className="font-bold text-[#2b241a] text-lg">{urun.isim}</div>
                    {/* Hata veren 'kategori' erişimini burada güvenli hale getirdik */}
                    <div className="text-[12px] text-[#666]">{urun.kategori || "Genel"}</div>
                </div>
                <div className="font-bold text-[#5d4037] text-lg">{urun.fiyat} TL</div>
            </div>
        </Link>
    );
}