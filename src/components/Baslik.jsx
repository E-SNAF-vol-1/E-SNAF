import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const api = axios.create({
  baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api"
});

export default function Baslik() {
  const navigate = useNavigate();
  const { user, cikisYap } = useAuth();

  const [sorgu, setSorgu] = useState("");
  const [menuAcik, setMenuAcik] = useState(false);
  const [sonuclar, setSonuclar] = useState({ urunler: [], kategoriler: [], altKategoriler: [] });
  const [dropdownAcik, setDropdownAcik] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const aramaRef = useRef(null);

  // Canlı Arama Debounce Mekanizması
  useEffect(() => {
    const aramaYap = async () => {
      const temizSorgu = sorgu.trim();
      if (temizSorgu.length < 2) {
        setSonuclar({ urunler: [], kategoriler: [], altKategoriler: [] });
        setDropdownAcik(false);
        return;
      }

      setYukleniyor(true);
      try {
        const res = await api.get(`/products/search/live?q=${encodeURIComponent(temizSorgu)}`);
        setSonuclar({
          urunler: res.data.urunler || [],
          kategoriler: res.data.kategoriler || [],
          altKategoriler: res.data.altKategoriler || []
        });
        setDropdownAcik(true);
      } catch (err) {
        console.error("Arama hatası:", err);
      } finally {
        setYukleniyor(false);
      }
    };

    const timeoutId = setTimeout(aramaYap, 300);
    return () => clearTimeout(timeoutId);
  }, [sorgu]);

  // Dışarı tıklandığında dropdown kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aramaRef.current && !aramaRef.current.contains(event.target)) {
        setDropdownAcik(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCikis = async () => {
    setMenuAcik(false);
    await cikisYap();
    navigate("/");
  };

  const slugify = (text) => (text || 'genel').toString().toLowerCase().replace(/\s+/g, '-');

  const buttonStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-brand-accent hover:text-brand-bg font-medium text-sm text-brand-text/80";

  return (
    <header className="sticky top-0 z-50 bg-brand-card border-b border-brand-text/10 shadow-sm text-brand-text transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* METİN TABANLI LOGO - KAYMA YAPMAYAN VERSİYON */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="flex flex-col leading-none">
              <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-brand-text transition-all duration-300 group-hover:text-brand-accent">
                E<span className="text-brand-accent group-hover:text-brand-text">-</span>SNAF
              </h1>
              <span className="text-[10px] font-bold tracking-[0.3em] text-brand-text/40 uppercase mt-1">
                Dijital Mağaza
              </span>
            </div>
          </div>

          {/* Canlı Arama Çubuğu */}
          <div className="hidden md:block flex-grow max-w-md relative" ref={aramaRef}>
            <form onSubmit={(e) => { e.preventDefault(); navigate(`/arama?q=${sorgu}`); setDropdownAcik(false); }} className="relative">
              <input
                type="text"
                placeholder="Ürün, kategori veya marka ara..."
                value={sorgu}
                onChange={(e) => setSorgu(e.target.value)}
                onFocus={() => sorgu.trim().length >= 2 && setDropdownAcik(true)}
                className="w-full bg-brand-bg border border-brand-text/10 text-brand-text rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-sm font-light shadow-sm transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text/40 hover:text-brand-accent">
                {yukleniyor ? <i className="bx bx-loader-alt animate-spin text-xl"></i> : <i className="bx bx-search text-xl"></i>}
              </button>
            </form>

            {/* Arama Sonuçları */}
            {dropdownAcik && (
              <div className="absolute top-full left-0 w-full mt-2 bg-brand-card rounded-2xl shadow-2xl border border-brand-text/10 overflow-hidden z-[60] max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {sonuclar.urunler.length > 0 ? (
                  <div className="p-3">
                    {sonuclar.urunler.map(urun => (
                      <div
                        key={urun.id}
                        onClick={() => {
                          const kat = slugify(urun.kategori);
                          const alt = slugify(urun.altKategori);
                          const isim = slugify(urun.ad || urun.isim);
                          navigate(`/urun/${kat}/${alt}/${isim}/${urun.id}`);
                          setDropdownAcik(false);
                        }}
                        className="flex items-center gap-4 p-2 hover:bg-brand-bg rounded-xl cursor-pointer group"
                      >
                        <img src={urun.resim || "/images/bos.jpg"} className="w-10 h-10 object-contain rounded-lg" alt={urun.ad} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-brand-text line-clamp-1">{urun.ad || urun.isim}</span>
                          <span className="text-xs text-brand-accent font-bold">{Number(urun.fiyat).toLocaleString('tr-TR')} TL</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !yukleniyor && <div className="p-8 text-center text-brand-text/30 italic text-sm">Sonuç bulunamadı.</div>}
              </div>
            )}
          </div>

          {/* Sağ Butonlar */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button className={`${buttonStyle} ${menuAcik ? 'bg-brand-accent text-brand-bg' : ''}`} onClick={() => setMenuAcik(!menuAcik)}>
                  <i className="bx bx-user text-xl"></i>
                  <span className="hidden lg:inline">{user.ad} {user.soyad?.charAt(0)}.</span>
                </button>
                {menuAcik && (
                  <div className="absolute right-0 top-[calc(100%+12px)] bg-brand-card rounded-2xl shadow-2xl min-w-[220px] z-[100] border border-brand-text/10 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 bg-brand-bg border-b border-brand-text/5">
                      <p className="font-bold text-brand-text text-sm">{user.ad} {user.soyad}</p>
                      <p className="text-xs text-brand-text/40 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { setMenuAcik(false); navigate("/hesabim"); }} className="w-full p-4 text-left text-sm font-semibold hover:bg-brand-bg transition-colors italic">📦 Hesabım</button>
                    <button onClick={handleCikis} className="w-full p-4 text-left text-sm font-semibold text-red-500 border-t border-brand-text/5 hover:bg-red-500/5 transition-colors italic">🚪 Çıkış Yap</button>
                  </div>
                )}
              </div>
            ) : (
              <button className={buttonStyle} onClick={() => navigate("/giris-yap")}>
                <i className="bx bx-user text-xl"></i>
                <span className="hidden lg:inline">Giriş Yap</span>
              </button>
            )}

            <button className={buttonStyle} onClick={() => navigate("/sepet")}>
              <i className="bx bx-cart text-xl"></i>
              <span className="hidden lg:inline">Sepetim</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}