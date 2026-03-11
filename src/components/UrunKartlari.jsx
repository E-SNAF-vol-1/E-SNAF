import { useSepet } from '../context/SepetContext.jsx'

export default function UrunKartlari({ item }) {
    const { dispatch } = useSepet()

    const handleSepeteEkle = () => {
        dispatch({ type: "SEPETEEKLE", payload: item })
    }

    return (
        <div className="flex flex-col items-center gap-8 p-6 bg-[#ede6ca] border border-[#d2b48c] rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex h-56 items-center justify-center py-5">
                <img className="w-50 object-contain" src={item.resim} alt={item.isim} />
            </div>

            <div className="text-center">
                <span className="font-bold">{item.isim}</span> <br />
                <span className="text-gray-500">Renk: {item.renk}</span> <br />
                <span className="font-semibold">Fiyat: {item.fiyat} TL</span>
            </div>

            <button onClick={handleSepeteEkle} className="px-4 py-2 bg-[#8d6e63] text-[#f5f5dc] rounded-lg hover:bg-[#5d4037] hover:text-[#ede0d4] transition-all duration-300 cursor-pointer shadow-md">
                Sepete Ekle
            </button>
        </div>
    )
}
