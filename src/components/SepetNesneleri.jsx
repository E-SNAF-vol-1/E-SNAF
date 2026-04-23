import { useSepet } from '../context/SepetContext.jsx'
import { useNavigate } from "react-router-dom";

export default function SepetNesneleri({ item }) {
    const { dispatch } = useSepet()
    const navigate = useNavigate();

    // HTML etiketlerini temizleyen ve metni sınırlayan fonksiyon
    const temizAciklamaGetir = (html) => {
        if (!html) return "Açıklama bulunmuyor";
        const temizMetin = html.replace(/<[^>]*>/g, ' ').trim();
        return temizMetin.length > 50
            ? temizMetin.substring(0, 50) + "..."
            : temizMetin;
    }

    const urunIsmi = item.urun_adi || item.isim || item.ad || "İsimsiz Ürün";
    const kisaAciklama = temizAciklamaGetir(item.aciklama);

    // URL Dostu Metin Oluşturucu (Slugify)
    const urlFormatla = (metin) => {
        if (!metin) return "genel";
        return metin
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[ığüşöç]/g, (m) => ({ 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c' }[m]))
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    const detayaGit = () => {
        // App.jsx rotasına tam uyum için parametreleri hazırlıyoruz
        // /urun/:kategori/:altKategori/:urunAdi/:id
        const kategori = urlFormatla(item.kategori_adi || item.kategori);
        const altKategori = urlFormatla(item.alt_kategori_adi || item.alt_kategori || item.altKategori);
        const urunSlug = urlFormatla(urunIsmi);

        // Oluşturulan temiz URL ile yönlendirme
        navigate(`/urun/${kategori}/${altKategori}/${urunSlug}/${item.id}`);
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
                {/* Ürün İsmi */}
                <h3
                    onClick={detayaGit}
                    className="font-bold text-lg text-[#5d4037] cursor-pointer hover:text-[#8d6e63] transition-colors"
                >
                    {urunIsmi}
                </h3>

                {/* Açıklama */}
                <p className="text-sm text-gray-500 italic mt-1 leading-relaxed">
                    {kisaAciklama}
                </p>

                <p className="font-semibold text-[#8d6e63] mt-2">{item.fiyat} TL</p>
            </div>

            {/* Miktar ve Silme Butonları */}
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