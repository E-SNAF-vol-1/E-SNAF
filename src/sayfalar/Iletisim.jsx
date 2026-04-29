import React from 'react';

export default function Iletisim() {
    // Belirlediğin font ailesini bir stil objesi olarak tanımladık
    const fontStyle = { fontFamily: "'Segoe UI', Tahoma, sans-serif" };

    return (
        <div 
            className="min-h-screen bg-brand-bg py-12 px-4 transition-colors duration-500"
            style={fontStyle}
        >
            {/* Kart boyutu ve tasarımı orijinal ekran görüntüsüyle birebir aynı */}
            <div className="max-w-2xl mx-auto bg-brand-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-brand-text/5 backdrop-blur-sm">
                
                <h1 className="text-3xl font-bold text-center text-brand-text mb-8 tracking-tight">
                    İletişim ve Konum
                </h1>

                {/* Tablo Bölümü */}
                <div className="overflow-hidden rounded-2xl border border-brand-text/10 mb-8 shadow-sm">
                    <table className="w-full text-left border-collapse bg-brand-bg/20">
                        <tbody className="divide-y divide-brand-text/10">
                            {[
                                ["İşletme Adı", "E-SNAF Bilgi Teknolojileri"],
                                ["Ticaret Ünvanı", "E-SNAF Paz. ve Tic. A.Ş."],
                                ["Sorumlu Öğretmen", "Aykut Durgut"],
                                ["KEP Adresi", "esnaf@hs02.kep.tr"],
                                ["MERSİS No", "0739014655600017"],
                                ["Merkez Ofis", "Altınoluk MYO, Edremit / Balıkesir"],
                                ["Çağrı Merkezi", "0 850 222 44 44"]
                            ].map(([etiket, deger], index) => (
                                <tr key={index} className="hover:bg-brand-text/5 transition-colors group">
                                    {/* Etiket Sütunu - Segoe UI ile daha net okunur */}
                                    <td className="p-4 font-semibold text-brand-text w-1/3 border-r border-brand-text/10 bg-brand-accent/5">
                                        {etiket}
                                    </td>
                                    {/* Değer Sütunu */}
                                    <td className="p-4 text-brand-text/80 font-normal">
                                        {deger}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Harita Bölümü - Kenarlık altın sarısı vurgusuyla */}
                <div className="rounded-2xl overflow-hidden border-4 border-brand-accent/20 shadow-lg bg-brand-bg">
                    <iframe 
                        title="E-SNAF Konum"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.241560946211!2d26.74542231538316!3d39.56950797947192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b097b6a4a1a5b5%3A0x6b4a3a5b5b5b5b5b!2zQWx0xLFub2x1ayBNWU8!5e0!3m2!1str!2str!4v1620000000000" 
                        width="100%" 
                        height="350" 
                        style={{ border: 0, opacity: 0.9 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                    />
                </div>

            </div>
        </div>
    );
}