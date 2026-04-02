import { Routes, Route } from "react-router-dom";
import AnaLayout from "./layout/AnaLayout";
import Anasayfa from "./sayfalar/Anasayfa";
import Sepet from "./sayfalar/Sepet";
import DetaySayfa from "./sayfalar/DetaySayfa";
import CerezOnayi from './components/CerezOnayi';
import AramaSonuclari from "./sayfalar/AramaSonuclari";
import CerezPolitikasi from "./sayfalar/CerezPolitikasi";
import Odeme from "./sayfalar/Odeme";
import GirisYap from "./components/GirisYap";
import KayitOl from "./components/KayitOl";
import axios from "axios"; //

axios.defaults.withCredentials = true;

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
        <Route path="/odeme" element={<Odeme />} />
        <Route path="/giris-yap" element={<GirisYap />} />
        <Route path="/kayit-ol" element={<KayitOl />} />
        <Route path="/sifremi-unuttum" element={<div style={{ padding: "100px", textAlign: "center", backgroundColor: "#f8f5eb", minHeight: "100vh" }}>Şifre Sıfırlama Sayfası Hazırlanıyor...</div>} />
      </Routes>
    </AnaLayout>
  );
}
export default App;