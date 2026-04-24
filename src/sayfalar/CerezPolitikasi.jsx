import React from 'react';
import { Link } from 'react-router-dom';

export default function CerezPolitikasi() {
    return (
        <div className="min-h-screen bg-[#fdfaf1] p-6 md:p-12 font-sans text-[#5d4037]">
            <div className="max-w-[1000px] mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-[#d2b48c]">

                <Link to="/" className="text-black font-bold text-sm mb-10 inline-flex items-center gap-2 hover:underline group">
                    <span className="transition-transform group-hover:-translate-x-1">←</span> Mağazaya Geri Dön
                </Link>

                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
                    Çerez Politikası ve Aydınlatma Metni
                </h1>
                <p className="text-sm text-[#8d6e63] mb-12 italic border-b pb-6">
                    Son Güncelleme Tarihi: 26 Mart 2026
                </p>

                <section className="space-y-10 leading-relaxed text-[#8d6e63]">

                    <div>
                        <h2 className="text-2xl font-bold text-[#2b241a] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-black rounded-full inline-block"></span>
                            1. Veri Sorumlusu
                        </h2>
                        <p>
                            6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>E-SNAF Dijital Ticaret Platformu</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[#2b241a] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-black rounded-full inline-block"></span>
                            2. Kişisel Verilerin İşlenme Amacı
                        </h2>
                        <p className="mb-4">Toplanan kişisel verileriniz, aşağıdaki amaçlarla Kanun’un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde işlenecektir:</p>
                        <ul className="list-disc ml-6 space-y-3">
                            <li>Alışveriş süreçlerinin (sepet yönetimi, ödeme, teslimat) yürütülmesi,</li>
                            <li>Kullanıcı tercihlerinin hatırlanması ve özelleştirilmiş hizmet sunumu,</li>
                            <li>Platformun güvenliğinin sağlanması ve teknik hataların giderilmesi,</li>
                            <li>Yasal yükümlülüklerin (fatura, muhasebe vb.) yerine getirilmesi.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[#2b241a] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-black rounded-full inline-block"></span>
                            3. Kullanılan Çerez Türleri
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse bg-[#fdfaf1] rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-[#2b241a] text-[#f5f5dc]">
                                        <th className="p-4">Çerez Türü</th>
                                        <th className="p-4">Açıklama</th>
                                        <th className="p-4">Saklama Süresi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#d2b48c]">
                                    <tr>
                                        <td className="p-4 font-bold italic">Zorunlu (Oturum)</td>
                                        <td className="p-4">Sepet ve giriş işlemleri için gereklidir.</td>
                                        <td className="p-4">Tarayıcı kapatılana kadar.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold italic">Kalıcı (LocalStorage)</td>
                                        <td className="p-4">Sepetin hatırlanması ve kullanıcı onayı için kullanılır.</td>
                                        <td className="p-4">Kullanıcı silene kadar.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[#2b241a] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-black rounded-full inline-block"></span>
                            4. Kişisel Verilerin Aktarımı
                        </h2>
                        <p>
                            Kişisel verileriniz; Kanun’un 8. ve 9. maddelerine uygun olarak, sadece yasal zorunluluklar halinde yetkili kamu kurum ve kuruluşları (BTK, Gelir İdaresi Başkanlığı vb.) ile paylaşılabilecektir. Üçüncü taraf reklam ağlarına verileriniz onayınız olmaksızın aktarılmamaktadır.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[#2b241a] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-black rounded-full inline-block"></span>
                            5. Kanun’un 11. Maddesi Kapsamındaki Haklarınız
                        </h2>
                        <p className="mb-4">Kişisel veri sahibi olarak Kanun uyarınca aşağıdaki haklara sahipsiniz:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <li className="bg-white p-4 rounded-xl shadow-sm border border-[#f5f0db]">Veri işlenip işlenmediğini öğrenme,</li>
                            <li className="bg-white p-4 rounded-xl shadow-sm border border-[#f5f0db]">İşleme amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                            <li className="bg-white p-4 rounded-xl shadow-sm border border-[#f5f0db]">Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                            <li className="bg-white p-4 rounded-xl shadow-sm border border-[#f5f0db]">Kişisel verilerin silinmesini veya yok edilmesini isteme.</li>
                        </ul>
                    </div>

                </section>

                <div className="mt-16 pt-8 border-t-2 border-[#f5f0db] text-center">
                    <p className="text-[#8d6e63] text-sm">
                        İletişim ve başvuru talepleriniz için: <span className="text-black font-bold">destek@e-snaf.com</span>
                    </p>
                </div>

            </div>
        </div>
    );
}