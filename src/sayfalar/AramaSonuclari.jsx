import { useLocation } from "react-router-dom";
import UrunKartlari from "../components/UrunKartlari";

export default function AramaSonuclari() {
    const location = useLocation();


    const aramaSorgusu = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";


    const filtrelenmiş = urunler.filter((u) => {
        return Object.values(u).some((deger) => {
            if (typeof deger === "string") {
                return deger.toLowerCase().includes(aramaSorgusu.toLowerCase());
            }
            if (Array.isArray(deger)) {
                return deger.some(altDeger =>
                    typeof altDeger === "string" && altDeger.toLowerCase().includes(aramaSorgusu.toLowerCase())
                );
            }
            return false;
        });
    });

    return (
        <div className="p-10 min-h-screen bg-[#f5f5f5]">
            <h2 className="text-2xl font-bold text-[#5d4037] mb-8 italic">
                "{aramaSorgusu}" için arama sonuçları:
            </h2>

            {filtrelenmiş.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filtrelenmiş.map((urun) => (
                        <UrunKartlari key={urun.id} item={urun} />
                    ))}
                </div>
            ) : (
                <div className="text-center mt-20">
                    <p className="text-xl text-gray-500">Maalesef aradığınız kriterde ürün bulunamadı.</p>
                </div>
            )}
        </div>
    );
}