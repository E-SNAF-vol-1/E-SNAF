import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Merkezi API yapılandırması
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
      if (sorgu.trim().length < 2) {
        setSonuclar({ urunler: [], kategoriler: [], altKategoriler: [] });
        setDropdownAcik(false);
        return;
      }

      setYukleniyor(true);
      try {
        // Rota düzeltildi: /products/search/live
        const res = await api.get(`/products/search/live?q=${encodeURIComponent(sorgu)}`);
        setSonuclar(res.data);
        setDropdownAcik(true);
      } catch (err) {
        console.error("Canlı arama hatası:", err);
      } finally {
        setYukleniyor(false);
      }
    };

    const timeoutId = setTimeout(aramaYap, 300);
    return () => clearTimeout(timeoutId);
  }, [sorgu]);

  // Dışarı tıklandığında listeyi kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aramaRef.current && !aramaRef.current.contains(event.target)) {
        setDropdownAcik(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (sorgu.trim()) {
      setDropdownAcik(false);
      // Enter'a basıldığında genel arama sayfasına q parametresiyle gider
      navigate(`/arama?q=${encodeURIComponent(sorgu)}`);
    }
  };

  const handleCikis = async () => {
    setMenuAcik(false);
    await cikisYap();
    navigate("/");
  };

  const buttonStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-[#5d4037] hover:text-[#f5f5dc] font-medium text-sm";

  return (
    <header className="sticky top-0 z-50 bg-[#f8f5eb] border-b border-[#d2b48c]/30 shadow-sm text-[#5d4037]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => navigate("/")}>
            <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase transition-all duration-500 group-hover:tracking-[0.35em]">
              E<span className="text-[#d2b48c]">-</span>SNAF
            </h1>
          </div>

          {/* Akıllı Canlı Arama Bölümü */}
          <div className="hidden md:block flex-grow max-w-md relative" ref={aramaRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Ürün, kategori veya marka ara..."
                value={sorgu}
                onChange={(e) => setSorgu(e.target.value)}
                onFocus={() => sorgu.length >= 2 && setDropdownAcik(true)}
                className="w-full bg-white border border-[#d2b48c]/20 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#5d4037]/10 text-sm font-light shadow-sm"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                {yukleniyor ? <i className="bx bx-loader-alt animate-spin text-xl"></i> : <i className="bx bx-search text-xl"></i>}
              </button>
            </form>

            {/* Canlı Sonuç Dropdown */}
            {dropdownAcik && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#d2b48c]/20 overflow-hidden z-[60] max-h-[450px] overflow-y-auto">

                {/* Kategoriler ve Alt Kategoriler Bölümü */}
                {(sonuclar.kategoriler?.length > 0 || sonuclar.altKategoriler?.length > 0) && (
                  <div className="p-3 border-b border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-wider">Hızlı Kategoriler</p>

                    {sonuclar.kategoriler?.map(kat => (
                      <div key={`kat-${kat.id}`} onClick={() => { navigate(`/arama?kategori=${kat.id}`); setDropdownAcik(false); }} className="flex items-center gap-3 p-2 hover:bg-[#f8f5eb] rounded-xl cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#d2b48c] group-hover:bg-[#5d4037] group-hover:text-white transition-all">
                          <i className="bx bx-category-alt text-lg"></i>
                        </div>
                        <span className="text-sm font-medium">{kat.ad}</span>
                      </div>
                    ))}

                    {sonuclar.altKategoriler?.map(alt => (
                      <div key={`alt-${alt.id}`} onClick={() => { navigate(`/arama?altKategori=${alt.id}`); setDropdownAcik(false); }} className="flex items-center gap-3 p-2 hover:bg-[#f8f5eb] rounded-xl cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#d2b48c] group-hover:bg-[#5d4037] group-hover:text-white transition-all">
                          <i className="bx bx-subdirectory-right text-lg"></i>
                        </div>
                        <span className="text-sm font-light">{alt.ad}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ürünler Bölümü */}
                {sonuclar.urunler?.length > 0 ? (
                  <div className="p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-wider">Ürünler</p>
                    {sonuclar.urunler.map(urun => (
                      <div
                        key={`urun-${urun.id}`}
                        onClick={() => {
                          // App.jsx içindeki /urun/:kategori/:altKategori/:urunAdi/:id yapısına uygun yönlendirme
                          const kategori = (urun.kategori || 'genel').toLowerCase().replace(/\s+/g, '-');
                          const altKategori = (urun.altKategori || 'urun').toLowerCase().replace(/\s+/g, '-');
                          const urunAdi = (urun.ad || 'urun').toLowerCase().replace(/\s+/g, '-');
                          navigate(`/urun/${kategori}/${altKategori}/${urunAdi}/${urun.id}`);
                          setDropdownAcik(false);
                        }}
                        className="flex items-center gap-4 p-2 hover:bg-[#f8f5eb] rounded-xl cursor-pointer"
                      >
                        <img src={urun.resim || "/images/bos.jpg"} className="w-10 h-10 object-contain bg-gray-50 rounded-lg p-1" alt={urun.ad} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium line-clamp-1">{urun.ad}</span>
                          <span className="text-xs text-[#8d6e63] font-bold">{urun.fiyat} TL</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !yukleniyor && sorgu.length >= 2 && sonuclar.kategoriler?.length === 0 && (
                    <div className="p-8 text-center text-gray-400 italic text-sm">Aradığınız kriterlere uygun sonuç bulunamadı.</div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sağ butonlar */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  className={buttonStyle}
                  onClick={() => setMenuAcik(!menuAcik)}
                  style={{ background: menuAcik ? '#5d4037' : undefined, color: menuAcik ? '#f5f5dc' : undefined }}
                >
                  <i className="bx bx-user text-xl"></i>
                  <span className="hidden lg:inline">{user.ad} {user.soyad?.charAt(0)}.</span>
                  <span className="text-[10px]">{menuAcik ? '▲' : '▼'}</span>
                </button>

                {menuAcik && (
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl min-w-[220px] z-[100] overflow-hidden border border-[#f0ebe0]">
                    <div className="p-4 bg-[#f8f5eb] border-b border-[#f0ebe0]">
                      <p className="font-bold text-[#5d4037] text-sm">{user.ad} {user.soyad}</p>
                      <p className="text-xs text-[#a68b6d] truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { setMenuAcik(false); navigate("/hesabim"); }} className="w-full p-4 text-left text-sm font-semibold text-[#5d4037] hover:bg-[#f8f5eb] transition-colors">📦 Hesabım & Siparişlerim</button>
                    <button onClick={handleCikis} className="w-full p-4 text-left text-sm font-semibold text-[#c62828] hover:bg-red-50 border-t border-red-50 transition-colors">🚪 Çıkış Yap</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={buttonStyle} onClick={() => navigate("/giris-yap")}>
                <i className="bx bx-user text-xl"></i>
                <span className="hidden lg:inline">Hesabım</span>
              </div>
            )}

            <div className={buttonStyle} onClick={() => navigate("/sepet")}>
              <i className="bx bx-cart text-xl"></i>
              <span className="hidden lg:inline">Sepetim</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}