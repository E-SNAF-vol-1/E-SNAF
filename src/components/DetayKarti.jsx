import React from 'react';
import { useSepet } from '../context/SepetContext.jsx';

const DetayKarti = ({ urun }) => {
  const {
    id,
    fiyat,
    resim,
    kategori,
    aciklama,
    alt_kategori,
    altKategori
  } = urun;

  const urunIsmi = urun.isim || urun.ad || urun.urun_adi || "İsimsiz Ürün";
  const { dispatch, bildirimiGoster } = useSepet();

  // CANLI SİSTEM İÇİN RESİM YOLU KONTROLÜ
  // Eğer resim "/uploads/..." gibi geliyorsa başına API adresini ekler
  const tamResimYolu = resim?.startsWith('http') 
    ? resim 
    : `https://esnaf.apps.srv.aykutdurgut.com.tr${resim}`;

  const sepeteEkleHandler = () => {
    const eklenecekUrun = {
      id,
      isim: urunIsmi,
      fiyat,
      resim: tamResimYolu,
      aciklama,
      kategori,
      altKategori: altKategori || alt_kategori
    };

    dispatch({ type: "SEPETEEKLE", payload: eklenecekUrun });

    if (bildirimiGoster) {
      bildirimiGoster(eklenecekUrun);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

      {/* SOL: ÜRÜN GÖRSELİ */}
{/* md:col-span-5: Sol tarafta 5 birimlik alan kaplar. */}
<div className="md:col-span-5 w-full">
  {/* Bu div, resmin dış çerçevesidir ve sticky (yapışkan) özelliğini taşır. */}
  <div className="bg-brand-card rounded-[2.5rem] p-4 shadow-2xl border border-black/5 sticky top-32 transition-all duration-500 overflow-hidden group">
    
    <a href={tamResimYolu} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
      
      <img
        src={tamResimYolu || "https://via.placeholder.com/600"}
        alt={urunIsmi}
        className="w-full h-auto min-h-[400px] object-cover rounded-[2rem] shadow-inner transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </a>

    {/* 'YENİ SEZON' Etiketi */}
    <div className="absolute top-8 left-8 bg-brand-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse pointer-events-none">
      YENİ SEZON
    </div>
  </div>
</div>
        {/* SAĞ: ÜRÜN DETAYLARI */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div>
            {/* Dinamik renkler ve yumuşak geçişler */}
            <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase bg-brand-accent/10 px-3 py-1 rounded-full">
              {kategori} / {altKategori || alt_kategori}
            </span>
            <h1 className="text-4xl font-bold text-brand-text mt-4 leading-tight tracking-tight">
              {urunIsmi}
            </h1>
          </div>

          {/* Fiyat Bilgisi */}
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-brand-accent">{fiyat} TL</span>
            <span className="text-lg text-gray-400 line-through decoration-brand-accent/30 italic">
              {(fiyat * 1.15).toFixed(0)} TL
            </span>
          </div>

          {/* Ürün Açıklaması */}
          <div className="border-t border-black/5 pt-6">
            <h3 className="text-xs font-bold text-brand-text/50 mb-3 uppercase tracking-[0.2em]">Ürün Detayları</h3>
            <div
              className="text-brand-text/80 text-base leading-relaxed italic font-light"
              dangerouslySetInnerHTML={{ __html: aciklama }}
            />
          </div>

          {/* Etkileşim Butonları */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={sepeteEkleHandler}
              className="flex-[4] bg-brand-accent text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 hover:shadow-xl hover:shadow-brand-accent/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Sepete Ekle
            </button>
          </div>

          {/* Bilgi Kartları */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="py-3 px-4 bg-brand-card rounded-2xl border border-black/5 flex items-center gap-3 transition-colors">
              <span className="text-xl">🚚</span>
              <p className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Aynı Gün Kargo</p>
            </div>
            <div className="py-3 px-4 bg-brand-card rounded-2xl border border-black/5 flex items-center gap-3 transition-colors">
              <span className="text-xl">🛡️</span>
              <p className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Resmi Garantili</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetayKarti;