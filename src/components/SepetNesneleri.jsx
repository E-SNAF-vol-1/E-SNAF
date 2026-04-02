import { useSepet } from '../context/SepetContext.jsx'

export default function SepetNesneleri({ item }) {
    const { dispatch } = useSepet()

    // Açıklamayı 20 karakter ile sınırla
    const kisaAciklama = item.aciklama
        ? (item.aciklama.length > 20 ? item.aciklama.substring(0, 20) + "..." : item.aciklama)
        : "Açıklama bulunmuyor";

    return (
        <div className="flex items-center gap-6 p-4 border-b border-[#d2b48c] hover:bg-[#f9f7f4] transition-colors duration-200">
            <div className="w-24 h-24 flex items-center justify-center bg-[#ede6ca] rounded-lg">
                <img src={item.resim} alt={item.isim} className="w-20 object-contain" />
            </div>

            <div className="flex-1">
                {/* Ürün Adı */}
                <h3 className="font-bold text-lg text-[#5d4037]">{item.isim}</h3>
                {/* 20 Karakter Sınırlı Açıklama */}
                <p className="text-sm text-gray-500 italic">{kisaAciklama}</p>
                {/* Fiyat Bilgisi */}
                <p className="font-semibold text-[#8d6e63] mt-1">{item.fiyat} TL</p>
            </div>

            <div className="flex items-center gap-3 bg-[#ede6ca] px-3 py-2 rounded-lg">
                <button onClick={() => dispatch({ type: "SEPETCIKAR", payload: item.id })} className="text-[#d84315] font-bold hover:text-[#bf360c]">−</button>
                <span className="w-8 text-center font-bold">{item.miktar}</span>
                <button onClick={() => dispatch({ type: "SEPETEEKLE", payload: item })} className="text-[#388e3c] font-bold hover:text-[#1b5e20]">+</button>
            </div>

            <button
                onClick={() => dispatch({ type: "SEPETTEMIZLE", payload: item.id })}
                className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 cursor-pointer group/trash">
                <i className="bx bx-trash text-2xl group-hover/trash:rotate-12 group-hover/trash:scale-110 transition-transform"></i>
            </button>
        </div>
    )
}