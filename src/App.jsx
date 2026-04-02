import { Routes, Route } from "react-router-dom";
import AnaLayout from "./layout/AnaLayout";
import Anasayfa from "./sayfalar/Anasayfa";
import Sepet from "./sayfalar/Sepet";
import DetaySayfa from "./sayfalar/DetaySayfa";
import CerezOnayi from './components/CerezOnayi';
import AramaSonuclari from "./sayfalar/AramaSonuclari";
import CerezPolitikasi from "./sayfalar/CerezPolitikasi";

// SENİN DOSYALARIN (src/components klasöründe oldukları için yollar böyle olmalı)
import GirisYap from "./components/GirisYap"; 
import KayitOl from "./components/KayitOl";

function App() {
  return (
    <AnaLayout className="App">
      <CerezOnayi />
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/arama" element={<AramaSonuclari />} />
        <Route path="/sepet" element={<Sepet />} />
        <Route path="/detay/:id" element={<DetaySayfa />} />
        <Route path="/CerezPolitikasi" element={<CerezPolitikasi />} />
        
        {/* Giriş ve Kayıt Rotaları */}
        <Route path="/giris-yap" element={<GirisYap />} />
        <Route path="/kayit-ol" element={<KayitOl />} />
        <Route path="/sifremi-unuttum" element={<div style={{padding:"100px", textAlign:"center", backgroundColor:"#f8f5eb", minHeight:"100vh"}}>Şifre Sıfırlama Sayfası Hazırlanıyor...</div>} />
      </Routes>
    </AnaLayout>
  );
}
export default App;