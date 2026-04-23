import { useState, useMemo, useEffect } from "react";
import { useSepet } from "../context/SepetContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiparisBasarili from "../components/SiparisBasarili.jsx";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
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

    // --- STATE YÖNETİMİ ---
    const [customerData, setCustomerData] = useState({ ad: "", soyad: "", email: "", telefon: "" });
    const [addressData, setAddressData] = useState({ baslik: "", sehir: "", ilce: "", detay: "", postaKodu: "" });
    const [paymentMethod, setPaymentMethod] = useState("kredi_karti");
    const [cardDetails, setCardDetails] = useState({ number: "", holder: "", month: "", year: "", cvv: "" });

    const [hata, setHata] = useState({ gorunur: false, mesaj: "" });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (user) {
            setCustomerData({
                ad: user.ad || "",
                soyad: user.soyad || "",
                email: user.email || "",
                telefon: user.telefon || ""
            });
        }
    }, [user]);

    const years = useMemo(() => Array.from({ length: 11 }, (_, i) => currentYear + i), [currentYear]);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

    const hataGoster = (mesaj) => {
        setHata({ gorunur: true, mesaj });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setHata({ gorunur: false, mesaj: "" }), 4000);
        setIsProcessing(false);
    };

    // --- INPUT FİLTRELERİ (Gerçek zamanlı temizlik) ---
    const handleSadeceHarfGiris = (deger, stateObj, setState, alan) => {
        // Sadece harf ve boşluk bırakılmasına izin verir
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

        // 1. Müşteri Bilgileri Kontrolü
        if (!isimRegex.test(customerData.ad)) return hataGoster("Ad sadece harflerden oluşmalıdır.");
        if (!isimRegex.test(customerData.soyad)) return hataGoster("Soyad sadece harflerden oluşmalıdır.");
        if (!emailRegex.test(customerData.email)) return hataGoster("Geçerli bir e-posta giriniz.");
        if (customerData.telefon.length !== 11) return hataGoster("Telefon 11 haneli olmalıdır.");

        // 2. Adres Bilgileri Kontrolü
        if (!addressData.baslik.trim()) return hataGoster("Lütfen bir adres başlığı giriniz.");
        if (!isimRegex.test(addressData.sehir)) return hataGoster("Şehir adı sadece harflerden oluşmalıdır.");
        if (!isimRegex.test(addressData.ilce)) return hataGoster("İlçe adı sadece harflerden oluşmalıdır.");
        if (!addressData.detay.trim()) return hataGoster("Açık adres detayını doldurunuz.");
        if (!postaKoduRegex.test(addressData.postaKodu)) return hataGoster("Posta kodu 5 haneli bir sayı olmalıdır.");

        // 3. Ödeme Bilgileri Kontrolü
        if (paymentMethod === "kredi_karti") {
            if (!isimRegex.test(cardDetails.holder)) return hataGoster("Kart üzerindeki isim sadece harf içerebilir.");
            if (cardDetails.number.length !== 16) return hataGoster("Kart numarası 16 haneli olmalıdır.");
            if (!cardDetails.month || !cardDetails.year || cardDetails.cvv.length !== 3) return hataGoster("Kart bilgilerini eksiksiz tamamlayın.");
        }

        const siparisPaketi = {
            isGuest: !user && !token,
            customerInfo: customerData,
            addressInfo: addressData,
            odeme_yontemi: paymentMethod === "kredi_karti" ? "KREDİ" : "HAVALE",
            items: state.SepetNesneleri,
            totalPrice: state.SepetNesneleri?.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0) || 0
        };

        try {
            const response = await api.post("/orders", siparisPaketi, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.status === 201 || response.status === 200) {
                setOrderId(response.data.siparis_id);
                setIsSuccess(true);
                dispatch({ type: "SEPETI_SIFIRLA" });
                localStorage.removeItem("sepet");
            }
        } catch (err) {
            hataGoster(err.response?.data?.mesaj || "Sipariş oluşturulamadı.");
        }
    };

    const cartTotal = state.SepetNesneleri?.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0) || 0;
    const inputStyle = "w-full p-3 border border-[#d2b48c] rounded-lg outline-none focus:ring-2 focus:ring-[#4d3a2e] bg-white text-[#4d3a2e]";

    return (
        <div className="p-10 bg-[#fdfbf7] min-h-screen relative">
            {isSuccess && <SiparisBasarili orderId={orderId} navigate={navigate} />}
            {hata.gorunur && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000]">
                    <div className="bg-[#5d4037] text-[#fdfbf7] px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
                        <i className='bx bx-error-circle text-xl'></i>
                        <span className="font-semibold">{hata.mesaj}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <form onSubmit={handleProcessOrder} className="lg:col-span-2 space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-[#ede6ca]">

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-serif font-bold text-[#4d3a2e]">1. Müşteri Bilgileri</h2>
                        </div>
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
                                <input type="text" placeholder="Ev, İş vb." className={inputStyle} value={addressData.baslik} onChange={(e) => setAddressData({ ...addressData, baslik: e.target.value })} />
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
                                    {/* Ay/Yıl/CVV seçimleri öncekiyle aynı kalmıştır... */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#978175] uppercase ml-1">Ay</label>
                                        <select className={inputStyle} onChange={(e) => setCardDetails({ ...cardDetails, month: e.target.value })}>
                                            <option value="">Seç</option>
                                            {months.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#978175] uppercase ml-1">Yıl</label>
                                        <select className={inputStyle} onChange={(e) => setCardDetails({ ...cardDetails, year: e.target.value })}>
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

                <aside className="h-fit sticky top-10">
                    <div className="bg-[#4d3a2e] text-white p-8 rounded-3xl shadow-xl text-center border border-[#5d4a3e]">
                        <h3 className="text-xl font-serif mb-6 border-b border-[#6d5a4e] pb-4 font-bold">Ödeme Tutarı</h3>
                        <div className="text-3xl font-bold mb-8">
                            {(cartTotal > 500 ? cartTotal : cartTotal + 50).toLocaleString()} TL
                        </div>
                        <button onClick={handleProcessOrder} disabled={isProcessing}
                            className={`w-full py-5 rounded-xl font-black transition-all shadow-lg active:scale-95 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-[#fdfbf7] text-[#4d3a2e] hover:bg-white"}`}>
                            {isProcessing ? "İŞLENİYOR..." : "SİPARİŞİ ONAYLA"}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}