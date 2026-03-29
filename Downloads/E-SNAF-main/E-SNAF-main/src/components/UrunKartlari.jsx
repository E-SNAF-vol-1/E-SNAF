import React from "react";
import { Link } from "react-router-dom";

export default function UrunKartlari({ item, gorunumModu }) {
    const isList = gorunumModu === "list";

    return (
        <Link
            to={`/detay/${item.id}`}
            className={`p-[12px] border border-[#eee] rounded-[14px] bg-white cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_10px_26px_rgba(43,36,26,0.1)] 
            ${isList ? 'flex flex-row gap-[20px] items-center' : 'flex flex-col gap-[14px] items-start'}
        `}>

            <div className={`overflow-hidden rounded-[10px] shrink-0 ${isList ? 'w-[110px] h-[110px]' : 'w-full h-[180px]'}`}>
                <img
                    src={item.resim}
                    alt={item.isim}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className={`flex w-full ${isList ? 'flex-row items-center justify-between' : 'flex-col justify-between'}`}>
                <div className="flex flex-col">
                    <div className="font-bold text-[#2b241a] text-lg">{item.isim}</div>
                    <div className="text-[12px] text-[#666] mt-1">{item.kategori} - {item.renk}</div>
                </div>
                <div className={isList ? '' : 'mt-3'}>
                    <div className="font-bold text-[#5d4037] text-lg">{item.fiyat} TL</div>
                </div>
            </div>

        </Link>
    );
}