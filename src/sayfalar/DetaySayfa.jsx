import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetayKarti from '../components/DetayKarti';

const DetaySayfa = () => {
  const { id } = useParams();
  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    setYukleniyor(true);
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
    <div className="min-h-screen bg-brand-bg transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb - SEO dostu ve Tıklanabilir navigasyon */}
        <div className="mb-8 text-sm font-medium text-brand-text/50 px-4 flex items-center gap-2">
          {/* 1. Ana Sayfa Linki */}
          <Link 
            to="/" 
            className="hover:text-brand-accent transition-colors duration-300"
          >
            Ana Sayfa
          </Link>
          
          <span className="opacity-30">/</span>
          
          {/* 2. Kategori Linki (Genel arama 'q' parametresi ile) */}
          <Link 
            to={`/arama?q=${encodeURIComponent(urun.kategori || '')}`} 
            className="hover:text-brand-accent transition-colors duration-300"
          >
            {urun.kategori || 'Ürünler'}
          </Link>
          
          <span className="opacity-30">/</span>
          
          {/* 3. Mevcut Ürün İsmi (Tıklanamaz) */}
          <span className="text-brand-accent font-bold truncate">
            {urun.ad || urun.urun_adi}
          </span>
        </div>

        {/* Ana Ürün Detay Kartı */}
        <div className="transform transition-all duration-300">
          <DetayKarti urun={urun} />
        </div>

      </div>
    </div>
  );
};

export default DetaySayfa;