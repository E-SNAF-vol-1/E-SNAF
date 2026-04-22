import React from 'react';
import { useSepet } from '../context/SepetContext.jsx'; // Context bağlantısı

const DetayKarti = ({ urun }) => {
  // Veri tabanından farklı anahtar isimleriyle gelebilecek verileri karşılıyoruz
  const {
    id,
    fiyat,
    resim,
    kategori,
    aciklama,
    alt_kategori,
    altKategori
  } = urun;

  // Ürün ismini garanti altına alıyoruz
  const urunIsmi = urun.isim || urun.ad || urun.urun_adi || "İsimsiz Ürün";

  // Sepet context'inden gerekli fonksiyonları çekiyoruz
  const { dispatch, bildirimiGoster } = useSepet();

  const sepeteEkleHandler = () => {
    const eklenecekUrun = {
      id,
      isim: urunIsmi,
      fiyat,
      resim,
      aciklama,
      kategori,
      altKategori: altKategori || alt_kategori
    };

    // 1. Ürünü sepet state'ine ekliyoruz
    dispatch({
      type: "SEPETEEKLE",
      payload: eklenecekUrun
    });

    // 2. Sepete eklendi bildirimini tetikliyoruz
    if (bildirimiGoster) {
      bildirimiGoster(eklenecekUrun);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

        {/* SOL: ÜRÜN GÖRSELİ */}
        <div className="md:col-span-5 bg-white rounded-2xl p-2 shadow-sm border border-stone-100 sticky top-28">
          <img
            src={resim || "https://via.placeholder.com/400"}
            alt={urunIsmi}
            className="w-full h-auto object-cover rounded-xl"
          />
          <div className="absolute top-6 left-6 bg-[#5d4037] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            YENİ SEZON
          </div>
        </div>

        {/* SAĞ: ÜRÜN DETAYLARI */}
        <div className="md:col-span-7 flex flex-col gap-5">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#8d7763] uppercase bg-[#f8f5eb] px-2 py-0.5 rounded">
              {kategori} / {altKategori || alt_kategori}
            </span>
            <h1 className="text-3xl font-bold text-[#2b241a] mt-2 leading-tight">
              {urunIsmi}
            </h1>
          </div>

          {/* Fiyat Bilgisi */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#5d4037]">{fiyat} TL</span>
            <span className="text-sm text-stone-400 line-through">{(fiyat * 1.15).toFixed(0)} TL</span>
          </div>

          {/* Ürün Açıklaması */}
          <div className="border-t border-stone-100 pt-4">
            <h3 className="text-sm font-bold text-[#2b241a] mb-2 uppercase tracking-wide">Ürün Detayları</h3>
            <div
              className="text-stone-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aciklama }}
            />
          </div>

          {/* Etkileşim Butonları */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={sepeteEkleHandler}
              className="flex-[4] bg-[#5d4037] text-white py-3.5 rounded-xl font-bold text-md hover:bg-[#3e2b25] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Sepete Ekle
            </button>
            <button className="flex-1 bg-white border border-stone-200 text-stone-400 py-3.5 rounded-xl hover:text-red-500 transition-all flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Bilgi Kartları */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="py-2.5 px-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2">
              <span className="text-lg">🚚</span>
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-tighter">Aynı Gün Kargo</p>
            </div>
            <div className="py-2.5 px-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-tighter">Resmi Garantili</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetayKarti;