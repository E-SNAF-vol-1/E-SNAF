import SepetOzeti from "../components/SepetOzeti"
import { useNavigate } from "react-router-dom"
import { useSepet } from "../context/SepetContext.jsx"
import SepetKartı from "../components/SepetNesneleri"

export default function Sepet() {
    const yonlendirme = useNavigate()
    const { state } = useSepet()
    const urunListesi = Array.isArray(state.SepetNesneleri) ? state.SepetNesneleri : []

    // Veri tabanından veri çekilirken veya sepet boşken kontrol
    if (urunListesi.length === 0) {
        return (
            <div className="p-8 bg-[#fdfbf7] min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-[#4d3a2e] mb-4">Sepetiniz şu an boş</h1>
                <button onClick={() => yonlendirme("/")} className="px-8 py-3 bg-[#978175] text-[#f3f4e3] rounded-full hover:bg-[#4d3a2e] transition-all">
                    Ürünlere Göz At
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 bg-[#fdfbf7] min-h-screen">
            <div className="mb-8 max-w-6xl mx-auto">
                <h1 onClick={() => yonlendirme("/")} className="text-[#978175] cursor-pointer hover:text-[#4d3a2e] mb-2 transition-colors">
                    <i className="bx bx-arrow-big-left" /> Anasayfaya Dön
                </h1>
                <h2 className="text-4xl font-serif font-bold text-[#4d3a2e]">Sepetiniz</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="lg:col-span-2 space-y-4">
                    {urunListesi.map((urun) => (
                        <SepetKartı key={urun.id} item={urun} />
                    ))}
                </div>

                <div className="h-fit sticky top-8">
                    {/* Sepet özeti buradaki listeden beslenir */}
                    <SepetOzeti />
                </div>
            </div>
        </div>
    )
}