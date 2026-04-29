import React from "react";

export default function SepetOzetiOdeme({ cartTotal, isProcessing, onConfirm }) {
    // Kargo dahil toplam hesaplama
    const finalTotal = cartTotal > 500 ? cartTotal : cartTotal + 50;

    return (
        <aside className="h-fit sticky top-10 transition-all duration-500">
            {/* Arka plan artık temanın vurgu rengini (Accent) alıyor */}
            <div className="bg-brand-accent text-brand-bg p-8 rounded-[2.5rem] shadow-2xl text-center border border-brand-text/10 overflow-hidden relative group">
                
                {/* Dekoratif bir parıltı efekti (Opsiyonel) */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 border-b border-brand-bg/20 pb-4 opacity-80">
                    Ödeme Tutarı
                </h3>

                <div className="text-4xl font-black mb-8 italic font-serif tracking-tighter">
                    {finalTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} 
                    <span className="text-lg not-italic ml-1">TL</span>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className={`w-full py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 transform uppercase tracking-widest text-sm ${
                        isProcessing
                            ? "bg-brand-bg/20 cursor-not-allowed opacity-50"
                            : "bg-brand-bg text-brand-text hover:scale-[1.02] hover:shadow-2xl"
                    }`}
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <i className="bx bx-loader-alt animate-spin"></i> İŞLENİYOR...
                        </span>
                    ) : (
                        "SİPARİŞİ ONAYLA"
                    )}
                </button>

                {/* Alt Bilgi */}
                <p className="mt-6 text-[10px] opacity-60 font-medium leading-relaxed">
                    Siparişi onaylayarak <span className="underline cursor-pointer">Mesafeli Satış Sözleşmesi</span>'ni kabul etmiş sayılırsınız.
                </p>
            </div>
        </aside>
    );
}