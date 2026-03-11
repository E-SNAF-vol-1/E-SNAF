import { Routes, Route } from "react-router-dom"
import Baslik from "./components/Baslik"
import Anasayfa from "./sayfalar/Anasayfa"
import Sepet from "./sayfalar/Sepet"

function App() {

  return (
    <>
      <Baslik />
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/sepet" element={<Sepet />} />
      </Routes>
    </>
  )
}

export default App
