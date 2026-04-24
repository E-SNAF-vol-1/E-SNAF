import React from "react";

export default function SepetOzetiOdeme({ cartTotal, isProcessing, onConfirm }) {
    return (
        <aside className="h-fit sticky top-10">
            <div className="bg-[#4d3a2e] text-white p-8 rounded-3xl shadow-xl text-center border border-[#5d4a3e]">
                <h3 className="text-xl font-serif mb-6 border-b border-[#6d5a4e] pb-4 font-bold">
                    Ödeme Tutarı
                </h3>

                <div className="text-3xl font-bold mb-8">
                    {(cartTotal > 500 ? cartTotal : cartTotal + 50).toLocaleString("tr-TR")} TL
                </div>

                <button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className={`w-full py-5 rounded-xl font-black transition-all shadow-lg active:scale-95 ${isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#fdfbf7] text-[#4d3a2e] hover:bg-white"
                        }`}
                >
                    {isProcessing ? "İŞLENİYOR..." : "SİPARİŞİ ONAYLA"}
                </button>
            </div>
        </aside>
    );
}