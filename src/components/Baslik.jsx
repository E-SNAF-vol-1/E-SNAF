import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Baslik() {
  const navigate = useNavigate();
  const [sorgu, setSorgu] = useState("");
  const { user, cikisYap } = useAuth();
  const [menuAcik, setMenuAcik] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (sorgu.trim()) {
      navigate(`/arama?q=${encodeURIComponent(sorgu)}`);
    }
  };

  const handleCikis = async () => {
    setMenuAcik(false);
    await cikisYap();
    navigate("/");
  };

  const buttonStyle =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-[#5d4037] hover:text-[#f5f5dc] font-medium text-sm";

  return (
    <header className="sticky top-0 z-50 bg-[#f8f5eb] border-b border-[#d2b48c]/30 shadow-sm text-[#5d4037]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase transition-all duration-500 group-hover:tracking-[0.35em]">
              E<span className="text-[#d2b48c]">-</span>SNAF
            </h1>
          </div>

          {/* Arama */}
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

          {/* Sağ butonlar */}
          <div className="flex items-center gap-2">

            {/* ── Giriş yapıldıysa: İsim + Dropdown ── */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className={buttonStyle}
                  onClick={() => setMenuAcik(!menuAcik)}
                  style={{ background: menuAcik ? '#5d4037' : undefined, color: menuAcik ? '#f5f5dc' : undefined }}
                >
                  <i className="bx bx-user text-xl"></i>
                  <span className="hidden lg:inline">
                    {user.ad} {user.soyad?.charAt(0)}.
                  </span>
                  <span style={{ fontSize: '10px' }}>{menuAcik ? '▲' : '▼'}</span>
                </button>

                {/* Dropdown menü */}
                {menuAcik && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    backgroundColor: '#fff', borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(93,64,55,0.15)',
                    minWidth: '200px', zIndex: 100, overflow: 'hidden',
                    border: '1px solid #f0ebe0'
                  }}>
                    {/* Kullanıcı bilgisi */}
                    <div style={{ padding: '16px 18px', backgroundColor: '#f8f5eb', borderBottom: '1px solid #f0ebe0' }}>
                      <p style={{ margin: 0, fontWeight: '800', color: '#5d4037', fontSize: '14px' }}>
                        {user.ad} {user.soyad}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#a68b6d', wordBreak: 'break-all' }}>
                        {user.email}
                      </p>
                    </div>

                    {/* Menü öğeleri */}
                    <button
                      onClick={() => { setMenuAcik(false); navigate("/hesabim"); }}
                      style={ddBtn}
                    >
                      📦 Hesabım & Siparişlerim
                    </button>
                    <button
                      onClick={handleCikis}
                      style={{ ...ddBtn, color: '#c62828', borderTop: '1px solid #fef2f2' }}
                    >
                      🚪 Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Giriş yapılmadıysa: normal buton ── */
              <div
                className={buttonStyle}
                onClick={() => navigate("/giris-yap")}
              >
                <i className="bx bx-user text-xl"></i>
                <span className="hidden lg:inline">Hesabım</span>
              </div>
            )}

            {/* Sepet butonu */}
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

const ddBtn = {
  display: 'block', width: '100%', padding: '13px 18px',
  background: 'none', border: 'none', textAlign: 'left',
  fontSize: '14px', fontWeight: '600', color: '#5d4037',
  cursor: 'pointer', transition: 'background 0.15s'
};
