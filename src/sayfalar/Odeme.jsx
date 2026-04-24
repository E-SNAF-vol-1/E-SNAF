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

    // --- STATE YÖNETİMİ ---
    const [customerData, setCustomerData] = useState({ ad: "", soyad: "", email: "", telefon: "" });
    const [addressData, setAddressData] = useState({ baslik: "", sehir: "", ilce: "", detay: "", postaKodu: "" });
    const [paymentMethod, setPaymentMethod] = useState("kredi_karti");
    const [cardDetails, setCardDetails] = useState({ number: "", holder: "", month: "", year: "", cvv: "" });
    const [orderNotes, setOrderNotes] = useState(""); // Notlar state'i eklendi

    const [hata, setHata] = useState({ gorunur: false, mesaj: "" });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [guestOrderPdfData, setGuestOrderPdfData] = useState(null);

    // --- OTOMATİK DOLDURMA ---
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
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    if (res.data && res.data.length > 0) {
                        const ilkAdres = res.data[0];
                        setAddressData({
                            baslik: ilkAdres.baslik || "",
                            sehir: ilkAdres.sehir || "",
                            ilce: ilkAdres.ilce || "",
                            detay: ilkAdres.detay || ilkAdres.tam_adres || "",
                            postaKodu: (ilkAdres.posta_kodu || "").toString()
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

    // --- INPUT FİLTRELERİ ---
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

    // --- SİPARİŞ İŞLEME ---
    const handleProcessOrder = async (e) => {
        if (e) e.preventDefault();
        if (isProcessing) return;
        setIsProcessing(true);

        // Validasyonlar
        const isimRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{2,50}$/;
        if (!isimRegex.test(customerData.ad)) return hataGoster("Ad hatalı.");
        if (!isimRegex.test(customerData.soyad)) return hataGoster("Soyad hatalı.");
        if (customerData.telefon.length !== 11) return hataGoster("Telefon 11 haneli olmalıdır.");
        if (!addressData.sehir || !addressData.ilce || !addressData.detay) return hataGoster("Adres bilgileri eksik.");

        // Backend ile tam uyumlu ürün listesi
        const sepetUrunleri = (state.SepetNesneleri || []).map((item) => ({
            urun_id: item.id || item.urun_id,
            fiyat: Number(item.fiyat || 0),
            miktar: Number(item.miktar || item.adet || 1),
            urun_adi: item.ad || item.isim || "Ürün"
        }));

        const toplamTutar = sepetUrunleri.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0);

        const siparisPaketi = {
            isGuest: !user,
            customerInfo: customerData,
            addressInfo: addressData,
            odeme_yontemi: paymentMethod === "kredi_karti" ? "KREDİ" : "HAVALE",
            items: sepetUrunleri,
            totalPrice: toplamTutar,
            notlar: orderNotes // Yeni sütun gönderiliyor
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
                        odeme_yontemi: siparisPaketi.odeme_yontemi
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
        <div className="p-10 bg-[#fdfbf7] min-h-screen relative text-[#4d3a2e]">
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

                    {/* 1. Müşteri Bilgileri */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold">1. Müşteri Bilgileri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input type="text" placeholder="Ad" className={inputStyle} value={customerData.ad} onChange={(e) => handleSadeceHarfGiris(e.target.value, customerData, setCustomerData, "ad")} />
                            <input type="text" placeholder="Soyad" className={inputStyle} value={customerData.soyad} onChange={(e) => handleSadeceHarfGiris(e.target.value, customerData, setCustomerData, "soyad")} />
                            <input type="email" placeholder="E-Posta" className={inputStyle} value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} />
                            <input type="tel" placeholder="Telefon (05xx...)" value={customerData.telefon} className={inputStyle} onChange={(e) => handleTelefonGiris(e.target.value)} />
                        </div>
                    </section>

                    {/* 2. Teslimat Adresi */}
                    <section className="pt-8 border-t border-gray-100 space-y-6">
                        <h2 className="text-2xl font-serif font-bold">2. Teslimat Adresi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input type="text" placeholder="Adres Başlığı (Ev, İş...)" className={inputStyle} value={addressData.baslik} onChange={(e) => setAddressData({ ...addressData, baslik: e.target.value })} />
                            <input type="text" placeholder="Posta Kodu" value={addressData.postaKodu} className={inputStyle} onChange={(e) => handlePostaKoduGiris(e.target.value)} />
                            <input type="text" placeholder="Şehir" className={inputStyle} value={addressData.sehir} onChange={(e) => handleSadeceHarfGiris(e.target.value, addressData, setAddressData, "sehir")} />
                            <input type="text" placeholder="İlçe" className={inputStyle} value={addressData.ilce} onChange={(e) => handleSadeceHarfGiris(e.target.value, addressData, setAddressData, "ilce")} />
                        </div>
                        <textarea placeholder="Tam Adres Detayı" className={`${inputStyle} h-24 resize-none`} value={addressData.detay} onChange={(e) => setAddressData({ ...addressData, detay: e.target.value })} />
                    </section>

                    {/* 3. Sipariş Notu (Admin Paneli İçin) */}
                    <section className="pt-8 border-t border-gray-100 space-y-4">
                        <h2 className="text-2xl font-serif font-bold">3. Sipariş Notu</h2>
                        <textarea placeholder="Siparişinizle ilgili belirtmek istediğiniz bir not var mı?" className={`${inputStyle} h-20 resize-none`} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
                    </section>

                    {/* 4. Ödeme Yöntemi */}
                    <section className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-serif font-bold mb-6">4. Ödeme Yöntemi</h2>
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
                                <input type="text" placeholder="Kart Sahibi" className={`${inputStyle} uppercase`} value={cardDetails.holder} onChange={(e) => handleSadeceHarfGiris(e.target.value, cardDetails, setCardDetails, "holder")} />
                                <input type="text" placeholder="Kart Numarası" value={cardDetails.number} className={inputStyle} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} />
                                <div className="grid grid-cols-3 gap-5">
                                    <select className={inputStyle} value={cardDetails.month} onChange={(e) => setCardDetails({ ...cardDetails, month: e.target.value })}>
                                        <option value="">Ay</option>
                                        {months.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                                    </select>
                                    <select className={inputStyle} value={cardDetails.year} onChange={(e) => setCardDetails({ ...cardDetails, year: e.target.value })}>
                                        <option value="">Yıl</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <input type="text" placeholder="CVV" value={cardDetails.cvv} className={inputStyle} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
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