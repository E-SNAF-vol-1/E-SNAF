import { useState, useMemo } from "react";
import { useSepet } from "../context/SepetContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * @description Ödeme ve Teslimat süreçlerini yöneten ana bileşen.
 * Kredi kartı ve Havale/EFT metodlarını destekler, dinamik form validasyonu içerir.
 */
export default function Odeme() {
    const { state } = useSepet();
    const navigate = useNavigate();

    // Uygulama çalışma zamanı tarih bilgileri
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Form State Yönetimi
    const [addressData, setAddressData] = useState({
        baslik: "", sehir: "", ilce: "", detay: "", postaKodu: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("kredi_karti");

    const [cardDetails, setCardDetails] = useState({
        number: "", holder: "", month: "", year: "", cvv: ""
    });

    // Dinamik Tarih Seçenekleri (Memoized)
    const years = useMemo(() => Array.from({ length: 11 }, (_, i) => currentYear + i), [currentYear]);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

    /**
     * Input kısıtlamalarını yöneten yardımcı fonksiyon.
     * Sadece rakam kabul eder ve belirtilen uzunluğu aşmaz.
     */
    const handleNumericInput = (value, limit) => {
        return value.replace(/\D/g, "").slice(0, limit);
    };

    /**
     * Sipariş oluşturma ve adres kayıt işlemlerini başlatan handler.
     */
    const handleProcessOrder = async (e) => {
        e.preventDefault();

        // Kredi Kartı Validasyonu
        if (paymentMethod === "kredi_karti") {
            const isExpired = parseInt(cardDetails.year) === currentYear && parseInt(cardDetails.month) < currentMonth;
            if (isExpired) {
                alert("Hata: Seçilen kredi kartının son kullanma tarihi geçmiş.");
                return;
            }
        }

        try {
            const response = await axios.post("/api/addresses", {
                adres_basligi: addressData.baslik,
                sehir: addressData.sehir, // Metin olarak gönderiyoruz
                ilce: addressData.ilce,
                detay: addressData.detay,
                postaKodu: addressData.postaKodu
            }, { withCredentials: true }); // Session'ı korumak için kritik

            if (response.status === 201) {
                alert("Sipariş başarıyla oluşturuldu.");
                navigate("/");
            }
        } catch (err) {
            console.error("Hata Detayı:", err.response?.data);
            alert(err.response?.data?.mesaj || "İşlem sırasında sunucu hatası oluştu.");
        }
    };

    const cartTotal = state.SepetNesneleri?.reduce((acc, item) => acc + (item.fiyat * item.miktar), 0) || 0;

    return (
        <div className="p-10 bg-[#fdfbf7] min-h-screen">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Form Alanı */}
                <form onSubmit={handleProcessOrder} className="lg:col-span-2 space-y-8 bg-white p-8 rounded-xl shadow-sm border border-[#ede6ca]">
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-[#4d3a2e] mb-6">1. Teslimat Adresi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Adres Başlığı *</label>
                                <input required type="text" placeholder="Ev, Ofis vb." className="w-full p-3 border border-[#d2b48c] rounded focus:border-[#4d3a2e] outline-none transition-colors"
                                    onChange={(e) => setAddressData({ ...addressData, baslik: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Posta Kodu *</label>
                                <input required type="text" value={addressData.postaKodu} placeholder="_____" className="w-full p-3 border border-[#d2b48c] rounded"
                                    onChange={(e) => setAddressData({ ...addressData, postaKodu: handleNumericInput(e.target.value, 5) })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5 mt-4">
                            <input required type="text" placeholder="Şehir *" className="p-3 border border-[#d2b48c] rounded" onChange={(e) => setAddressData({ ...addressData, sehir: e.target.value })} />
                            <input required type="text" placeholder="İlçe *" className="p-3 border border-[#d2b48c] rounded" onChange={(e) => setAddressData({ ...addressData, ilce: e.target.value })} />
                        </div>
                        <textarea required placeholder="Açık Adres Detayı (Sokak, Bina, Daire) *" className="w-full p-3 border border-[#d2b48c] rounded mt-4 h-24"
                            onChange={(e) => setAddressData({ ...addressData, detay: e.target.value })} />
                    </section>

                    <section className="pt-6 border-t border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-[#4d3a2e] mb-6">2. Ödeme Yöntemi</h2>
                        <div className="flex gap-4 mb-8">
                            {["kredi_karti", "havale"].map((method) => (
                                <button key={method} type="button" onClick={() => setPaymentMethod(method)}
                                    className={`flex-1 py-4 border-2 rounded-lg font-bold transition-all ${paymentMethod === method ? "border-[#4d3a2e] bg-[#fdfbf7] text-[#4d3a2e]" : "border-gray-100 text-gray-400"}`}>
                                    {method === "kredi_karti" ? "KREDİ KARTI" : "HAVALE / EFT"}
                                </button>
                            ))}
                        </div>

                        {paymentMethod === "kredi_karti" && (
                            <div className="bg-gray-50 p-6 rounded-lg space-y-5 animate-in fade-in duration-500">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Kart Numarası *</label>
                                    <input required={paymentMethod === "kredi_karti"} type="text" value={cardDetails.number} placeholder="0000 0000 0000 0000"
                                        className="w-full p-3 border border-[#d2b48c] rounded bg-white shadow-sm"
                                        onChange={(e) => setCardDetails({ ...cardDetails, number: handleNumericInput(e.target.value, 16) })} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Son Kullanma Tarihi *</label>
                                        <div className="flex gap-3">
                                            <select required={paymentMethod === "kredi_karti"} className="flex-1 p-3 border border-[#d2b48c] rounded bg-white" onChange={(e) => setCardDetails({ ...cardDetails, month: e.target.value })}>
                                                <option value="">Ay</option>
                                                {months.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                                            </select>
                                            <select required={paymentMethod === "kredi_karti"} className="flex-1 p-3 border border-[#d2b48c] rounded bg-white" onChange={(e) => setCardDetails({ ...cardDetails, year: e.target.value })}>
                                                <option value="">Yıl</option>
                                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">CVV *</label>
                                        <input required={paymentMethod === "kredi_karti"} type="text" value={cardDetails.cvv} placeholder="123"
                                            className="w-full p-3 border border-[#d2b48c] rounded bg-white shadow-sm"
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: handleNumericInput(e.target.value, 3) })} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </form>

                {/* Özet Paneli */}
                <aside className="space-y-6">
                    <div className="bg-[#4d3a2e] text-white p-8 rounded-xl shadow-xl">
                        <h3 className="text-lg font-bold mb-6 border-b border-[#6d5a4e] pb-4">Sipariş Özeti</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm opacity-80">
                                <span>Ara Toplam</span>
                                <span>{cartTotal.toLocaleString()} TL</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-80">
                                <span>Kargo</span>
                                <span>Ücretsiz</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-2xl font-bold">
                            <span>Toplam</span>
                            <span>{cartTotal.toLocaleString()} TL</span>
                        </div>
                        <button onClick={handleProcessOrder} className="w-full mt-8 py-4 bg-[#fdfbf7] text-[#4d3a2e] rounded-lg font-bold hover:bg-white transition-all transform active:scale-95 shadow-lg">
                            ÖDEMEYİ TAMAMLA
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}