import React from 'react';
import { useNavigate } from "react-router-dom";

export default function AltBilgi() {
    const navigate = useNavigate();

    return (
        /* bg-brand-bg: Sayfanın genel arka planıyla aynı rengi alarak bütünlük sağlar.
           text-brand-text: Yazı renklerini temaya göre (siyah/beyaz) otomatik ayarlar.
           border-brand-text/10: Temaya duyarlı çok ince bir sınır çizgisi.
        */
        <footer className="bg-brand-bg border-t border-brand-text/10 text-brand-text mt-auto font-sans transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Ana Link Grupları */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-brand-text/10">

                    {/* E-SNAF Kurumsal */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold opacity-90">E-SNAF</h4>
                        <ul className="space-y-2 text-xs opacity-70 cursor-pointer">
                            <li onClick={() => navigate("/hakkimizda")} className="hover:text-brand-accent transition-colors">Biz Kimiz</li>
                            <li onClick={() => navigate("/kariyer")} className="hover:text-brand-accent transition-colors">Kariyer</li>
                            <li onClick={() => navigate("/iletisim")} className="hover:text-brand-accent transition-colors">İletişim</li>
                            <li onClick={() => navigate("/blog")} className="hover:text-brand-accent transition-colors">E-SNAF Blog</li>
                        </ul>
                    </div>

                    {/* Kampanyalar */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold opacity-90">Kampanyalar</h4>
                        <ul className="space-y-2 text-xs opacity-70 cursor-pointer">
                            <li className="hover:text-brand-accent transition-colors">Aktif Kampanyalar</li>
                            <li className="hover:text-brand-accent transition-colors">Elite Üyelik</li>
                            <li className="hover:text-brand-accent transition-colors">Hediye Fikirleri</li>
                            <li className="hover:text-brand-accent transition-colors">Fırsat Ürünleri</li>
                        </ul>
                    </div>

                    {/* Yardım & Destek */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold opacity-90">Yardım</h4>
                        <ul className="space-y-2 text-xs opacity-70 cursor-pointer">
                            <li onClick={() => navigate("/sss")} className="hover:text-brand-accent transition-colors">Sıkça Sorulan Sorular</li>
                            <li className="hover:text-brand-accent transition-colors">Canlı Yardım</li>
                            <li className="hover:text-brand-accent transition-colors">İşlem Rehberi</li>
                        </ul>
                    </div>

                    {/* Sosyal Medya ve Uygulamalar */}
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold opacity-90">Bizi Takip Edin</h4>
                            <div className="flex gap-4">
                                {/* İkonların arka planını brand-accent yaptık. 
                                    Böylece Bej temada kahve, Ocean temada mavi olacaklar. */}
                                {[
                                    { href: "instagram", icon: "instagram" },
                                    { href: "facebook", icon: "facebook" },
                                    { href: "twitter", icon: "twitter" }
                                ].map((social) => (
                                    <a
                                        key={social.icon}
                                        href={`https://www.${social.href}.com`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-accent text-white hover:opacity-80 transition-all shadow-sm"
                                    >
                                        <i className={`bx bxl-${social.icon} text-xl`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold opacity-90">Mobil Uygulamalar</h4>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-brand-accent text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all">
                                    <i className="bx bxl-apple text-xl"></i>
                                    <span className="text-[10px] leading-tight font-medium">App Store'dan <br /><b>İndirin</b></span>
                                </div>
                                <div className="bg-brand-accent text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all">
                                    <i className="bx bxl-play-store text-xl"></i>
                                    <span className="text-[10px] leading-tight font-medium">Google Play'den <br /><b>İndirin</b></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Segment */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-bold uppercase tracking-wider opacity-50">
                        <span onClick={() => navigate("/gizlilik")} className="cursor-pointer hover:text-brand-accent transition-colors">Gizlilik Politikası</span>
                        <span onClick={() => navigate("/CerezPolitikasi")} className="cursor-pointer hover:text-brand-accent transition-colors">Çerez Politikası</span>
                        <span onClick={() => navigate("/sozlesme")} className="cursor-pointer hover:text-brand-accent transition-colors">Kullanım Koşulları</span>
                    </div>

                    <div className="flex items-center gap-6 opacity-50">
                        <div className="flex gap-3 text-2xl text-brand-text">
                            <i className="bx bxl-visa"></i>
                            <i className="bx bxl-mastercard"></i>
                        </div>
                        <div className="border-l border-brand-text/30 pl-6 text-[10px] font-black tracking-widest uppercase text-brand-text">
                            © 2026 E-SNAF
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}