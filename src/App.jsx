import { useEffect } from "react"; // ← useEffect ekledik
import { Routes, Route } from "react-router-dom";
import AnaLayout from "./layout/AnaLayout";
import Anasayfa from "./sayfalar/Anasayfa";
import Sepet from "./sayfalar/Sepet";
import DetaySayfa from './sayfalar/DetaySayfa';
import CerezOnayi from './components/CerezOnayi';
import AramaSonuclari from "./sayfalar/AramaSonuclari";
import CerezPolitikasi from "./sayfalar/CerezPolitikasi";
import Odeme from "./sayfalar/Odeme";
import GirisYap from "./components/GirisYap";
import KayitOl from "./components/KayitOl";
import Hesabim from "./sayfalar/Hesabim"; 
import Iletisim from "./sayfalar/Iletisim";
import { AuthProvider } from "./context/AuthContext";
import TemaSecici from "./components/TemaSecici"; 
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  // --- MÜŞTERİ TEMA SEÇİMİ MANTIĞI ---
  useEffect(() => {
    const temaUygula = async () => {
      try {
        // Mağaza ayarlarını getiren API (Arkadaşınla bu ucu netleştirin)
        const res = await axios.get("https://esnaf.apps.srv.aykutdurgut.com.tr/api/settings");
        const seciliTema = res.data.active_theme; // 'dark', 'ocean' veya 'light'

        const root = document.documentElement;
        
        // Temizlik: Mevcut sınıfları ve öznitelikleri kaldır
        root.classList.remove("dark");
        root.removeAttribute("data-theme");

        // API'den gelen değere göre yeni temayı giydir
        if (seciliTema === "dark") {
          root.classList.add("dark");
        } else if (seciliTema === "ocean") {
          root.setAttribute("data-theme", "ocean");
        }
        // light ise zaten CSS'deki bej köklere döner.
      } catch (err) {
        console.error("Tema yüklenirken hata oluştu:", err);
      }
    };

    temaUygula();
  }, []);
  // ----------------------------------

  return (
    <AuthProvider>
      <AnaLayout className="App">
        <CerezOnayi />
        {/* TemaSecici şimdilik duruyor, müşteriye teslim ederken buradan kaldırırsın */}
        <TemaSecici /> 
        <Routes>
          <Route path="/" element={<Anasayfa />} />
          <Route path="/arama" element={<AramaSonuclari />} />
          <Route path="/sepet" element={<Sepet />} />
          <Route path="/urun/:kategori/:altKategori/:urunAdi/:id" element={<DetaySayfa />} />
          <Route path="/CerezPolitikasi" element={<CerezPolitikasi />} />
          <Route path="/odeme" element={<Odeme />} />
          <Route path="/giris-yap" element={<GirisYap />} />
          <Route path="/kayit-ol" element={<KayitOl />} />
          <Route path="/hesabim" element={<Hesabim />} />
          <Route path="/iletisim" element={<Iletisim />} />
          <Route path="/sifremi-unuttum" element={
            <div style={{ padding: "100px", textAlign: "center", backgroundColor: "#f8f5ea", minHeight: "100vh" }}>
              Şifre Sıfırlama Sayfası Hazırlanıyor...
            </div>
          } />
        </Routes>
      </AnaLayout>
    </AuthProvider>
  );
}

export default App;