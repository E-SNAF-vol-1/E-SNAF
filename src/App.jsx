import { Routes, Route } from "react-router-dom";
import Baslik from "./components/Baslik";
import Anasayfa from "./sayfalar/Anasayfa";
// Eğer sepet sayfan varsa buraya import etmelisin, örn:
// import Sepet from "./sayfalar/Sepet";

function App() {
  return (
    <>
      {/* Her sayfada görünen üst kısım */}
      <Baslik />

      <main>
        <Routes>
          {/* Ana Sayfa */}
          <Route path="/" element={<Anasayfa />} />

          {/* Arama Sonuçları Sayfası */}
          {/* Şu anlık test amaçlı bir div döner, daha sonra buraya AramaSayfasi bileşeni gelecek */}
          <Route
            path="/arama"
            element={
              <div className="p-20 text-center text-[#5d4037]">
                <h2 className="text-2xl font-bold">Arama Sayfası</h2>
                <p className="mt-4 text-gray-500">
                  Sonuçlar çok yakında burada listelenecek kanks!
                </p>
              </div>
            }
          />

          {/* Sepet Sayfası (Arkadaşın yaptıysa yolu buraya ekle) */}
          {/* <Route path="/sepet" element={<Sepet />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
