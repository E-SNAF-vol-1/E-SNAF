import { Routes, Route } from "react-router-dom";
import AnaLayout from "./layout/AnaLayout";
import Anasayfa from "./sayfalar/Anasayfa";
import Sepet from "./sayfalar/Sepet"
import DetaySayfa from "./sayfalar/DetaySayfa"
import CerezOnayi from './components/CerezOnayi';
import AramaSonuclari from "./sayfalar/AramaSonuclari";
import CerezPolitikasi from "./sayfalar/CerezPolitikasi";

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
      </Routes>
    </AnaLayout>
  );
}

export default App;
