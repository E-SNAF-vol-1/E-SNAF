import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { SepetReducer, initialState } from "./SepetReducer";
import axios from "axios";

const SepetContext = createContext();

export function SepetProvider({ children }) {
    const [state, dispatch] = useReducer(SepetReducer, initialState);

    // Bildirim penceresi için gerekli state tanımlaması
    const [bildirim, setBildirim] = useState({ gorunur: false, mesaj: "", resim: "" });

    // Kullanıcıya işlemin başarılı olduğunu bildiren fonksiyon
    const bildirimiGoster = (urun) => {
        setBildirim({
            gorunur: true,
            mesaj: `${urun.isim || urun.urun_adi || urun.ad} sepete eklendi!`,
            resim: urun.resim
        });

        // Bildirimin 3 saniye sonra ekrandan nazikçe ayrılması sağlanır
        setTimeout(() => {
            setBildirim({ gorunur: false, mesaj: "", resim: "" });
        }, 3000);
    };

    // Sayfa yüklendiğinde mevcut sepet verilerinin getirilmesi
    useEffect(() => {
        const sepetiGetir = async () => {
            try {
                const response = await axios.get("/api/cart");
                if (response.data) {
                    dispatch({ type: "SEPET_YUKLE", payload: response.data });
                }
            } catch (err) {
                console.error("Sepet verileri yerel depolamadan kullanılıyor.", err);
            }
        };
        sepetiGetir();
    }, []);

    // Sepet değişikliklerinin yerel depolama ve veritabanı ile senkronizasyonu
    useEffect(() => {
        const sepetVerisi = state.SepetNesneleri;
        const cerezOnayi = localStorage.getItem("cerezOnayi");
        const token = localStorage.getItem("token");

        if (cerezOnayi === "kabul") {
            localStorage.setItem("sepet", JSON.stringify(sepetVerisi));
        }

        const sepetiKaydet = async () => {
            try {
                await axios.post("/api/cart/save", { sepet: sepetVerisi });
            } catch (err) {
                console.log("Sunucu senkronizasyonu şu an gerçekleştirilemiyor.");
            }
        };

        // Veritabanı kaydı yalnızca oturum açmış kullanıcılar için gerçekleştirilir
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