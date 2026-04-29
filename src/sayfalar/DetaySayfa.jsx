import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // useNavigate eklendi
import DetayKarti from '../components/DetayKarti';

const DetaySayfa = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Yönlendirme fonksiyonu
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
        
        {/* YENİ: ANASAYFAYA DÖN BUTONU */}
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 mb-6 text-brand-text/50 hover:text-brand-accent transition-all duration-300 font-bold text-xs uppercase tracking-[0.2em] px-2"
        >
          <div className="w-10 h-10 rounded-full border border-brand-text/10 flex items-center justify-center group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-500 shadow-sm">
            <i className="bx bx-left-arrow-alt text-2xl"></i>
          </div>
          <span>Anasayfaya Dön</span>
        </button>

        {/* Breadcrumb - Mevcut yapın korunuyor */}
        <div className="mb-8 text-sm font-medium text-brand-text/30 px-2 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-accent transition-colors italic">Ana Sayfa</Link>
          <span className="opacity-30">/</span>
          <Link 
            to={`/arama?q=${encodeURIComponent(urun.kategori || '')}`} 
            className="hover:text-brand-accent transition-colors italic"
          >
            {urun.kategori || 'Ürünler'}
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-brand-accent font-bold truncate opacity-80">
            {urun.ad || urun.urun_adi}
          </span>
        </div>

        {/* Ana Ürün Detay Kartı */}
        <div className="transform transition-all duration-500">
          <DetayKarti urun={urun} />
        </div>

      </div>
    </div>
  );
};

export default DetaySayfa;