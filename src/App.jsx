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
import TemaSecici from "./components/TemaSecici"; // ← YENİ: Temayı kontrol eden butonlar
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <AnaLayout className="App">
        <CerezOnayi />
        <TemaSecici /> {/* ← YENİ: Ekranın sağ altında sabit duracak */}
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
            /* Bu inline stil yerine Tailwind sınıfları kullanabiliriz:
               className="p-[100px] text-center bg-brand-bg min-h-screen text-brand-text"
            */
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