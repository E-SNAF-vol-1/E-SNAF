import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Baslik() {
  const navigate = useNavigate();
  const [sorgu, setSorgu] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (sorgu.trim()) {
      navigate(`/arama?q=${encodeURIComponent(sorgu)}`);
    }
  };

  // Butonlar için ortak stil sınıfı
  const buttonStyle =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-[#5d4037] hover:text-[#f5f5dc] font-medium text-sm";

  return (
    <header className="sticky top-0 z-50 bg-[#f8f5eb] border-b border-[#d2b48c]/30 shadow-sm text-[#5d4037]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Logo Bölümü */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase transition-all duration-500 group-hover:tracking-[0.35em]">
              E<span className="text-[#d2b48c]">-</span>SNAF
            </h1>
          </div>

          {/* Arama Çubuğu */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-grow max-w-md relative"
          >
            <input
              type="text"
              placeholder="Ürün, kategori veya marka ara..."
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              className="w-full bg-white border border-[#d2b48c]/20 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#5d4037]/10 text-sm font-light placeholder:text-[#5d4037]/40 shadow-sm text-[#5d4037]"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <i className="bx bx-search text-xl"></i>
            </button>
          </form>

          {/* Sağ Menü Butonları */}
          <div className="flex items-center gap-2">
            
            {/* HESABIM BUTONU - ARTIK ÇALIŞIYOR */}
            <div 
              className={buttonStyle} 
              onClick={() => {
                console.log("Giriş sayfasına yönlendiriliyor...");
                navigate("/giris-yap");
              }}
            >
              <i className="bx bx-user text-xl"></i>
              <span className="hidden lg:inline">Hesabım</span>
            </div>

            <div className={buttonStyle}>
              <i className="bx bx-heart text-xl"></i>
              <span className="hidden lg:inline">Favorilerim</span>
            </div>

            <div
              className={buttonStyle}
              onClick={() => navigate("/sepet")}
            >
              <i className="bx bx-cart text-xl"></i>
              <span className="hidden lg:inline">Sepetim</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}