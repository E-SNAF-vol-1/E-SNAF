import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SepetProvider } from './context/SepetContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SepetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SepetProvider>
  </StrictMode>,
)
