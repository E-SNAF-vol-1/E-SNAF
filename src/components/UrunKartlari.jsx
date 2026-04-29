import React from "react";
import { Link } from "react-router-dom";

export default function UrunKartlari({ urun, gorunumModu }) {
    if (!urun || !urun.id) return null;

    const isList = gorunumModu === "list";

    // API'den gelen farklı resim anahtarlarını kontrol et ve tam URL oluştur
    const rawImage = urun.resim || urun.gorsel || urun.resim_url || urun.image;
    const finalImage = rawImage 
        ? (rawImage.startsWith('http') ? rawImage : `https://esnaf.apps.srv.aykutdurgut.com.tr${rawImage}`)
        : "https://placehold.co/400x400/2b2d42/white?text=Gorsel+Yok"; // Daha şık bir placeholder

    const slugify = (text) => {
        return (text || "genel")
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    const kategoriPath = slugify(urun.kategori);
    const altKategoriPath = slugify(urun.altKategori || "alt-kategori");
    const isimPath = slugify(urun.ad || urun.isim || urun.urun_adi);

    return (
        <Link
            to={`/urun/${kategoriPath}/${altKategoriPath}/${isimPath}/${urun.id}`}
            // BURADA DEĞİŞİKLİK YAPTIK:
            // 1. Dış çerçeve varsayılan olarak şeffaf: 'border-transparent'
            // 2. Hover olduğunda tema vurgu rengi ve gölge ekledik: 
            //    'hover:border-brand-accent hover:shadow-[0_0_20px_rgba(var(--color-brand-accent-rgb),0.3)]'
            // 3. Geçiş efektini yumuşattık: 'transition-all duration-300'
            className={`flex bg-brand-card p-4 rounded-[20px] border border-transparent transition-all duration-300 group ${
                isList ? 'flex-row gap-4' : 'flex-col gap-3'
            } hover:border-brand-accent hover:shadow-[0_0_20px_rgba(210,180,140,0.3)]`} // Altın sarısı gölge
        >
            {/* Ürün Görseli - Sabit aspect-ratio titremeyi engeller */}
            <div className={`overflow-hidden rounded-[15px] shrink-0 bg-brand-bg/50 relative ${
                isList ? 'w-[110px] h-[110px]' : 'w-full aspect-square'
            }`}>
                <img
                    src={finalImage}
                    alt={urun.ad || urun.isim}
                    // Hover'da görselin hafif büyüme efekti devam ediyor
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://placehold.co/400x400/2b2d42/white?text=Gorsel+Yok"; }}
                />
            </div>

            {/* Ürün Bilgileri */}
            <div className={`flex w-full ${isList ? 'flex-row items-center justify-between' : 'flex-col px-1'}`}>
                <div className="flex flex-col">
                    {/* Hover'da ürün isminin rengini de vurgu rengine çeviriyoruz */}
                    <div className="font-bold text-brand-text text-base line-clamp-1 group-hover:text-brand-accent transition-colors">
                        {urun.ad || urun.isim || "İsimsiz Ürün"}
                    </div>
                    <div className="text-[12px] text-brand-text/50 font-medium">
                        {urun.kategori || "Genel Kategori"}
                    </div>
                </div>
                <div className="font-bold text-brand-text text-lg mt-2">
                    {Number(urun.fiyat || 0).toLocaleString('tr-TR')} <span className="text-sm font-normal">TL</span>
                </div>
            </div>
        </Link>
    );
}