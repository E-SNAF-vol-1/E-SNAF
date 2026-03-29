import React from 'react';
import { useNavigate } from "react-router-dom";

export default function AltBilgi() {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#ede6ca]/30 border-t border-[#d2b48c]/30 text-[#5d4037] py-16 px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

                <div className="space-y-6">
                    <h2
                        onClick={() => navigate("/")}
                        className="text-xl font-black tracking-[0.3em] uppercase cursor-pointer hover:opacity-70 transition-all">
                        E<span className="text-[#d2b48c]">-</span>SNAF
                    </h2>
                    <p className="text-sm font-light leading-relaxed opacity-70 max-w-xs">
                        Geleneksel esnaf samimiyetini, dijitalin modern yüzüyle birleştiriyoruz. Kalite ve güvenin adresi.
                    </p>
                </div>

                <div className="flex flex-col space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#d2b48c]">
                        Keşfedin
                    </h3>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-tight">
                        <li>
                            <span onClick={() => navigate("/")} className="hover:text-[#d2b48c] transition-colors cursor-pointer">
                                Anasayfa
                            </span>
                        </li>
                        <li>
                            <span onClick={() => navigate("/sepet")} className="hover:text-[#d2b48c] transition-colors cursor-pointer">
                                Sepetim
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-[#d2b48c] transition-colors cursor-pointer">
                                Hakkımızda
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#d2b48c]">
                        İletişim
                    </h3>
                    <p className="text-sm font-bold hover:text-[#d2b48c] transition-colors cursor-pointer">
                        destek@e-snaf.com
                    </p>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[#d2b48c]/20 text-center">
                <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">
                    &copy; 2026 E-SNAF
                </p>
            </div>
        </footer>
    );
}