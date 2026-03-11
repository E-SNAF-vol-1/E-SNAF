import { urunler } from "../data/Urunler";
import UrunKartlari from "../components/UrunKartlari";

export default function Anasayfa() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-[#f5f5f5] p-10 min-h-screen">
            {urunler.map((urun) => {
                return <UrunKartlari key={urun.id} item={urun} />
            })}
        </div>
    )
}