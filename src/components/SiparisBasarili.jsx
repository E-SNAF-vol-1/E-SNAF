import React from "react";

const formatPara = (deger) =>
    Number(deger || 0).toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY"
    });

const formatTarih = (tarih) => {
    if (!tarih) return "-";
    return new Date(tarih).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const guvenliMetin = (deger) =>
    String(deger ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const buildSiparisHtml = (orderPdfData) => {
    const siparis = orderPdfData?.siparis || {};
    const musteri = orderPdfData?.musteri || {};
    const adres = orderPdfData?.adres || {};
    const urunler = orderPdfData?.urunler || [];

    const urunSatirlari = urunler
        .map((urun, index) => {
            const birimFiyat = Number(urun.fiyat || 0);
            const adet = Number(urun.miktar || 1);
            const satirToplam = birimFiyat * adet;

            return `
            <tr>
                <td>${index + 1}</td>
                <td>${guvenliMetin(urun.urun_adi || "Ürün")}</td>
                <td>${adet}</td>
                <td>${formatPara(birimFiyat)}</td>
                <td>${formatPara(satirToplam)}</td>
            </tr>
        `;
        })
        .join("");

    const tamAdres = [adres.baslik, adres.detay, adres.ilce, adres.sehir, adres.postaKodu]
        .filter(Boolean)
        .map(guvenliMetin)
        .join(" / ");

    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8" />
    <title>Sipariş Belgesi #${guvenliMetin(siparis.id || "")}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 32px;
            font-family: Arial, Helvetica, sans-serif;
            color: #2b2b2b;
            background: #f5f1ea;
        }
        .page {
            max-width: 980px;
            margin: 0 auto;
            background: #fff;
            border-radius: 18px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }
        .head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 24px;
            border-bottom: 2px solid #e9dfcf;
            padding-bottom: 24px;
            margin-bottom: 24px;
        }
        .brand h1 {
            margin: 0 0 8px;
            font-size: 30px;
            color: #4d3a2e;
        }
        .brand p {
            margin: 0;
            color: #7a6658;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            padding: 8px 14px;
            border-radius: 999px;
            background: #fff8e1;
            color: #8a5a00;
            font-weight: 700;
            font-size: 13px;
            border: 1px solid #f2d79b;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 24px;
        }
        .card {
            border: 1px solid #eadfcd;
            border-radius: 14px;
            padding: 18px;
            background: #fcfaf7;
        }
        .card h3 {
            margin: 0 0 12px;
            font-size: 15px;
            color: #4d3a2e;
        }
        .meta-row {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.5;
        }
        .meta-row strong {
            color: #4d3a2e;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        thead th {
            background: #f7f1e8;
            color: #4d3a2e;
            font-size: 13px;
            text-align: left;
            padding: 12px 10px;
            border-bottom: 1px solid #e5d9c8;
        }
        tbody td {
            padding: 12px 10px;
            border-bottom: 1px solid #eee5d8;
            font-size: 14px;
        }
        .summary {
            margin-top: 24px;
            margin-left: auto;
            width: 320px;
            border: 1px solid #eadfcd;
            border-radius: 14px;
            padding: 18px;
            background: #fcfaf7;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            font-size: 15px;
            margin-bottom: 12px;
        }
        .summary-row.total {
            font-size: 18px;
            font-weight: 800;
            color: #4d3a2e;
            border-top: 1px solid #e5d9c8;
            padding-top: 12px;
            margin-top: 12px;
            margin-bottom: 0;
        }
        .footer {
            margin-top: 28px;
            padding-top: 18px;
            border-top: 1px solid #eadfcd;
            font-size: 13px;
            color: #7a6658;
            line-height: 1.6;
        }
        .print-actions {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 18px;
        }
        .print-actions button {
            border: none;
            background: #4d3a2e;
            color: #fff;
            padding: 12px 18px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
        }
        @media print {
            body {
                background: #fff;
                padding: 0;
            }
            .page {
                box-shadow: none;
                border-radius: 0;
                max-width: 100%;
                margin: 0;
                padding: 0;
            }
            .print-actions {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="print-actions">
            <button onclick="window.print()">PDF Olarak Kaydet / Yazdır</button>
        </div>

        <div class="head">
            <div class="brand">
                <h1>E-SNAF</h1>
                <p>Sipariş Belgesi / E-İrsaliye Görünümü</p>
            </div>
            <div>
                <div class="badge">Sipariş Belgesi</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>Sipariş Bilgileri</h3>
                <div class="meta-row"><strong>Sipariş No:</strong> #${guvenliMetin(siparis.id || "")}</div>
                <div class="meta-row"><strong>Tarih:</strong> ${guvenliMetin(formatTarih(siparis.siparis_tarihi))}</div>
                <div class="meta-row"><strong>Ödeme:</strong> ${guvenliMetin(siparis.odeme_yontemi || "-")}</div>
            </div>

            <div class="card">
                <h3>Müşteri Bilgileri</h3>
                <div class="meta-row"><strong>Ad Soyad:</strong> ${guvenliMetin(`${musteri.ad || ""} ${musteri.soyad || ""}`.trim())}</div>
                <div class="meta-row"><strong>E-posta:</strong> ${guvenliMetin(musteri.email || "-")}</div>
                <div class="meta-row"><strong>Telefon:</strong> ${guvenliMetin(musteri.telefon || "-")}</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 24px;">
            <h3>Teslimat Adresi</h3>
            <div class="meta-row">${tamAdres || "-"}</div>
        </div>

        <div class="card">
            <h3>Sipariş Ürünleri</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ürün</th>
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Tutar</th>
                    </tr>
                </thead>
                <tbody>
                    ${urunSatirlari || `<tr><td colspan="5">Ürün bulunamadı.</td></tr>`}
                </tbody>
            </table>
        </div>

        <div class="summary">
            <div class="summary-row">
                <span>Ara Toplam</span>
                <span>${formatPara(siparis.toplam_tutar || 0)}</span>
            </div>
            <div class="summary-row">
                <span>Kargo</span>
                <span>${formatPara(0)}</span>
            </div>
            <div class="summary-row total">
                <span>Genel Toplam</span>
                <span>${formatPara(siparis.toplam_tutar || 0)}</span>
            </div>
        </div>

        <div class="footer">
            Bu belge sistem tarafından sipariş oluşturulduğu anda anlık üretilmiştir.
            Veritabanında PDF dosyası olarak saklanmaz. Belgeyi görüntüleyip üstteki buton ile
            PDF olarak kaydedebilirsiniz.
        </div>
    </div>
</body>
</html>
    `;
};

const openSiparisPdf = (orderPdfData) => {
    if (!orderPdfData) return;

    const html = buildSiparisHtml(orderPdfData);
    const pdfWindow = window.open("", "_blank", "width=1100,height=900");

    if (!pdfWindow) {
        alert("Tarayıcı yeni pencereyi engelledi. Lütfen pop-up engelini kapatın.");
        return;
    }

    pdfWindow.document.open();
    pdfWindow.document.write(html);
    pdfWindow.document.close();
};

const SiparisBasarili = ({ orderId, navigate, orderPdfData }) => {
    return (
        <div className="fixed inset-0 z-[20000] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
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

            <div className="bg-white p-12 rounded-3xl shadow-2xl border border-[#ede6ca] max-w-xl w-full transform scale-110">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
                    <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full p-3 fill-none stroke-current stroke-[7] animate-success-group"
                        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
                    >
                        <circle cx="50" cy="50" r="45" className="opacity-10" />
                        <path d="M 25 50 L 45 70 L 75 30" className="animate-success-check" />
                    </svg>
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#4d3a2e] mb-4">
                    Siparişiniz Alındı!
                </h1>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Alışveriş yaptığınız için teşekkürler. Siparişiniz başarıyla oluşturuldu.
                    <br />
                    Sipariş Numaranız:{" "}
                    <span className="font-bold text-[#978175]">#{orderId || "1029"}</span>
                </p>

                <div className="mb-4">
                    <button
                        onClick={() => openSiparisPdf(orderPdfData)}
                        className="w-full py-4 bg-[#f8f3eb] text-[#4d3a2e] rounded-xl font-bold hover:bg-[#f2eadf] transition-all border border-[#e4d7c5]"
                    >
                        PDF GÖR
                    </button>
                </div>

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