import { useState } from "react";
import { useSepet } from "../context/SepetContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function SepetOzeti() {
    const navigate = useNavigate();
    const { state } = useSepet();
    const { user } = useAuth();
    const [modalAcik, setModalAcik] = useState(false);
    const urunler = state.SepetNesneleri || [];

    const toplamFiyat = urunler.reduce((toplam, urun) => {
        return toplam + (Number(urun.fiyat) * Number(urun.miktar || 1));
    }, 0);

    const kargoUcreti = toplamFiyat > 500 ? 0 : 50;
    const genelToplam = toplamFiyat + kargoUcreti;

    const odemeSureciniYonet = () => {
        if (user || localStorage.getItem("token")) {
            navigate("/odeme");
        } else {
            setModalAcik(true);
        }
    };

    return (
        <div className="bg-brand-card p-6 rounded-[2rem] shadow-xl border border-brand-text/5 relative transition-all duration-500">
            <h3 className="text-xl font-black text-brand-text mb-6 uppercase tracking-tight">Sipariş Özeti</h3>

            <div className="space-y-4">
                <div className="flex justify-between text-brand-text/70 text-sm">
                    <span>Ara Toplam</span>
                    <span className="font-semibold text-brand-text">{toplamFiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                </div>

                <div className="flex justify-between text-brand-text/70 text-sm">
                    <span>Kargo</span>
                    <span className={kargoUcreti === 0 ? "text-green-500 font-bold" : "font-medium text-brand-text"}>
                        {kargoUcreti === 0 ? "Ücretsiz" : kargoUcreti.toFixed(2) + " TL"}
                    </span>
                </div>

                {kargoUcreti > 0 && (
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-dashed border-brand-accent/30">
                        <p className="text-[11px] text-brand-accent text-center italic">
                            Kargo bedava için <strong>{(500 - toplamFiyat).toFixed(2)} TL</strong> daha ekleyin.
                        </p>
                    </div>
                )}

                <div className="border-t border-brand-text/10 pt-4 flex justify-between items-baseline">
                    <span className="text-lg font-bold text-brand-text">Toplam</span>
                    <span className="text-2xl font-black text-brand-accent italic font-serif">
                        {genelToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-sm font-sans not-italic">TL</span>
                    </span>
                </div>
            </div>

            <button
                onClick={odemeSureciniYonet}
                className="w-full mt-8 py-4 bg-brand-accent text-brand-bg font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
            >
                ALIŞVERİŞİ TAMAMLA
            </button>

            {/* Giriş yapmamış kullanıcılar için yol ayrımı modalı */}
            {modalAcik && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
                    <div className="bg-brand-card rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl border border-brand-text/10 animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-accent/20 shadow-inner">
                                <i className='bx bx-shopping-bag text-4xl text-brand-accent'></i>
                            </div>
                            <h2 className="text-2xl font-black text-brand-text mb-3 uppercase tracking-tighter italic font-serif">Devam Etmeden Önce...</h2>
                            <p className="text-brand-text/60 text-sm leading-relaxed">
                                Siparişinizi takip etmek için giriş yapabilir veya zaman kaybetmeden misafir olarak devam edebilirsiniz.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/giris-yap')}
                                className="w-full bg-brand-accent text-brand-bg py-4 rounded-xl font-black hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-lg"
                            >
                                <i className='bx bx-log-in text-xl'></i> GİRİŞ YAP / KAYIT OL
                            </button>

                            <button
                                onClick={() => navigate('/odeme')}
                                className="w-full border-2 border-brand-accent text-brand-accent py-4 rounded-xl font-black hover:bg-brand-accent hover:text-brand-bg transition-all"
                            >
                                MİSAFİR OLARAK DEVAM ET
                            </button>

                            <button
                                onClick={() => setModalAcik(false)}
                                className="mt-2 text-xs text-brand-text/40 hover:text-brand-accent underline decoration-brand-accent/30 underline-offset-4 transition-colors"
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