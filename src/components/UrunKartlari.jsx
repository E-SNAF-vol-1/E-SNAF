import { useSepet } from '../context/SepetContext.jsx'

export default function UrunKartlari({ item }) {
    const { dispatch } = useSepet()

    const handleSepeteEkle = () => {
        dispatch({ type: "SEPETEEKLE", payload: item })
    }

    return (

        <div className="flex flex-col items-center gap-4 p-4 bg-[#ede6ca]/30 border border-[#d2b48c]/20 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group w-full max-w-[240px]">

            <div className="flex h-48 items-center justify-center w-full overflow-hidden rounded-2xl bg-transparent">
                <img
                    className="w-40 object-contain group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                    src={item.resim}
                    alt={item.isim} />
            </div>

            <div className="text-center space-y-1">
                <h3 className="text-base font-black uppercase tracking-tight text-[#5d4037] line-clamp-1">
                    {item.isim}
                </h3>
                <p className="text-[10px] font-light text-[#5d4037]/60 leading-relaxed">
                    Renk: {item.renk}
                </p>
                <p className="text-lg font-medium text-slate-900">
                    {item.fiyat} TL
                </p>
            </div>

            <button
                onClick={handleSepeteEkle}
                className="w-full py-2.5 bg-[#5d4037] text-[#f5f5dc] rounded-full font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-[#d2b48c] hover:text-[#5d4037] transition-all duration-300 shadow-md hover:shadow-none cursor-pointer">
                Sepete Ekle
            </button>
        </div>
    )
}