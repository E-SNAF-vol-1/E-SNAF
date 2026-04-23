import { useState } from "react";
import { useSepet } from "../context/SepetContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; // AuthContext eklendi
import { useNavigate } from "react-router-dom";

export default function SepetOzeti() {
    const navigate = useNavigate();
    const { state } = useSepet();
    const { user } = useAuth(); // Kullanıcı oturum durumu çekiliyor
    const [modalAcik, setModalAcik] = useState(false);
    const urunler = state.SepetNesneleri || [];

    // Toplam fiyat hesaplama
    const toplamFiyat = urunler.reduce((toplam, urun) => {
        return toplam + (Number(urun.fiyat) * Number(urun.miktar || 1));
    }, 0);

    const kargoUcreti = toplamFiyat > 500 ? 0 : 50;
    const genelToplam = toplamFiyat + kargoUcreti;

    // Alışverişi bitirme mantığı
    const odemeSureciniYonet = () => {
        // user objesi varsa veya token mevcutsa doğrudan ödemeye git
        if (user || localStorage.getItem("token")) {
            navigate("/odeme");
        } else {
            // Hiçbir oturum verisi yoksa modalı aç
            setModalAcik(true);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ede6ca] relative">
            <h3 className="text-xl font-bold text-[#4d3a2e] mb-6 font-serif">Sipariş Özeti</h3>

            <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-medium">{toplamFiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span className={kargoUcreti === 0 ? "text-green-600 font-bold" : "font-medium"}>
                        {kargoUcreti === 0 ? "Ücretsiz" : kargoUcreti.toFixed(2) + " TL"}
                    </span>
                </div>

                {kargoUcreti > 0 && (
                    <div className="bg-[#f8f5eb] p-3 rounded-lg border border-dashed border-[#978175]">
                        <p className="text-[11px] text-[#978175] text-center italic">
                            Kargo bedava için <strong>{(500 - toplamFiyat).toFixed(2)} TL</strong> daha ekleyin.
                        </p>
                    </div>
                )}

                <div className="border-t border-[#ede6ca] pt-4 flex justify-between font-bold text-xl text-[#4d3a2e]">
                    <span>Toplam</span>
                    <span>{genelToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                </div>
            </div>

            <button
                onClick={odemeSureciniYonet}
                className="w-full mt-8 py-4 bg-[#4d3a2e] text-[#fdfbf7] rounded-xl font-bold hover:bg-[#3d2e25] transition-all shadow-lg active:scale-95 transform"
            >
                ALIŞVERİŞİ TAMAMLA
            </button>

            {/* Giriş yapmamış kullanıcılar için yol ayrımı modalı */}
            {modalAcik && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
                    <div className="bg-[#fdfbf7] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#ede6ca] animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#f8f5eb] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ede6ca]">
                                <i className='bx bx-shopping-bag text-3xl text-[#4d3a2e]'></i>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-[#4d3a2e] mb-2">Devam Etmeden Önce...</h2>
                            <p className="text-gray-500 text-sm">
                                Siparişinizi takip etmek için giriş yapabilir veya zaman kaybetmeden misafir olarak devam edebilirsiniz.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/giris-yap')}
                                className="w-full bg-[#4d3a2e] text-white py-4 rounded-xl font-bold hover:bg-[#3d2e25] flex items-center justify-center gap-2 transition-all"
                            >
                                <i className='bx bx-log-in text-xl'></i> Giriş Yap / Kayıt Ol
                            </button>

                            <button
                                onClick={() => navigate('/odeme')}
                                className="w-full border-2 border-[#4d3a2e] text-[#4d3a2e] py-4 rounded-xl font-bold hover:bg-[#f8f5eb] transition-all"
                            >
                                Misafir Olarak Devam Et
                            </button>

                            <button
                                onClick={() => setModalAcik(false)}
                                className="mt-2 text-xs text-gray-400 hover:text-[#4d3a2e] underline transition-colors"
                            >
                                Sepete Geri Dön
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}