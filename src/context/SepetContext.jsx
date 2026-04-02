import { createContext, useContext, useReducer, useEffect } from "react";
import { SepetReducer, initialState } from "./SepetReducer";
import axios from "axios"; // API istekleri için

const SepetContext = createContext();

export function SepetProvider({ children }) {
    const [state, dispatch] = useReducer(SepetReducer, initialState);

    // 1. Sayfa yüklendiğinde sepeti VT'den çek (Eğer kullanıcı giriş yapmışsa)
    useEffect(() => {
        const sepetiGetir = async () => {
            try {
                const response = await axios.get("/api/cart"); // cartRoutes.js üzerindeki router.get("/")
                if (response.data) {
                    dispatch({ type: "SEPET_YUKLE", payload: response.data });
                }
            } catch (err) {
                console.error("Sepet Veritabanından alınamadı, yerel veriye dönülüyor", err);
            }
        };
        sepetiGetir();
    }, []);

    // 2. Sepet her değiştiğinde hem LocalStorage hem VT'ye kaydet
    useEffect(() => {
        const sepetVerisi = state.SepetNesneleri;

        // LocalStorage Kaydı
        const cerezOnayi = localStorage.getItem("cerezOnayi");
        if (cerezOnayi === "kabul") {
            localStorage.setItem("sepet", JSON.stringify(sepetVerisi));
        }

        // Veri Tabanı Kaydı (API üzerinden saveCart kontrolcüsüne)
        const sepetiKaydet = async () => {
            try {
                await axios.post("/api/cart/save", { sepet: sepetVerisi });
            } catch (err) {
                console.log("Sepet Veritabanına yedeklenemedi");
            }
        };

        if (sepetVerisi.length > 0) {
            sepetiKaydet();
        }
    }, [state.SepetNesneleri]);

    return (
        <SepetContext.Provider value={{ state, dispatch }}>
            {children}
        </SepetContext.Provider>
    );
}

export function useSepet() {
    return useContext(SepetContext);
}