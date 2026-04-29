import React from 'react';
import { Link } from 'react-router-dom';

export default function CerezPolitikasi() {
    return (
        // Arka planı lacivert yaptık
        <div className="min-h-screen bg-brand-bg p-6 md:p-12 font-sans text-brand-text/80 transition-colors duration-500">
            <div className="max-w-[1000px] mx-auto bg-brand-card rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-brand-text/10 backdrop-blur-sm">

                {/* Geri Dön Linki - Altın Vurgulu */}
                <Link to="/" className="text-brand-accent font-bold text-sm mb-10 inline-flex items-center gap-2 hover:opacity-80 transition-all group">
                    <span className="transition-transform group-hover:-translate-x-1">←</span> Mağazaya Geri Dön
                </Link>

                {/* Başlık - Boyut ve font-weight aynı, renk güncel */}
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter text-brand-text">
                    Çerez Politikası ve Aydınlatma Metni
                </h1>
                <p className="text-sm text-brand-text/50 mb-12 italic border-b border-brand-text/10 pb-6">
                    Son Güncelleme Tarihi: 26 Mart 2026
                </p>

                <section className="space-y-10 leading-relaxed">

                    {/* 1. Bölüm */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4 flex items-center gap-2">
                            {/* Siyah çubuk yerine altın sarısı vurgu */}
                            <span className="w-2 h-8 bg-brand-accent rounded-full inline-block shadow-[0_0_10px_rgba(210,180,140,0.4)]"></span>
                            1. Veri Sorumlusu
                        </h2>
                        <p>
                            6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong className="text-brand-accent">E-SNAF Dijital Ticaret Platformu</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                        </p>
                    </div>

                    {/* 2. Bölüm */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-brand-accent rounded-full inline-block shadow-[0_0_10px_rgba(210,180,140,0.4)]"></span>
                            2. Kişisel Verilerin İşlenme Amacı
                        </h2>
                        <p className="mb-4">Toplanan kişisel verileriniz, aşağıdaki amaçlarla Kanun’un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde işlenecektir:</p>
                        <ul className="list-disc ml-6 space-y-3 marker:text-brand-accent">
                            <li>Alışveriş süreçlerinin (sepet yönetimi, ödeme, teslimat) yürütülmesi,</li>
                            <li>Kullanıcı tercihlerinin hatırlanması ve özelleştirilmiş hizmet sunumu,</li>
                            <li>Platformun güvenliğinin sağlanması ve teknik hataların giderilmesi,</li>
                            <li>Yasal yükümlülüklerin (fatura, muhasebe vb.) yerine getirilmesi.</li>
                        </ul>
                    </div>

                    {/* 3. Bölüm - Tablo Tasarımı */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-brand-accent rounded-full inline-block shadow-[0_0_10px_rgba(210,180,140,0.4)]"></span>
                            3. Kullanılan Çerez Türleri
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse bg-brand-bg/40 rounded-xl overflow-hidden border border-brand-text/10">
                                <thead>
                                    <tr className="bg-brand-accent text-black">
                                        <th className="p-4">Çerez Türü</th>
                                        <th className="p-4">Açıklama</th>
                                        <th className="p-4">Saklama Süresi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-text/10">
                                    <tr>
                                        <td className="p-4 font-bold italic text-brand-accent">Zorunlu (Oturum)</td>
                                        <td className="p-4">Sepet ve giriş işlemleri için gereklidir.</td>
                                        <td className="p-4">Tarayıcı kapatılana kadar.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold italic text-brand-accent">Kalıcı (LocalStorage)</td>
                                        <td className="p-4">Sepetin hatırlanması ve kullanıcı onayı için kullanılır.</td>
                                        <td className="p-4">Kullanıcı silene kadar.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. Bölüm */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-brand-accent rounded-full inline-block shadow-[0_0_10px_rgba(210,180,140,0.4)]"></span>
                            4. Kişisel Verilerin Aktarımı
                        </h2>
                        <p>
                            Kişisel verileriniz; Kanun’un 8. ve 9. maddelerine uygun olarak, sadece yasal zorunluluklar halinde yetkili kamu kurum ve kuruluşları ile paylaşılabilecektir.
                        </p>
                    </div>

                    {/* 5. Bölüm */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-brand-accent rounded-full inline-block shadow-[0_0_10px_rgba(210,180,140,0.4)]"></span>
                            5. Haklarınız
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <li className="bg-brand-bg/50 p-4 rounded-xl border border-brand-text/10 hover:border-brand-accent/50 transition-colors">Veri işlenip işlenmediğini öğrenme,</li>
                            <li className="bg-brand-bg/50 p-4 rounded-xl border border-brand-text/10 hover:border-brand-accent/50 transition-colors">İşleme amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                            <li className="bg-brand-bg/50 p-4 rounded-xl border border-brand-text/10 hover:border-brand-accent/50 transition-colors">Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                            <li className="bg-brand-bg/50 p-4 rounded-xl border border-brand-text/10 hover:border-brand-accent/50 transition-colors">Kişisel verilerin silinmesini veya yok edilmesini isteme.</li>
                        </ul>
                    </div>

                </section>

                <div className="mt-16 pt-8 border-t-2 border-brand-text/10 text-center">
                    <p className="text-brand-text/60 text-sm">
                        İletişim ve başvuru talepleriniz için: <span className="text-brand-accent font-bold">destek@e-snaf.com</span>
                    </p>
                </div>

            </div>
        </div>
    );
}