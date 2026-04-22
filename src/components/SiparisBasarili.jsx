import React from "react";

const SiparisBasarili = ({ orderId, navigate }) => {
    return (
        <div className="fixed inset-0 z-[20000] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            {/* Animasyon için gerekli CSS stilleri (Sürekli kalabilir) */}
            <style>
                {`
                @keyframes success-check-group {
                    0% { transform: rotate(180deg); opacity: 0; }
                    100% { transform: rotate(0deg); opacity: 1; }
                }
                @keyframes success-check-check {
                    0% { stroke-dashoffset: 70; }
                    100% { stroke-dashoffset: 0; }
                }
                
                .animate-success-group {
                    animation: success-check-group 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    transform-origin: center;
                }
                
                .animate-success-check {
                    stroke-dasharray: 70;
                    stroke-dashoffset: 70;
                    animation: success-check-check 0.5s 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                `}
            </style>

            <div className="bg-white p-12 rounded-3xl shadow-2xl border border-[#ede6ca] max-w-lg w-full transform scale-110">
                {/* Asil Animasyonlu SVG Daire ve Tik */}
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
                    <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full p-3 fill-none stroke-current stroke-[7] animate-success-group"
                        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    >
                        {/* Dairenin kendisi */}
                        <circle cx="50" cy="50" r="45" className="opacity-10" />

                        {/* Tik İşareti (Animasyonlu Yol) */}
                        <path
                            d="M 25 50 L 45 70 L 75 30"
                            className="animate-success-check"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#4d3a2e] mb-4">Siparişiniz Alındı!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Alışveriş yaptığınız için teşekkürler. Siparişiniz başarıyla oluşturuldu. <br />
                    Sipariş Numaranız: <span className="font-bold text-[#978175]">#{orderId || "1029"}</span>
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="w-full py-4 bg-[#4d3a2e] text-white rounded-xl font-bold hover:bg-[#3d2e25] transition-all shadow-lg active:scale-95"
                >
                    ANASAYFAYA DÖN
                </button>
            </div>
        </div>
    );
};

export default SiparisBasarili;