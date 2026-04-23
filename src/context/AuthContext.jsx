import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  // Sayfa açılınca mevcut session'ı kontrol et
  useEffect(() => {
    const sessionKontrol = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user || null);
      } catch {
        setUser(null);
      } finally {
        setYukleniyor(false);
      }
    };
    sessionKontrol();
  }, []);

  // Giriş
  const girisYap = async (email, sifre) => {
    const res = await api.post("/auth/login", { email, sifre });
    setUser(res.data.user);
    return res.data;
  };

  // Kayıt - backend kayıttan sonra otomatik session başlatıyor
  const kayitOl = async ({ ad, soyad, email, sifre, telefon }) => {
    const res = await api.post("/auth/register", { ad, soyad, email, sifre, telefon });
    setUser(res.data.user);
    return res.data;
  };

  // Çıkış
  const cikisYap = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, girisYap, kayitOl, cikisYap, yukleniyor, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth yalnızca AuthProvider içinde kullanılabilir");
  return ctx;
};

export { api };
