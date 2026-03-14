import React from 'react';
import { useNavigate } from "react-router-dom";

export default function AltBilgi() {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#ede6ca] border-t border-[#d2b48c] text-[#5d4037] py-12 px-8 mt-auto shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                <div className="space-y-4">
                    <h2
                        onClick={() => navigate("/")}
                        className="text-2xl font-serif tracking-[0.15em] font-bold uppercase cursor-pointer hover:opacity-80 transition-opacity">
                        E-SNAF
                    </h2>
                    <p className="text-sm italic leading-relaxed opacity-80">
                        Geleneksel esnaf samimiyetini, dijitalin modern yüzüyle birleştiriyoruz. Kalite ve güvenin adresi.
                    </p>
                </div>

                <div className="flex flex-col space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b border-[#d2b48c] pb-2 w-fit">
                        Keşfedin
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <span onClick={() => navigate("/")} className="hover:translate-x-1 inline-block transition-transform cursor-pointer hover:font-bold">
                                Anasayfa
                            </span>
                        </li>
                        <li>
                            <span onClick={() => navigate("/sepet")} className="hover:translate-x-1 inline-block transition-transform cursor-pointer hover:font-bold">
                                Sepetim
                            </span>
                        </li>
                        <li>
                            <span className="hover:translate-x-1 inline-block transition-transform cursor-pointer hover:font-bold">
                                Hakkımızda
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h1 className="text-sm font-bold uppercase tracking-widest border-b border-[#d2b48c] pb-2 w-fit">
                        İletişim
                    </h1>
                    <p className="hover:translate-x-1 inline-block transition-transform cursor-pointer hover:font-bold">
                        destek@e-snaf.com
                    </p>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#d2b48c]/30 text-center">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-50">
                    &copy; 2026 E-SNAF
                </p>
            </div>
        </footer>
    );
}