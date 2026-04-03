import React from "react";
import { Link } from "react-router-dom";

export default function UrunKartlari({ item, gorunumModu }) {
    const isList = gorunumModu === "list";

    return (
        <Link 
            to={`/urun/${item.kategori}/${item.altKategori}/${item.isim}/${item.id}`}
            className={`flex bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isList ? 'flex-row gap-4' : 'flex-col gap-2'}`}
        >
            <div className={`overflow-hidden rounded-[10px] shrink-0 ${isList ? 'w-[110px] h-[110px]' : 'w-full h-[180px]'}`}>
                <img
                    src={item.resim}
                    alt={item.isim}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className={`flex w-full ${isList ? 'flex-row items-center justify-between' : 'flex-col'}`}>
                <div className="flex flex-col">
                    <div className="font-bold text-[#2b241a] text-lg">{item.isim}</div>
                    <div className="text-[12px] text-[#666]">{item.kategori}</div>
                </div>
                <div className="font-bold text-[#5d4037] text-lg">{item.fiyat} TL</div>
            </div>
        </Link>
    );
}