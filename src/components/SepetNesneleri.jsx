import { useSepet } from '../context/SepetContext.jsx'
import { useNavigate } from "react-router-dom";

export default function SepetNesneleri({ item }) {
    const { dispatch } = useSepet()
    const navigate = useNavigate();

    const temizAciklamaGetir = (html) => {
        if (!html) return "Açıklama bulunmuyor";
        const temizMetin = html.replace(/<[^>]*>/g, ' ').trim();
        return temizMetin.length > 50
            ? temizMetin.substring(0, 50) + "..."
            : temizMetin;
    }

    const urunIsmi = item.urun_adi || item.isim || item.ad || "İsimsiz Ürün";
    const kisaAciklama = temizAciklamaGetir(item.aciklama);

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
        const kategori = urlFormatla(item.kategori_adi || item.kategori);
        const altKategori = urlFormatla(item.alt_kategori_adi || item.alt_kategori || item.altKategori);
        const urunSlug = urlFormatla(urunIsmi);
        navigate(`/urun/${kategori}/${altKategori}/${urunSlug}/${item.id}`);
    }

    return (
        <div className="flex items-center gap-6 p-5 bg-brand-card rounded-2xl border border-brand-text/5 hover:border-brand-accent/30 transition-all duration-300 shadow-sm group">
            
            {/* Ürün Görseli Kutusu */}
            <div
                onClick={detayaGit}
                className="w-32 h-32 flex items-center justify-center bg-white rounded-xl cursor-pointer hover:opacity-95 transition-all border border-brand-text/5 flex-shrink-0 overflow-hidden"
            >
                <img
                    src={item.resim || "/images/bos.jpg"}
                    alt={urunIsmi}
                    /* KESİN ÇÖZÜM DÜZELTMESİ: 
                       - w-full h-full: Resmi kutuya yayar.
                       - object-cover: Resmi kutunun içine tam sığdırmak yerine, kutuyu tamamen dolduracak şekilde yayar. Bu, resmin içindeki beyaz boşlukları kutunun dışına taşır ve gerçek ürünü büyütür. Kenarlardan hafif kırpma yapabilir ama ürün görünür olur.
                       - p-0.5: Çok az bir iç pay.
                    */
                    className="w-full h-full object-cover p-0.5 transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="flex-1">
                {/* Ürün İsmi */}
                <h3
                    onClick={detayaGit}
                    className="font-bold text-lg text-brand-text cursor-pointer hover:text-brand-accent transition-colors leading-tight"
                >
                    {urunIsmi}
                </h3>

                {/* Açıklama */}
                <p className="text-xs text-brand-text/50 italic mt-1 leading-relaxed">
                    {kisaAciklama}
                </p>

                {/* Fiyat */}
                <p className="font-black text-brand-accent mt-2 text-xl italic font-serif">
                    {item.fiyat} <span className="text-sm font-sans not-italic ml-0.5">TL</span>
                </p>
            </div>

            {/* Miktar ve Silme Butonları */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-1 bg-brand-bg p-1 rounded-xl border border-brand-text/10">
                    <button 
                        onClick={() => dispatch({ type: "SEPETCIKAR", payload: item.id })} 
                        className="w-8 h-8 flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-brand-bg rounded-lg transition-all font-bold"
                    >
                        −
                    </button>
                    <span className="w-10 text-center font-bold text-brand-text">{item.miktar}</span>
                    <button 
                        onClick={() => dispatch({ type: "SEPETEEKLE", payload: item })} 
                        className="w-8 h-8 flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-brand-bg rounded-lg transition-all font-bold"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={() => dispatch({ type: "SEPETTEMIZLE", payload: item.id })}
                    className="p-3 text-brand-text/30 hover:text-red-500 transition-all group/trash"
                    title="Ürünü sepetten çıkar"
                >
                    <i className="bx bx-trash text-2xl group-hover/trash:rotate-12 transition-transform"></i>
                </button>
            </div>
        </div>
    )
}