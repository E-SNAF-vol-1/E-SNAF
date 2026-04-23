import { useState, useMemo } from "react";
import { useSepet } from "../context/SepetContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiparisBasarili from "../components/SiparisBasarili.jsx";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" }
});

export default function Odeme() {
    const { state, dispatch } = useSepet();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // --- STATE YÖNETİMİ ---
    const [customerData, setCustomerData] = useState({ ad: "", soyad: "", email: "", telefon: "" });
    const [addressData, setAddressData] = useState({ baslik: "", sehir: "", ilce: "", detay: "", postaKodu: "" });
    const [paymentMethod, setPaymentMethod] = useState("kredi_karti");
    const [cardDetails, setCardDetails] = useState({ number: "", holder: "", month: "", year: "", cvv: "" });

    // UI Durumları
    const [hata, setHata] = useState({ gorunur: false, mesaj: "" });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState("");

    const years = useMemo(() => Array.from({ length: 11 }, (_, i) => currentYear + i), [currentYear]);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

    // --- YARDIMCI FONKSİYONLAR & INPUT KONTROLLERİ ---
    const hataGoster = (mesaj) => {
        setHata({ gorunur: true, mesaj });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setHata({ gorunur: false, mesaj: "" }), 4000);
        setIsProcessing(false);
    };

    // Sadece Harf Girişi (İsim & Soyisim)
    const handleIsimGiris = (deger, alan) => {
        const temizVeri = deger.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, "");
        setCustomerData({ ...customerData, [alan]: temizVeri });
    };

    // Telefon Formatı (05XX...)
    const handleTelefonGiris = (deger) => {
        let temizVeri = deger.replace(/\D/g, "");
        if (temizVeri.length > 0 && temizVeri[0] !== "0") temizVeri = "0" + temizVeri;
        setCustomerData({ ...customerData, telefon: temizVeri.slice(0, 11) });
    };

    // Posta Kodu (Sadece 5 Rakam)
    const handlePostaKoduGiris = (deger) => {
        const temizVeri = deger.replace(/\D/g, "").slice(0, 5);
        setAddressData({ ...addressData, postaKodu: temizVeri });
    };

    // --- ANA İŞLEM: SİPARİŞİ ONAYLA ---
    const handleProcessOrder = async (e) => {
        if (e) e.preventDefault();
        if (isProcessing) return;
        setIsProcessing(true);

        // REGEX MUHAFIZLARI
        const isimRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{2,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const postaKoduRegex = /^[0-9]{5}$/;

        // 1. İletişim Kontrolü (Giriş Yapmamışsa)
        if (!token) {
            if (!isimRegex.test(customerData.ad)) return hataGoster("Geçerli bir ad giriniz (Sadece harf).");
            if (!isimRegex.test(customerData.soyad)) return hataGoster("Geçerli bir soyad giriniz (Sadece harf).");
            if (!emailRegex.test(customerData.email)) return hataGoster("Geçerli bir e-posta adresi giriniz.");
            if (customerData.telefon.length !== 11) return hataGoster("Telefon 11 haneli olmalıdır.");
        }

        // 2. Adres Kontrolü
        if (!addressData.baslik.trim() || !addressData.sehir.trim() || !addressData.detay.trim()) {
            return hataGoster("Adres bilgilerini eksiksiz doldurunuz.");
        }
        if (!postaKoduRegex.test(addressData.postaKodu)) {
            return hataGoster("Posta kodu 5 haneli rakam olmalıdır.");
        }

        // 3. Ödeme Kontrolü
        if (paymentMethod === "kredi_karti") {
            if (cardDetails.number.length !== 16) return hataGoster("Kart numarası 16 haneli olmalıdır.");
            if (!cardDetails.month || !cardDetails.year || cardDetails.cvv.length !== 3) return hataGoster("Kart bilgilerini eksiksiz giriniz.");
            const isExpired = parseInt(cardDetails.year) === currentYear && parseInt(cardDetails.month) < currentMonth;
            if (isExpired) return hataGoster("Kartınızın son kullanma tarihi geçmiş.");
        }

        // GÖNDERİLECEK PAKET
        const siparisPaketi = {
            isGuest: !token,
            customerInfo: token ? null : customerData,
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
            hataGoster(err.response?.data?.mesaj || "Sunucuyla bağlantı kurulamadı.");
        }
    };

    const cartTotal = state.SepetNesneleri?.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0) || 0;
    const inputStyle = "w-full p-3 border border-[#d2b48c] rounded-lg outline-none focus:ring-2 focus:ring-[#4d3a2e] transition-all bg-white text-[#4d3a2e]";

    return (
        <div className="p-10 bg-[#fdfbf7] min-h-screen relative">
            {isSuccess && <SiparisBasarili orderId={orderId} navigate={navigate} />}

            {/* Hata Bildirimi */}
            {hata.gorunur && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] animate-in slide-in-from-top duration-300">
                    <div className="bg-[#5d4037] text-[#fdfbf7] px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-[#d2b48c]">
                        <i className='bx bx-error-circle text-xl'></i>
                        <span className="font-semibold">{hata.mesaj}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <form onSubmit={handleProcessOrder} className="lg:col-span-2 space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-[#ede6ca]">

                    {/* 1. İletişim Bilgileri */}
                    {!token && (
                        <section className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-[#4d3a2e]">1. İletişim Bilgileri</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">Ad</label>
                                    <input type="text" placeholder="Adınız" className={inputStyle} value={customerData.ad}
                                        onChange={(e) => handleIsimGiris(e.target.value, "ad")} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">Soyad</label>
                                    <input type="text" placeholder="Soyadınız" className={inputStyle} value={customerData.soyad}
                                        onChange={(e) => handleIsimGiris(e.target.value, "soyad")} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">E-Posta</label>
                                    <input type="email" placeholder="ornek@mail.com" className={inputStyle}
                                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">Telefon</label>
                                    <input type="tel" value={customerData.telefon} placeholder="05XX XXX XX XX" className={inputStyle}
                                        onChange={(e) => handleTelefonGiris(e.target.value)} />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 2. Teslimat Adresi */}
                    <section className="pt-8 border-t border-gray-100 space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-[#4d3a2e]">2. Teslimat Adresi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1"><label className="text-xs font-bold text-[#978175] uppercase ml-1">Adres Başlığı</label>
                                <input type="text" placeholder="Ev, İş vb." className={inputStyle} onChange={(e) => setAddressData({ ...addressData, baslik: e.target.value })} />
                            </div>
                            <div className="space-y-1"><label className="text-xs font-bold text-[#978175] uppercase ml-1">Posta Kodu</label>
                                <input type="text" value={addressData.postaKodu} placeholder="34XXX" className={inputStyle}
                                    onChange={(e) => handlePostaKoduGiris(e.target.value)} />
                            </div>
                            <div className="space-y-1"><label className="text-xs font-bold text-[#978175] uppercase ml-1">Şehir</label>
                                <input type="text" placeholder="Şehir" className={inputStyle} onChange={(e) => setAddressData({ ...addressData, sehir: e.target.value })} />
                            </div>
                            <div className="space-y-1"><label className="text-xs font-bold text-[#978175] uppercase ml-1">İlçe</label>
                                <input type="text" placeholder="İlçe" className={inputStyle} onChange={(e) => setAddressData({ ...addressData, ilce: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#978175] uppercase ml-1">Açık Adres</label>
                            <textarea placeholder="Mahalle, Sokak detayları..." className={`${inputStyle} h-24 resize-none`}
                                onChange={(e) => setAddressData({ ...addressData, detay: e.target.value })} />
                        </div>
                    </section>

                    {/* 3. Ödeme Yöntemi */}
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
                                    <input type="text" placeholder="İSİM SOYİSİM" className={`${inputStyle} uppercase`}
                                        onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, "") })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#978175] uppercase ml-1">Kart Numarası</label>
                                    <input type="text" value={cardDetails.number} placeholder="16 Haneli No" className={inputStyle}
                                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} />
                                </div>
                                <div className="grid grid-cols-3 gap-5">
                                    <select className={inputStyle} onChange={(e) => setCardDetails({ ...cardDetails, month: e.target.value })}>
                                        <option value="">Ay</option>
                                        {months.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                                    </select>
                                    <select className={inputStyle} onChange={(e) => setCardDetails({ ...cardDetails, year: e.target.value })}>
                                        <option value="">Yıl</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <input type="text" value={cardDetails.cvv} placeholder="CVV" className={inputStyle}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                                </div>
                            </div>
                        )}
                    </section>
                </form>

                {/* Özet ve Onay */}
                <aside className="h-fit sticky top-10">
                    <div className="bg-[#4d3a2e] text-white p-8 rounded-3xl shadow-xl text-center border border-[#5d4a3e]">
                        <h3 className="text-xl font-serif mb-6 border-b border-[#6d5a4e] pb-4 font-bold">Ödeme Tutarı</h3>
                        <div className="text-3xl font-bold mb-8">
                            {(cartTotal > 500 ? cartTotal : cartTotal + 50).toLocaleString()} TL
                        </div>
                        <button
                            onClick={handleProcessOrder}
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-xl font-black transition-all shadow-lg active:scale-95 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-[#fdfbf7] text-[#4d3a2e] hover:bg-white"}`}
                        >
                            {isProcessing ? "İŞLENİYOR..." : "SİPARİŞİ ONAYLA"}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}