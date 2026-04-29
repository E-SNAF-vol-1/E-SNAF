import SepetOzeti from "../components/SepetOzeti"
import { useNavigate } from "react-router-dom"
import { useSepet } from "../context/SepetContext.jsx"
import SepetKartı from "../components/SepetNesneleri"

export default function Sepet() {
    const yonlendirme = useNavigate()
    const { state } = useSepet()
    const urunListesi = Array.isArray(state.SepetNesneleri) ? state.SepetNesneleri : []

    // 1. Durum: Sepet Boşken (Tema Uyumlu)
    if (urunListesi.length === 0) {
        return (
            <div className="p-8 bg-brand-bg min-h-screen flex flex-col items-center justify-center transition-colors duration-500">
                <div className="bg-brand-card p-12 rounded-[2.5rem] shadow-2xl border border-brand-text/5 text-center max-w-md">
                    <i className="bx bx-shopping-bag text-7xl text-brand-accent mb-6 opacity-50"></i>
                    <h1 className="text-2xl font-bold text-brand-text mb-4">Sepetiniz şu an boş</h1>
                    <p className="text-brand-text/60 mb-8">Görünüşe göre henüz bir ürün eklemediniz. Harika fırsatları keşfetmeye ne dersiniz?</p>
                    <button 
                        onClick={() => yonlendirme("/")} 
                        className="w-full px-8 py-4 bg-brand-accent text-brand-bg font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                        Ürünlere Göz At
                    </button>
                </div>
            </div>
        )
    }

    // 2. Durum: Sepet Doluyken (Tema Uyumlu)
    return (
        <div className="p-8 bg-brand-bg min-h-screen transition-colors duration-500">
            {/* Üst Başlık Bölümü */}
            <div className="mb-10 max-w-6xl mx-auto">
                <button 
                    onClick={() => yonlendirme("/")} 
                    className="flex items-center gap-2 text-brand-accent font-bold text-sm mb-4 hover:opacity-80 transition-all group"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span> Anasayfaya Dön
                </button>
                <div className="flex items-baseline gap-4">
                    <h2 className="text-4xl font-serif font-black text-brand-text tracking-tight">Sepetiniz</h2>
                    <span className="text-brand-text/40 font-medium">{urunListesi.length} Ürün</span>
                </div>
            </div>

            {/* İçerik Grid Yapısı */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                
                {/* Sol Taraf: Ürün Kartları */}
                <div className="lg:col-span-2 space-y-6">
                    {urunListesi.map((urun) => (
                        <div key={urun.id} className="transform transition-all duration-300 hover:-translate-y-1">
                            <SepetKartı item={urun} />
                        </div>
                    ))}
                </div>

                {/* Sağ Taraf: Sepet Özeti (Sticky) */}
                <div className="h-fit lg:sticky lg:top-24">
                    <div className="bg-brand-card rounded-[2rem] shadow-xl border border-brand-text/5 overflow-hidden">
                        <SepetOzeti />
                    </div>
                    
                    {/* Güvenlik Bilgisi */}
                    <div className="mt-6 p-4 flex items-center gap-3 text-brand-text/40 text-xs italic">
                        <i className="bx bx-shield-quarter text-xl text-brand-accent"></i>
                        <span>256-bit SSL sertifikası ile ödemeleriniz %100 güvence altındadır.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}