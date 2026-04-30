import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AnaLayout from "./layout/AnaLayout";
import Anasayfa from "./sayfalar/Anasayfa";
import Sepet from "./sayfalar/Sepet";
import DetaySayfa from './sayfalar/DetaySayfa';
import CerezOnayi from './components/CerezOnayi';
import AramaSonuclari from "./sayfalar/AramaSonuclari";
import CerezPolitikasi from "./sayfalar/CerezPolitikasi";
import Odeme from "./sayfalar/Odeme";

// Klasör yapına göre yolları düzelttik (./sayfalar/ altında oldukları görünüyor)
import GirisYap from "./sayfalar/GirisYap";
import KayitOl from "./sayfalar/KayitOl";
import Hesabim from "./sayfalar/Hesabim";
import Iletisim from "./sayfalar/Iletisim";
import SifremiUnuttum from "./sayfalar/SifremiUnuttum";

import { AuthProvider } from "./context/AuthContext";
import TemaSecici from "./components/TemaSecici"; 
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  // --- TEMA UYGULAMA MANTIĞI ---
  useEffect(() => {
    const temaUygula = async () => {
      try {
        const res = await axios.get("https://esnaf.apps.srv.aykutdurgut.com.tr/api/settings");
        const seciliTema = res.data.active_theme;

        const root = document.documentElement;
        root.classList.remove("dark");
        root.removeAttribute("data-theme");

        if (seciliTema === "dark") {
          root.classList.add("dark");
        } else if (seciliTema === "ocean") {
          root.setAttribute("data-theme", "ocean");
        }
      } catch (err) {
        console.error("Tema yüklenirken hata oluştu:", err);
      }
    };
    temaUygula();
  }, []);

  return (
    <AuthProvider>
      <AnaLayout className="App">
        <CerezOnayi />
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
          <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
        </Routes>
      </AnaLayout>
    </AuthProvider>
  );
}

export default App;