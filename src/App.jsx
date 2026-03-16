import { Routes, Route } from "react-router-dom"
import Anasayfa from "./sayfalar/Anasayfa"
import AnaLayout from "./layout/AnaLayout"

function App() {

  return (
    <AnaLayout classname="App">
      <Routes>
        <Route path="/" element={<Anasayfa />} />
      </Routes>
    </AnaLayout>
  )
}

export default App
