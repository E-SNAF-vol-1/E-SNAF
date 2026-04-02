import { useSepet } from "../context/SepetContext.jsx"

export default function SepetOzeti() {
    const navigate = useNavigate();
    const { state } = useSepet()
    const urunler = state.SepetNesneleri || []

    // Toplam fiyatı hesapla
    const toplamFiyat = urunler.reduce((toplam, urun) => toplam + (urun.fiyat * urun.miktar), 0)
    const kargoUcreti = toplamFiyat > 500 ? 0 : 50 // Örnek: 500 TL üzeri kargo bedava

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ede6ca]">
            <h3 className="text-xl font-bold text-[#4d3a2e] mb-6">Sipariş Özeti</h3>

            <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span>{toplamFiyat.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span>{kargoUcreti === 0 ? "Ücretsiz" : kargoUcreti + " TL"}</span>
                </div>
                <div className="border-t border-[#ede6ca] pt-4 flex justify-between font-bold text-xl text-[#4d3a2e]">
                    <span>Toplam</span>
                    <span>{(toplamFiyat + kargoUcreti).toFixed(2)} TL</span>
                </div>
            </div>

            <button
                onClick={() => navigate("/odeme")} // Tıklayınca ödeme sayfasına git
                className="w-full mt-8 py-4 bg-[#4d3a2e] text-white rounded-xl font-bold hover:bg-[#3d2e25] transition-colors shadow-lg"
            >
                Alışverişi Tamamla
            </button>

            {kargoUcreti > 0 && (
                <p className="text-xs text-[#978175] mt-4 text-center">
                    {(500 - toplamFiyat).toFixed(2)} TL daha ekleyin, kargo bedava olsun!
                </p>
            )}
        </div>
    )
}