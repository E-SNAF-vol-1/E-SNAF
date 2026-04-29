import React, { useState } from 'react';
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

  // Modal (Lightbox) durumu için state
  const [modalAcik, setModalAcik] = useState(false);
  const urunIsmi = urun.isim || urun.ad || urun.urun_adi || "İsimsiz Ürün";
  const { dispatch, bildirimiGoster } = useSepet();

  // CANLI SİSTEM İÇİN RESİM YOLU KONTROLÜ
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
    if (bildirimiGoster) bildirimiGoster(eklenecekUrun);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

        {/* SOL: ÜRÜN GÖRSELİ (Kutuyu Tam Dolduran Versiyon) */}
        <div className="md:col-span-5 w-full">
          <div className="bg-brand-card rounded-[2.5rem] p-4 shadow-2xl border border-black/5 sticky top-32 overflow-hidden group">
            
            {/* Görsel Konteynırı */}
            <div 
              className="relative overflow-hidden rounded-[2rem] cursor-zoom-in"
              onClick={() => setModalAcik(true)}
            >
              <img
                src={tamResimYolu || "https://via.placeholder.com/600"}
                alt={urunIsmi}
                // object-cover ve h-[500px] ile kutuyu tam doldurmasını sağladık
                className="w-full h-[500px] object-cover transition-transform duration-700 ease-out group-hover:scale-125"
              />
              
              {/* Hover Durumunda Çıkan İpucu */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="bg-white/80 backdrop-blur-sm text-brand-text px-4 py-2 rounded-full text-xs font-bold shadow-lg">BÜYÜTMEK İÇİN TIKLA</span>
              </div>
            </div>

            {/* 'YENİ SEZON' Etiketi */}
            <div className="absolute top-8 left-8 bg-brand-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse pointer-events-none">
              YENİ SEZON
            </div>
          </div>
        </div>

        {/* SAĞ: ÜRÜN DETAYLARI */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase bg-brand-accent/10 px-3 py-1 rounded-full">
              {kategori} / {altKategori || alt_kategori}
            </span>
            <h1 className="text-4xl font-bold text-brand-text mt-4 leading-tight tracking-tight uppercase italic tracking-tighter">
              {urunIsmi}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-brand-accent">{fiyat} TL</span>
            <span className="text-lg text-gray-400 line-through decoration-brand-accent/30 italic">
              {(fiyat * 1.15).toFixed(0)} TL
            </span>
          </div>

          <div className="border-t border-black/5 pt-6">
            <h3 className="text-xs font-bold text-brand-text/50 mb-3 uppercase tracking-[0.2em]">Ürün Detayları</h3>
            <div
              className="text-brand-text/80 text-base leading-relaxed italic font-light"
              dangerouslySetInnerHTML={{ __html: aciklama }}
            />
          </div>

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
        </div>

      </div>

      {/* --- TAM EKRAN MODAL (IŞIK KUTUSU) --- */}
      {modalAcik && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-0 animate-in fade-in duration-300 overflow-hidden"
          onClick={() => setModalAcik(false)} 
        >
          <button 
            className="absolute top-6 right-6 text-white text-5xl hover:text-brand-accent transition-colors z-10 p-2"
            onClick={() => setModalAcik(false)}
          >
            <i className='bx bx-x'></i> 
          </button>

          <img
            src={tamResimYolu}
            alt="Büyük Görsel"
            className="w-full h-full object-cover object-center scale-88 transition-transform duration-500 ease-out hover:scale-[0.90] rounded-none shadow-none animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default DetayKarti;