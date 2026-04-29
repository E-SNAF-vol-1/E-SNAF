import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { SepetReducer, initialState } from "./SepetReducer";
import axios from "axios";

// 1. Merkezi Axios Yapılandırması
const api = axios.create({
    baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

const SepetContext = createContext();

export function SepetProvider({ children }) {
    const [state, dispatch] = useReducer(SepetReducer, initialState);
    const [bildirim, setBildirim] = useState({ gorunur: false, mesaj: "", resim: "" });

    // Kullanıcıya işlemin başarılı olduğunu bildiren fonksiyon
    const bildirimiGoster = (urun) => {
        setBildirim({
            gorunur: true,
            mesaj: `${urun.isim || urun.urun_adi || urun.ad} sepete eklendi!`,
            resim: urun.resim
        });

        setTimeout(() => {
            setBildirim({ gorunur: false, mesaj: "", resim: "" });
        }, 3000);
    };

    // Sayfa yüklendiğinde mevcut sepet verilerinin getirilmesi
    useEffect(() => {
        const sepetiGetir = async () => {
            const token = localStorage.getItem("token");

            // Eğer kullanıcı giriş yapmışsa verileri sunucudan çek
            if (token) {
                try {
                    const response = await api.get("/cart", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data) {
                        dispatch({ type: "SEPET_YUKLE", payload: response.data });
                        return; // Sunucudan geldiyse yereli kontrol etmeye gerek yok
                    }
                } catch (err) {
                    console.error("Sepet sunucudan alınamadı, yerel depolama devrede.");
                }
            }

            // Misafir veya sunucu hatası durumunda yerel depolamayı kontrol et
            const yerelSepet = localStorage.getItem("sepet");
            if (yerelSepet) {
                dispatch({ type: "SEPET_YUKLE", payload: JSON.parse(yerelSepet) });
            }
        };
        sepetiGetir();
    }, []);

    // Sepet değişikliklerinin yerel depolama ve veritabanı ile senkronizasyonu
    useEffect(() => {
        const sepetVerisi = state.SepetNesneleri;
        const cerezOnayi = localStorage.getItem("cerezOnayi");
        const token = localStorage.getItem("token");

        // 1. Cihaz değişse de aynı kalsın (Giriş yapanlar için) veya Misafir için yerel kayıt
        if (cerezOnayi === "kabul") {
            localStorage.setItem("sepet", JSON.stringify(sepetVerisi));
        }

        // 2. Sunucu Senkronizasyonu (Sadece Giriş Yapmış Kullanıcılar İçin)
        const sepetiKaydet = async () => {
            try {
                await api.post("/cart/save", { sepet: sepetVerisi }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.log("Sunucu senkronizasyonu şu an gerçekleştirilemiyor.");
            }
        };

        if (sepetVerisi.length > 0 && token) {
            sepetiKaydet();
        }
    }, [state.SepetNesneleri]);

    return (
        <SepetContext.Provider value={{ state, dispatch, bildirim, bildirimiGoster }}>
            {children}

            {/* Bildirim Penceresi Arayüzü */}
            {bildirim.gorunur && (
                <div className="fixed top-24 right-5 z-[9999] animate-bounce-in">
                    <div className="bg-white border-l-4 border-[#5d4037] shadow-2xl rounded-xl p-4 flex items-center gap-4 min-w-[300px]">
                        <img
                            src={bildirim.resim || "/images/bos.jpg"}
                            className="w-12 h-12 object-contain bg-[#f8f5eb] rounded-lg"
                            alt="Ürün"
                        />
                        <div>
                            <p className="text-[#5d4037] font-bold text-sm">İşlem Başarılı</p>
                            <p className="text-gray-600 text-xs">{bildirim.mesaj}</p>
                        </div>
                        <button
                            onClick={() => setBildirim({ ...bildirim, gorunur: false })}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                            <i className="bx bx-x text-xl"></i>
                        </button>
                    </div>
                </div>
            )}
        </SepetContext.Provider>
    );
}

export function useSepet() {
    return useContext(SepetContext);
}