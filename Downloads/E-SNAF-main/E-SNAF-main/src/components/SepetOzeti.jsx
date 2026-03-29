import { useSepet } from '../context/SepetContext.jsx'

export default function SepetOzeti() {
    const { state } = useSepet();
    const { SepetNesneleri } = state;
    const ToplamUrun = SepetNesneleri.reduce((sum, item) => sum + item.miktar, 0)
    const toplam = SepetNesneleri.reduce((sum, item) => sum + item.fiyat * item.miktar, 0)
    const kargo = 39.99;
    const sonfiyat = toplam + kargo;


    return (
        <div className="bg-[#ede6ca] p-6 rounded-lg border border-[#d2b48c]">
            <h2 className="text-2xl font-bold text-[#5d4037] mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 mb-4 border-b border-[#d2b48c] pb-4">
                <div className="flex justify-between text-[#5d4037]">
                    <span>Toplam Ürün:</span>
                    <span className="font-semibold">{ToplamUrun}</span>
                </div>
                <div className="flex justify-between text-[#5d4037]">
                    <span>Alt Toplam:</span>
                    <span className="font-semibold">{toplam.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-[#5d4037]">
                    <span>Kargo Ücreti:</span>
                    <span className="font-semibold">{kargo.toFixed(2)} TL</span>
                </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-[#8d6e63] mb-6">
                <span>Toplam:</span>
                <span>{sonfiyat.toFixed(2)} TL</span>
            </div>

            <button className="w-full bg-[#8d6e63] text-[#f5f5dc] py-3 rounded-lg font-bold hover:bg-[#5d4037] transition-colors duration-300">
                Satın Al
            </button>
        </div>
    )
}