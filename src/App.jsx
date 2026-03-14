import { Routes, Route } from "react-router-dom"
import Anasayfa from "./sayfalar/Anasayfa"
import Sepet from "./sayfalar/Sepet"
import AnaLayout from "./layout/AnaLayout"

function App() {

  return (
    <AnaLayout classname="App">
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/sepet" element={<Sepet />} />
      </Routes>
    </AnaLayout>
  )
}

export default App
