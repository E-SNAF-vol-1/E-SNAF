import { useSepet } from '../context/SepetContext.jsx'
import { useNavigate } from "react-router-dom";

export default function SepetNesneleri({ item }) {
    const { dispatch } = useSepet()
    const navigate = useNavigate();

    // HTML etiketlerini temizleyen ve metni 50 karakterle sınırlayan fonksiyon
    const temizAciklamaGetir = (html) => {
        if (!html) return "Açıklama bulunmuyor";
        const temizMetin = html.replace(/<[^>]*>/g, ' ').trim();
        return temizMetin.length > 50
            ? temizMetin.substring(0, 50) + "..."
            : temizMetin;
    }

    // KRİTİK NOKTA: Veritabanındaki sütun adınız olan 'urun_adi' öncelikli yapıldı
    const urunIsmi = item.urun_adi || item.isim || item.ad || "İsimsiz Ürün";
    const kisaAciklama = temizAciklamaGetir(item.aciklama);

    const detayaGit = () => {
        const kategori = (item.kategori || "genel").toLowerCase();
        const altKategori = (item.altKategori || item.alt_kategori || "urun").toLowerCase();
        const urlIsim = urunIsmi.toLowerCase().replace(/\s+/g, '-');

        navigate(`/urun/${kategori}/${altKategori}/${urlIsim}/${item.id}`);
    }

    return (
        <div className="flex items-center gap-6 p-4 border-b border-[#d2b48c] hover:bg-[#f9f7f4] transition-colors duration-200">
            {/* Ürün Görseli */}
            <div
                onClick={detayaGit}
                className="w-24 h-24 flex items-center justify-center bg-[#ede6ca] rounded-lg cursor-pointer hover:opacity-80 transition-all shadow-sm"
            >
                <img
                    src={item.resim || "/images/bos.jpg"}
                    alt={urunIsmi}
                    className="w-20 h-20 object-contain rounded-md"
                />
            </div>

            <div className="flex-1">
                {/* Ürün İsmi - Veritabanı sütununa tam uyumlu */}
                <h3
                    onClick={detayaGit}
                    className="font-bold text-lg text-[#5d4037] cursor-pointer hover:text-[#8d6e63] transition-colors"
                >
                    {urunIsmi}
                </h3>

                {/* 50 Karakter Sınırlı Açıklama */}
                <p className="text-sm text-gray-500 italic mt-1 leading-relaxed">
                    {kisaAciklama}
                </p>

                <p className="font-semibold text-[#8d6e63] mt-2">{item.fiyat} TL</p>
            </div>

            {/* Miktar ve Silme Butonları Mevcut Yapısını Koruyor */}
            <div className="flex items-center gap-3 bg-[#ede6ca] px-3 py-2 rounded-lg">
                <button onClick={() => dispatch({ type: "SEPETCIKAR", payload: item.id })} className="text-[#d84315] font-bold w-6">−</button>
                <span className="w-8 text-center font-bold">{item.miktar}</span>
                <button onClick={() => dispatch({ type: "SEPETEEKLE", payload: item })} className="text-[#388e3c] font-bold w-6">+</button>
            </div>

            <button
                onClick={() => dispatch({ type: "SEPETTEMIZLE", payload: item.id })}
                className="p-3 text-gray-400 hover:text-red-600 transition-all group/trash"
            >
                <i className="bx bx-trash text-2xl group-hover/trash:rotate-12 transition-transform"></i>
            </button>
        </div>
    )
}