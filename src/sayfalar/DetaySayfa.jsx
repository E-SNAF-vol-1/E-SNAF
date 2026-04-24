import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetayKarti from '../components/DetayKarti';

const DetaySayfa = () => {
  const { id } = useParams();
  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  // DetaySayfa.jsx içindeki useEffect
useEffect(() => {
  setYukleniyor(true);
  
  // Localhost yerine canlı API adresi
  fetch(`https://esnaf.apps.srv.aykutdurgut.com.tr/api/products/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setUrun(data);
      setYukleniyor(false);
    })
    .catch(err => {
      setHata(err.message);
      setYukleniyor(false);
    });
}, [id]);

  // Tema uyumlu mesaj kutusu (Loading ve Hata için)
  const MesajEkrani = ({ cocuk }) => (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-10 transition-colors duration-500">
      <div className="bg-brand-card p-8 rounded-[2rem] shadow-xl text-brand-text">
        {cocuk}
      </div>
    </div>
  );

  if (yukleniyor) return <MesajEkrani cocuk={<div className="text-xl animate-pulse font-medium">Ürün bilgileri getiriliyor...</div>} />;
  
  if (hata) return <MesajEkrani cocuk={<div className="text-red-500 font-bold tracking-tight">Hata: {hata}</div>} />;
  
  if (!urun) return <MesajEkrani cocuk={<div>Aradığınız ürün bulunamadı.</div>} />;

  return (
    /* min-h-screen: Sayfa boyu ne olursa olsun arka planın bej kalmasını sağlar.
       bg-brand-bg: Senin index.css'e eklediğimiz bej renk.
       transition-colors: Tema değişirken (dark/light) akıcı geçiş yapar.
    */
    <div className="min-h-screen bg-brand-bg transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb - SEO dostu navigasyon */}
        <div className="mb-8 text-sm font-medium text-gray-400 px-4">
          Ana Sayfa / {urun.kategori || 'Ürünler'} / <span className="text-brand-accent font-bold">{urun.ad || urun.urun_adi}</span>
        </div>

        {/* Ana Ürün Detay Kartı */}
        <div className="transform transition-all duration-300">
           <DetayKarti urun={urun} />
        </div>

        {/* Alt Bilgi Alanı - SEO Açıklaması */}
        <div className="mt-12 bg-brand-card rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-black/5">
          <h2 className="text-2xl font-bold text-brand-text mb-6">Ürün Detayları ve Özellikleri</h2>
          <div className="prose prose-amber max-w-none text-brand-text/80 leading-relaxed italic">
            {urun.aciklama || "Bu ürün hakkında detaylı açıklama yakında eklenecektir."}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetaySayfa;