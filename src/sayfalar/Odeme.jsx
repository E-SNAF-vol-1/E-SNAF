import { useState, useMemo, useEffect } from "react";
import { useSepet } from "../context/SepetContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiparisBasarili from "../components/SiparisBasarili.jsx";
import SepetOzetiOdeme from "../components/SepetOzetiOdeme.jsx";

const api = axios.create({
    baseURL: "https://esnaf.apps.srv.aykutdurgut.com.tr/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

export default function Odeme() {
    const { state, dispatch } = useSepet();
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const now = new Date();
    const currentYear = now.getFullYear();

    const [customerData, setCustomerData] = useState({ ad: "", soyad: "", email: "", telefon: "" });
    const [addressData, setAddressData] = useState({ baslik: "", sehir: "", ilce: "", detay: "", postaKodu: "" });
    const [paymentMethod, setPaymentMethod] = useState("kredi_karti");
    const [cardDetails, setCardDetails] = useState({ number: "", holder: "", month: "", year: "", cvv: "" });

    const [hata, setHata] = useState({ gorunur: false, mesaj: "" });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [guestOrderPdfData, setGuestOrderPdfData] = useState(null);

    useEffect(() => {
        if (user) {
            setCustomerData({
                ad: user.ad || "",
                soyad: user.soyad || "",
                email: user.email || "",
                telefon: user.telefon || ""
            });

            const adresleriGetir = async () => {
                try {
                    const res = await api.get("/addresses", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data && res.data.length > 0) {
                        const ilkAdres = res.data[0];
                        setAddressData({
                            baslik: ilkAdres.baslik || "",
                            sehir: ilkAdres.sehir || "",
                            ilce: ilkAdres.ilce || "",
                            detay: ilkAdres.detay || "",
                            postaKodu: (ilkAdres.posta_kodu || ilkAdres.postaKodu || "").toString()
                        });
                    }
                } catch (err) {
                    console.log("Kayıtlı adresler getirilemedi.");
                }
            };
            if (token) adresleriGetir();
        }
    }, [user, token]);

    const years = useMemo(() => Array.from({ length: 11 }, (_, i) => currentYear + i), [currentYear]);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

    const hataGoster = (mesaj) => {
        setHata({ gorunur: true, mesaj });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setHata({ gorunur: false, mesaj: "" }), 4000);
        setIsProcessing(false);
    };

    const handleSadeceHarfGiris = (deger, stateObj, setState, alan) => {
        const temizVeri = deger.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, "");
        setState({ ...stateObj, [alan]: temizVeri });
    };

    const handleTelefonGiris = (deger) => {
        let temizVeri = deger.replace(/\D/g, "");
        if (temizVeri.length > 0 && temizVeri[0] !== "0") temizVeri = "0" + temizVeri;
        setCustomerData({ ...customerData, telefon: temizVeri.slice(0, 11) });
    };

    const handlePostaKoduGiris = (deger) => {
        const temizVeri = deger.replace(/\D/g, "").slice(0, 5);
        setAddressData({ ...addressData, postaKodu: temizVeri });
    };

    const handleProcessOrder = async (e) => {
        if (e) e.preventDefault();
        if (isProcessing) return;
        setIsProcessing(true);

        const isimRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{2,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const postaKoduRegex = /^[0-9]{5}$/;

        if (!isimRegex.test(customerData.ad)) return hataGoster("Ad hatalı.");
        if (!isimRegex.test(customerData.soyad)) return hataGoster("Soyad hatalı.");
        if (!emailRegex.test(customerData.email)) return hataGoster("E-posta hatalı.");
        if (customerData.telefon.length !== 11) return hataGoster("Telefon hatalı.");
        if (!addressData.baslik.trim()) return hataGoster("Adres başlığı eksik.");
        if (!isimRegex.test(addressData.sehir)) return hataGoster("Şehir hatalı.");
        if (!isimRegex.test(addressData.ilce)) return hataGoster("İlçe hatalı.");
        if (!addressData.detay.trim()) return hataGoster("Adres detayı eksik.");
        if (!postaKoduRegex.test(addressData.postaKodu)) return hataGoster("Posta kodu hatalı.");

        if (paymentMethod === "kredi_karti") {
            if (!isimRegex.test(cardDetails.holder)) return hataGoster("Kart ismi hatalı.");
            if (cardDetails.number.length !== 16) return hataGoster("Kart numarası hatalı.");
            if (!cardDetails.month || !cardDetails.year || cardDetails.cvv.length !== 3) {
                return hataGoster("Kart bilgileri eksik.");
            }
        }

        // Backend ile tam uyumlu temiz ürün listesi
        const sepetUrunleri = (state.SepetNesneleri || []).map((item) => ({
            urun_id: item.id || item.urun_id,
            fiyat: Number(item.fiyat || 0),
            miktar: Number(item.miktar || item.adet || 1),
            urun_adi: item.ad || item.isim || "Ürün"
        }));

        const toplamTutar = sepetUrunleri.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0);

        const siparisPaketi = {
            isGuest: !user && !token,
            customerInfo: customerData,
            addressInfo: addressData,
            odeme_yontemi: paymentMethod === "kredi_karti" ? "KREDİ" : "HAVALE",
            items: sepetUrunleri,
            totalPrice: toplamTutar
        };

        try {
            const response = await api.post("/orders", siparisPaketi, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.status === 201 || response.status === 200) {
                const yeniSiparisId = response.data.siparis_id;
                setOrderId(yeniSiparisId);

                setGuestOrderPdfData({
                    siparis: {
                        id: yeniSiparisId,
                        siparis_tarihi: new Date().toISOString(),
                        durum: "Hazırlanıyor",
                        toplam_tutar: toplamTutar,
                        odeme_yontemi: paymentMethod === "kredi_karti" ? "KREDİ KARTI" : "HAVALE / EFT"
                    },
                    musteri: { ...customerData },
                    adres: { ...addressData },
                    urunler: sepetUrunleri
                });

                setIsSuccess(true);
                dispatch({ type: "SEPETI_SIFIRLA" });
                localStorage.removeItem("sepet");
            }
        } catch (err) {
            hataGoster(err.response?.data?.mesaj || "Sipariş oluşturulamadı.");
        } finally {
            setIsProcessing(false);
        }
    };

    const cartTotal = state.SepetNesneleri?.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0) || 0;
    const inputStyle = "w-full p-3 border border-[#d2b48c] rounded-lg outline-none focus:ring-2 focus:ring-[#4d3a2e] bg-white text-[#4d3a2e]";

    return (
        <div className="p-10 bg-[#fdfbf7] min-h-screen relative">
            {isSuccess && (
                <SiparisBasarili
                    orderId={orderId}
                    navigate={navigate}
                    orderPdfData={guestOrderPdfData}
                />
            )}

            {hata.gorunur && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000]">
                    <div className="bg-[#5d4037] text-[#fdfbf7] px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
                        <i className="bx bx-error-circle text-xl"></i>
                        <span className="font-semibold">{hata.mesaj}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <form onSubmit={handleProcessOrder} className="lg:col-span-2 space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-[#ede6ca]">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-[#4d3a2e]">1. Müşteri Bilgileri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">Ad</label>
                                <input type="text" className={inputStyle} value={customerData.ad} onChange={(e) => handleSadeceHarfGiris(e.target.value, customerData, setCustomerData, "ad")} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">Soyad</label>
                                <input type="text" className={inputStyle} value={customerData.soyad} onChange={(e) => handleSadeceHarfGiris(e.target.value, customerData, setCustomerData, "soyad")} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">E-Posta</label>
                                <input type="email" className={inputStyle} value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">Telefon</label>
                                <input type="tel" value={customerData.telefon} className={inputStyle} onChange={(e) => handleTelefonGiris(e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <section className="pt-8 border-t border-gray-100 space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-[#4d3a2e]">2. Teslimat Adresi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">Adres Başlığı</label>
                                <input type="text" className={inputStyle} value={addressData.baslik} onChange={(e) => setAddressData({ ...addressData, baslik: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">Posta Kodu</label>
                                <input type="text" value={addressData.postaKodu} className={inputStyle} onChange={(e) => handlePostaKoduGiris(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">Şehir</label>
                                <input type="text" className={inputStyle} value={addressData.sehir} onChange={(e) => handleSadeceHarfGiris(e.target.value, addressData, setAddressData, "sehir")} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#978175] uppercase ml-1">İlçe</label>
                                <input type="text" className={inputStyle} value={addressData.ilce} onChange={(e) => handleSadeceHarfGiris(e.target.value, addressData, setAddressData, "ilce")} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#978175] uppercase ml-1">Açık Adres</label>
                            <textarea className={`${inputStyle} h-24 resize-none`} value={addressData.detay} onChange={(e) => setAddressData({ ...addressData, detay: e.target.value })} />
                        </div>
                    </section>

                    <section className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-[#4d3a2e] mb-6">3. Ödeme Yöntemi</h2>
                        <div className="flex gap-4 mb-8">
                            {["kredi_karti", "havale"].map((method) => (
                                <button key={method} type="button" onClick={() => setPaymentMethod(method)}
                                    className={`flex-1 py-4 border-2 rounded-xl font-bold transition-all ${paymentMethod === method ? "border-[#4d3a2e] bg-[#fdfbf7] text-[#4d3a2e]" : "border-gray-100 text-gray-400"}`}>
                                    {method === "kredi_karti" ? "KREDİ KARTI" : "HAVALE / EFT"}
                                </button>
                            ))}
                        </div>

                        {paymentMethod === "kredi_karti" && (
                            <div className="bg-gray-50 p-6 rounded-2xl space-y-5 border border-[#ede6ca]">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">Kart Sahibi</label>
                                    <input type="text" className={`${inputStyle} uppercase`} value={cardDetails.holder}
                                        onChange={(e) => handleSadeceHarfGiris(e.target.value, cardDetails, setCardDetails, "holder")} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">Kart Numarası</label>
                                    <input type="text" value={cardDetails.number} className={inputStyle}
                                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} />
                                </div>
                                <div className="grid grid-cols-3 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#978175] uppercase ml-1">Ay</label>
                                        <select className={inputStyle} value={cardDetails.month} onChange={(e) => setCardDetails({ ...cardDetails, month: e.target.value })}>
                                            <option value="">Seç</option>
                                            {months.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#978175] uppercase ml-1">Yıl</label>
                                        <select className={inputStyle} value={cardDetails.year} onChange={(e) => setCardDetails({ ...cardDetails, year: e.target.value })}>
                                            <option value="">Seç</option>
                                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#978175] uppercase ml-1">CVV</label>
                                        <input type="text" value={cardDetails.cvv} className={inputStyle}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </form>

                <SepetOzetiOdeme
                    cartTotal={cartTotal}
                    isProcessing={isProcessing}
                    onConfirm={handleProcessOrder}
                />
            </div>
        </div>
    );
}