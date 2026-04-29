import React from 'react';
import UstBilgiBar from "../components/UstBilgiBar";

export default function Anasayfa() {
  return (
    /* bg-brand-bg: Tüm sayfanın ana zemini. Artık her şey bu rengin üzerinde süzülecek. */
    <div className="bg-brand-bg min-h-screen transition-all duration-700 flex flex-col">
      
      <div className="max-w-7xl mx-auto w-full px-4 pt-6 flex-grow">
        
        {/* Ürünlerin arkasındaki büyük beyaz kutu kaldırıldı, zemin şeffaf. */}
        <div className="bg-transparent transition-all duration-700 flex flex-col">
          
          {/* Üstteki Hava Durumu Barı - Zemine göre otomatik renk alır */}
          <UstBilgiBar />
          
          {/* IFRAME ALANI: 
              Angular projesi artık doğrudan 'bg-brand-bg' üzerinde duruyor.
          */}
          <div className="w-full relative bg-transparent">
            <iframe
              src="/angular-urun/index.html"
              title="Angular Urun Listeleme"
              className="w-full h-[1400px] border-0 bg-transparent"
              allowtransparency="true"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          
        </div>

        {/* Güven Mührü */}
        <div className="mt-8 mb-8 text-center text-brand-text/40 text-sm italic font-medium">
          © 2026 E-SNAF Altyapısı ile Güçlendirilmiştir.
        </div>
      </div>
    </div>
  );
}