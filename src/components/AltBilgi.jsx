import React from 'react';
import { useNavigate } from "react-router-dom";

export default function AltBilgi() {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#fcfaf2] border-t border-[#d2b48c]/20 text-[#5d4037] mt-auto font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Ana Link Grupları */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-[#d2b48c]/10">

                    {/* E-SNAF Kurumsal */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#2b241a]">E-SNAF</h4>
                        <ul className="space-y-2 text-xs opacity-80 cursor-pointer">
                            <li onClick={() => navigate("/hakkimizda")} className="hover:text-[#d2b48c]">Biz Kimiz</li>
                            <li onClick={() => navigate("/kariyer")} className="hover:text-[#d2b48c]">Kariyer</li>
                            <li onClick={() => navigate("/iletisim")} className="hover:text-[#d2b48c]">İletişim</li>
                            <li onClick={() => navigate("/blog")} className="hover:text-[#d2b48c]">E-SNAF Blog</li>
                        </ul>
                    </div>

                    {/* Kampanyalar */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#2b241a]">Kampanyalar</h4>
                        <ul className="space-y-2 text-xs opacity-80 cursor-pointer">
                            <li className="hover:text-[#d2b48c]">Aktif Kampanyalar</li>
                            <li className="hover:text-[#d2b48c]">Elite Üyelik</li>
                            <li className="hover:text-[#d2b48c]">Hediye Fikirleri</li>
                            <li className="hover:text-[#d2b48c]">Fırsat Ürünleri</li>
                        </ul>
                    </div>

                    {/* Yardım & Destek */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#2b241a]">Yardım</h4>
                        <ul className="space-y-2 text-xs opacity-80 cursor-pointer">
                            <li onClick={() => navigate("/sss")} className="hover:text-[#d2b48c]">Sıkça Sorulan Sorular</li>
                            <li className="hover:text-[#d2b48c]">Canlı Yardım</li>
                            <li className="hover:text-[#d2b48c]">İşlem Rehberi</li>
                        </ul>
                    </div>

                    {/* Sosyal Medya ve Uygulamalar */}
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#2b241a]">Bizi Takip Edin</h4>
                            <div className="flex gap-4">
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5d4037] text-white hover:bg-[#d2b48c] transition-all shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5d4037] text-white hover:bg-[#d2b48c] transition-all shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>

                                {/* Twitter */}
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5d4037] text-white hover:bg-[#d2b48c] transition-all shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#2b241a]">Mobil Uygulamalar</h4>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-[#5d4037] text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#3d2e25] transition-all">
                                    <i className="bx bxl-apple text-xl"></i>
                                    <span className="text-[10px] leading-tight font-medium">App Store'dan <br /><b>İndirin</b></span>
                                </div>
                                <div className="bg-[#5d4037] text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#3d2e25] transition-all">
                                    <i className="bx bxl-play-store text-xl"></i>
                                    <span className="text-[10px] leading-tight font-medium">Google Play'den <br /><b>İndirin</b></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Segment */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-bold uppercase tracking-wider opacity-60">
                        <span onClick={() => navigate("/gizlilik")} className="cursor-pointer hover:text-[#d2b48c]">Gizlilik Politikası</span>
                        <span onClick={() => navigate("/CerezPolitikasi")} className="cursor-pointer hover:text-[#d2b48c]">Çerez Politikası</span>
                        <span onClick={() => navigate("/sozlesme")} className="cursor-pointer hover:text-[#d2b48c]">Kullanım Koşulları</span>
                    </div>

                    <div className="flex items-center gap-6 grayscale opacity-50">
                        <div className="flex gap-3 text-2xl">
                            <i className="bx bxl-visa"></i>
                            <i className="bx bxl-mastercard"></i>
                        </div>
                        <div className="border-l border-[#d2b48c]/30 pl-6 text-[10px] font-black tracking-widest uppercase">
                            © 2026 E-SNAF
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}