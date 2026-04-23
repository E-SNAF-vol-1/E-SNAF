import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, api } from "../context/AuthContext";

// ═══════════════════════════════════════════════════════════════════════════════
//  YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════════════════════
const formatTarih = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

const formatPara = (sayi) =>
  Number(sayi || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

const durumRenk = (durum) => {
  const map = {
    "Hazırlanıyor":     { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
    "Kargoya Verildi":  { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
    "Teslim Edildi":    { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
    "İptal Edildi":     { bg: "#ffebee", text: "#b71c1c", border: "#ef9a9a" },
    "Onaylandı":        { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
    "Beklemede":        { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" }
  };
  return map[durum] || { bg: "#f5f5f5", text: "#555", border: "#ddd" };
};

const durumIkonClass = (durum) => {
  const map = {
    "Hazırlanıyor":     "bx bx-time",
    "Kargoya Verildi":  "bx bxs-truck",
    "Teslim Edildi":    "bx bx-check-circle",
    "İptal Edildi":     "bx bx-x-circle",
    "Onaylandı":        "bx bx-check",
    "Beklemede":        "bx bx-bell"
  };
  return map[durum] || "bx bx-package";
};

const lsKey = (userId, isim) => `esnaf_${isim}_${userId}`;
const ls = {
  oku(key, varsayilan = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? varsayilan; }
    catch { return varsayilan; }
  },
  yaz(key, veri) {
    try { localStorage.setItem(key, JSON.stringify(veri)); }
    catch (e) { console.error("localStorage yazma hatası:", e); }
  }
};

const temizMetin = (deger) => String(deger ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const siparisKalemToplam = (urun) => Number(urun?.birim_fiyat || 0) * Number(urun?.adet || 0);

const siparisPdfHtmlOlustur = (veri) => {
  const s = veri?.siparis || {};
  const urunler = Array.isArray(veri?.urunler) ? veri.urunler : [];
  const musteriAdi = s?.misafir_bilgileri?.ad
    ? `${s.misafir_bilgileri.ad || ""} ${s.misafir_bilgileri.soyad || ""}`.trim()
    : "Kayıtlı Kullanıcı";

  const urunSatirlari = urunler.map((u, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${temizMetin(u.urun_adi || `Ürün #${u.urun_id || "-"}`)}</td>
      <td>${Number(u.adet || 0)}</td>
      <td>${formatPara(u.birim_fiyat || 0)}</td>
      <td>${formatPara(siparisKalemToplam(u))}</td>
    </tr>
  `).join("");

  return `<!doctype html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <title>E-İrsaliye - Sipariş #${s.id}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 32px;
        font-family: Arial, Helvetica, sans-serif;
        background: #f5f5f5;
        color: #222;
      }
      .actions {
        max-width: 900px;
        margin: 0 auto 16px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .actions button {
        border: none;
        background: #2e7d32;
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }
      .actions button.secondary {
        background: #5d4037;
      }
      .page {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      }
      .top {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        border-bottom: 2px solid #e8e8e8;
        padding-bottom: 20px;
        margin-bottom: 24px;
      }
      .brand h1 {
        margin: 0 0 8px;
        font-size: 28px;
        color: #2e7d32;
      }
      .brand p, .meta p, .box p {
        margin: 4px 0;
        line-height: 1.5;
      }
      .title {
        text-align: right;
      }
      .title h2 {
        margin: 0 0 8px;
        font-size: 24px;
        color: #5d4037;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }
      .box {
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        padding: 16px;
        background: #fcfcfc;
      }
      .box h3 {
        margin: 0 0 10px;
        font-size: 13px;
        letter-spacing: 0.8px;
        color: #7b6a58;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      thead th {
        background: #f2efe9;
        color: #5d4037;
        font-size: 13px;
      }
      th, td {
        border: 1px solid #e4ded2;
        padding: 10px;
        text-align: left;
        font-size: 13px;
      }
      .summary {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
      .summary-box {
        width: 280px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #ddd;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 14px;
        background: #fff;
      }
      .summary-row.total {
        background: #5d4037;
        color: #fff;
        font-size: 18px;
        font-weight: 700;
      }
      .note {
        margin-top: 28px;
        padding-top: 16px;
        border-top: 1px dashed #ccc;
        color: #666;
        font-size: 12px;
      }
      @media print {
        body { background: white; padding: 0; }
        .actions { display: none; }
        .page { box-shadow: none; max-width: none; margin: 0; padding: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="actions">
      <button onclick="window.print()">PDF İndir / Yazdır</button>
      <button class="secondary" onclick="window.close()">Kapat</button>
    </div>

    <div class="page">
      <div class="top">
        <div class="brand">
          <h1>E-SNAF</h1>
          <p><strong>Belge Türü:</strong> E-İrsaliye / Sipariş Dökümü</p>
          <p><strong>Oluşturulma Tarihi:</strong> ${temizMetin(formatTarih(new Date().toISOString()))}</p>
        </div>
        <div class="title">
          <h2>Sipariş #${s.id}</h2>
          <div class="meta">
            <p><strong>Sipariş Tarihi:</strong> ${temizMetin(formatTarih(s.siparis_tarihi))}</p>
            
            <p><strong>Ödeme Yöntemi:</strong> ${temizMetin(s.odeme_yontemi || "-")}</p>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="box">
          <h3>MÜŞTERİ BİLGİLERİ</h3>
          <p><strong>Ad Soyad:</strong> ${temizMetin(musteriAdi)}</p>
          <p><strong>E-posta:</strong> ${temizMetin(s?.misafir_bilgileri?.email || "-")}</p>
          <p><strong>Telefon:</strong> ${temizMetin(s?.misafir_bilgileri?.telefon || "-")}</p>
        </div>

        <div class="box">
          <h3>TESLİMAT ADRESİ</h3>
          <p><strong>Adres Başlığı:</strong> ${temizMetin(s.adres_basligi || "-")}</p>
          <p>${temizMetin(s.tam_adres || "-")}</p>
          <p>${temizMetin([s.sehir_adi, s.posta_kodu].filter(Boolean).join(" ")) || "-"}</p>
        </div>
      </div>

      <div class="box">
        <h3>ÜRÜN LİSTESİ</h3>
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
            ${urunSatirlari || '<tr><td colspan="5">Ürün bulunamadı.</td></tr>'}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-box">
            <div class="summary-row">
              <span>Genel Toplam</span>
              <span>${temizMetin(formatPara(s.toplam_tutar || 0))}</span>
            </div>
            <div class="summary-row total">
              <span>Ödenecek Tutar</span>
              <span>${temizMetin(formatPara(s.toplam_tutar || 0))}</span>
            </div>
          </div>
        </div>
      </div>

      ${s.notlar ? `
      <div class="box" style="margin-top: 18px;">
        <h3>SİPARİŞ NOTU</h3>
        <p>${temizMetin(s.notlar)}</p>
      </div>` : ""}

      <div class="note">
        Bu belge sistemde ayrıca saklanmaz. Kullanıcı talep ettiğinde tarayıcı üzerinden anlık olarak oluşturulur.
      </div>
    </div>
  </body>
  </html>`;
};

const siparisPdfPenceresiAc = async (siparisId) => {
  const popup = window.open("", "_blank", "width=1100,height=900");

  if (!popup) {
    throw new Error("PDF penceresi açılamadı. Tarayıcı açılır pencereyi engelliyor olabilir.");
  }

  const res = await api.get(`/orders/my/${siparisId}`);
  const html = siparisPdfHtmlOlustur(res.data);

  popup.document.open();
  popup.document.write(html);
  popup.document.close();

  return popup;
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MENÜ TANIMLARI
// ═══════════════════════════════════════════════════════════════════════════════
const MENU = [
  { id: "siparisler",  ad: "Siparişlerim",       ikon: "bx bx-cart" },
  { id: "favoriler",   ad: "Favorilerim",       ikon: "bx bx-heart" },
  { id: "adresler",    ad: "Adreslerim",        ikon: "bx bx-map" },
  { id: "stok_alarm",  ad: "Stok Alarm Listem", ikon: "bx bx-bell" },
  { id: "havale",      ad: "Havale Bildirimi",  ikon: "bx bx-transfer" },
  { id: "fiyat_alarm", ad: "Fiyat Alarm Listem",ikon: "bx bx-money" }
];

const SEHIRLER = [
  { id: 1, ad: "Adana" }, { id: 2, ad: "Adıyaman" }, { id: 3, ad: "Afyonkarahisar" },
  { id: 4, ad: "Ağrı" }, { id: 5, ad: "Amasya" }, { id: 6, ad: "Ankara" },
  { id: 7, ad: "Antalya" }, { id: 8, ad: "Artvin" }, { id: 9, ad: "Aydın" },
  { id: 10, ad: "Balıkesir" }, { id: 11, ad: "Bilecik" }, { id: 12, ad: "Bingöl" },
  { id: 13, ad: "Bitlis" }, { id: 14, ad: "Bolu" }, { id: 15, ad: "Burdur" },
  { id: 16, ad: "Bursa" }, { id: 17, ad: "Çanakkale" }, { id: 18, ad: "Çankırı" },
  { id: 19, ad: "Çorum" }, { id: 20, ad: "Denizli" }, { id: 21, ad: "Diyarbakır" },
  { id: 22, ad: "Edirne" }, { id: 23, ad: "Elazığ" }, { id: 24, ad: "Erzincan" },
  { id: 25, ad: "Erzurum" }, { id: 26, ad: "Eskişehir" }, { id: 27, ad: "Gaziantep" },
  { id: 28, ad: "Giresun" }, { id: 29, ad: "Gümüşhane" }, { id: 30, ad: "Hakkâri" },
  { id: 31, ad: "Hatay" }, { id: 32, ad: "Isparta" }, { id: 33, ad: "Mersin" },
  { id: 34, ad: "İstanbul" }, { id: 35, ad: "İzmir" }, { id: 36, ad: "Kars" },
  { id: 37, ad: "Kastamonu" }, { id: 38, ad: "Kayseri" }, { id: 39, ad: "Kırklareli" },
  { id: 40, ad: "Kırşehir" }, { id: 41, ad: "Kocaeli" }, { id: 42, ad: "Konya" },
  { id: 43, ad: "Kütahya" }, { id: 44, ad: "Malatya" }, { id: 45, ad: "Manisa" },
  { id: 46, ad: "Kahramanmaraş" }, { id: 47, ad: "Mardin" }, { id: 48, ad: "Muğla" },
  { id: 49, ad: "Muş" }, { id: 50, ad: "Nevşehir" }, { id: 51, ad: "Niğde" },
  { id: 52, ad: "Ordu" }, { id: 53, ad: "Rize" }, { id: 54, ad: "Sakarya" },
  { id: 55, ad: "Samsun" }, { id: 56, ad: "Siirt" }, { id: 57, ad: "Sinop" },
  { id: 58, ad: "Sivas" }, { id: 59, ad: "Tekirdağ" }, { id: 60, ad: "Tokat" },
  { id: 61, ad: "Trabzon" }, { id: 62, ad: "Tunceli" }, { id: 63, ad: "Şanlıurfa" },
  { id: 64, ad: "Uşak" }, { id: 65, ad: "Van" }, { id: 66, ad: "Yozgat" },
  { id: 67, ad: "Zonguldak" }, { id: 68, ad: "Aksaray" }, { id: 69, ad: "Bayburt" },
  { id: 70, ad: "Karaman" }, { id: 71, ad: "Kırıkkale" }, { id: 72, ad: "Batman" },
  { id: 73, ad: "Şırnak" }, { id: 74, ad: "Bartın" }, { id: 75, ad: "Ardahan" },
  { id: 76, ad: "Iğdır" }, { id: 77, ad: "Yalova" }, { id: 78, ad: "Karabük" },
  { id: 79, ad: "Kilis" }, { id: 80, ad: "Osmaniye" }, { id: 81, ad: "Düzce" }
];

const Icon = ({ name, style }) => <i className={name} style={style} />;

function LoadingBox({ mesaj = "Yükleniyor..." }) {
  return (
    <div style={ps.spinnerKutu}>
      <div style={ps.spinner} />
      <p style={ps.bilgiYazi}>{mesaj}</p>
    </div>
  );
}

function EmptyState({ ikon, baslik, alt, btnAd, onBtn }) {
  return (
    <div style={ps.bos}>
      <div style={ps.bosIkon}><Icon name={ikon} /></div>
      <h3 style={ps.bosBaslik}>{baslik}</h3>
      <p style={ps.bosAlt}>{alt}</p>
      {btnAd && <button style={ps.alisverisBtn} onClick={onBtn}>{btnAd}</button>}
    </div>
  );
}

function Dashboard({ onSecim, onSiparisTakipAc }) {
  const kartlar = [
    { id: "siparisler",  ikon: "bx bx-cart",      ad: "SİPARİŞLERİM" },
    { id: "favoriler",   ikon: "bx bx-heart",     ad: "FAVORİLERİM" },
    { id: "adresler",    ikon: "bx bx-map",       ad: "ADRESLERİM" },
    { id: "stok_alarm",  ikon: "bx bx-bell",      ad: "STOK ALARM LİSTEM" },
    { id: "havale",      ikon: "bx bx-transfer",  ad: "HAVALE BİLDİRİMİ" },
    { id: "fiyat_alarm", ikon: "bx bx-money",     ad: "FİYAT ALARM LİSTEM" }
  ];

  return (
    <div>
      <SiparisTakipForm onDetayAc={onSiparisTakipAc} />
      <div style={ds.grid}>
        {kartlar.map((k) => (
          <div key={k.id} className="dash-kart" style={ds.kart} onClick={() => onSecim(k.id)}>
            <div style={ds.kartIkonDaire}><Icon name={k.ikon} style={ds.kartIkon} /></div>
            <div style={ds.kartAd}>{k.ad}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiparisTakipForm({ onDetayAc }) {
  const [no, setNo] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata("");
    const siparisId = String(no).trim();

    if (!siparisId) {
      setHata("Lütfen sipariş numarası girin.");
      return;
    }

    setYukleniyor(true);
    try {
      await api.get(`/orders/my/${siparisId}`);
      onDetayAc(siparisId);
      setNo("");
    } catch {
      setHata("Sipariş bulunamadı veya bu sipariş size ait değil.");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={ds.takipKutu}>
      <div style={ds.takipBaslik}>
        <Icon name="bx bx-search-alt" style={ds.takipIkon} /> SİPARİŞ TAKİBİ
      </div>
      <form style={ds.takipForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Sipariş numaranızı girin"
          value={no}
          onChange={(e) => setNo(e.target.value)}
          style={ds.takipInput}
        />
        <button type="submit" style={ds.takipBtn} disabled={yukleniyor}>
          {yukleniyor ? "YÜKLENİYOR..." : "GÖNDER"}
        </button>
      </form>
      {hata && <div style={ds.takipHata}><Icon name="bx bx-error-circle" /> {hata}</div>}
    </div>
  );
}

function SiparisDetayModal({ siparisId, onKapat }) {
  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");

  useEffect(() => {
    let aktif = true;
    (async () => {
      try {
        const res = await api.get(`/orders/my/${siparisId}`);
        if (aktif) setVeri(res.data);
      } catch (err) {
        console.error(err);
        if (aktif) setHata("Sipariş detayları alınamadı.");
      } finally {
        if (aktif) setYukleniyor(false);
      }
    })();
    return () => { aktif = false; };
  }, [siparisId]);

  const siparis = veri?.siparis;
  const urunler = veri?.urunler || [];
  const dc = durumRenk(siparis?.durum);

  return (
    <div style={ms.overlay} onClick={onKapat}>
      <div style={ms.panel} onClick={(e) => e.stopPropagation()}>
        <div style={ms.panelBaslik}>
          <div>
            <span style={ms.modalEtiket}>SİPARİŞ DETAYI</span>
            <h3 style={ms.siparisNo}>#{siparisId}</h3>
          </div>
          <button style={ms.kapat} onClick={onKapat}>
            <Icon name="bx bx-x" style={{ fontSize: "24px" }} />
          </button>
        </div>

        <div style={ms.scrollAlan}>
          {yukleniyor && <div style={ms.bilgi}>Sipariş yükleniyor...</div>}
          {hata && <div style={ps.hataKutu}>{hata}</div>}

          {!yukleniyor && !hata && siparis && (
            <>
              <div style={ms.ozetSatir}>
                <div>
                  <div style={{ ...ms.badge, background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
                    <Icon name={durumIkonClass(siparis.durum)} /> {siparis.durum}
                  </div>
                </div>
                <span style={ms.tarihKucuk}>{formatTarih(siparis.siparis_tarihi)}</span>
              </div>

              <div style={ms.blok}>
                <div style={ms.blokBaslik}><Icon name="bx bx-map" /> TESLİMAT ADRESİ</div>
                <p style={ms.blokIcerik}>
                  {siparis.adres_basligi ? <strong>{siparis.adres_basligi}</strong> : null}
                  {siparis.adres_basligi ? <br /> : null}
                  {siparis.tam_adres || "Adres bilgisi yok"}
                  {siparis.sehir_adi ? ` / ${siparis.sehir_adi}` : ""}
                  {siparis.posta_kodu ? ` / ${siparis.posta_kodu}` : ""}
                </p>
              </div>

              <div style={ms.blok}>
                <div style={ms.blokBaslik}><Icon name="bx bx-credit-card" /> ÖDEME BİLGİSİ</div>
                <p style={ms.blokIcerik}>{siparis.odeme_yontemi || "Belirtilmemiş"}</p>
              </div>

              <div style={ms.blok}>
                <div style={ms.blokBaslik}><Icon name="bx bx-package" /> ÜRÜNLER</div>
                <div style={ms.urunListesi}>
                  {urunler.map((u) => (
                    <div key={u.id} style={ms.urunSatir}>
                      <div style={ms.urunAd}>
                        <span style={ms.urunAdet}>{u.adet}x</span>
                        <span>{u.urun_adi || `Ürün #${u.urun_id}`}</span>
                      </div>
                      <span style={ms.urunFiyat}>{formatPara(u.birim_fiyat)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={ms.toplamSatir}>
                <span style={ms.toplamLabel}>TOPLAM TUTAR</span>
                <span style={ms.toplamTutar}>{formatPara(siparis.toplam_tutar)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Siparislerim({ onDetayAc }) {
  const [liste, setListe] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [pdfHazirlaniyorId, setPdfHazirlaniyorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/orders/my");
        setListe(res.data);
      } catch (err) {
        console.error(err);
        setHata("Siparişler yüklenemedi.");
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  const handlePdfAc = async (e, siparisId) => {
    e.stopPropagation();
    setPdfHazirlaniyorId(siparisId);
    try {
      await siparisPdfPenceresiAc(siparisId);
    } catch (err) {
      console.error(err);
      alert(err.message || "Sipariş PDF'i oluşturulamadı.");
    } finally {
      setPdfHazirlaniyorId(null);
    }
  };

  

  if (yukleniyor) return <LoadingBox mesaj="Siparişleriniz yükleniyor..." />;
  if (hata) return <div style={ps.hataKutu}>{hata}</div>;
  if (!liste.length) {
    return (
      <EmptyState
        ikon="bx bx-package"
        baslik="Henüz siparişiniz yok"
        alt="İlk siparişinizi vermek için alışverişe başlayın!"
        btnAd="Alışverişe Başla"
        onBtn={() => navigate("/")}
      />
    );
  }

  return (
    <div style={ps.siparisListesi}>
      {liste.map((sp) => {
        const dc = durumRenk(sp.durum);
        const pdfBekliyor = pdfHazirlaniyorId === sp.id;

        return (
          <div
            key={sp.id}
            className="siparis-kart"
            style={ps.siparisKart}
            onClick={() => onDetayAc(sp.id)}
          >
            <div style={ps.kartUst}>
              <div>
                <span style={ps.siparisNoEtiket}>SİPARİŞ NO</span>
                <p style={ps.siparisNo}>#{sp.id}</p>
              </div>
              <span style={{ ...ps.durumBadge, background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
                <Icon name={durumIkonClass(sp.durum)} /> {sp.durum}
              </span>
            </div>

            <div style={ps.kartAlt}>
              <div style={ps.kartBilgi}>
                <span style={ps.kartEtiket}>
                  <Icon name="bx bx-calendar" /> Tarih
                </span>
                <span style={ps.kartDeger}>{formatTarih(sp.siparis_tarihi)}</span>
              </div>

              <div style={ps.kartBilgi}>
                <span style={ps.kartEtiket}>
                  <Icon name="bx bx-lira" /> Tutar
                </span>
                <span style={{ ...ps.kartDeger, fontWeight: "800", color: "#2e7d32" }}>
                  {formatPara(sp.toplam_tutar)}
                </span>
              </div>

              <div style={ps.kartAksiyonlari}>
                <button
                  type="button"
                  style={ps.pdfButon}
                  onClick={(e) => handlePdfAc(e, sp.id)}
                  disabled={pdfBekliyor}
                >
                  <Icon name="bx bx-show-alt" /> PDF Gör
                </button>

                
              </div>

              <div style={ps.detayOk}>
                Detaylar <Icon name="bx bx-right-arrow-alt" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Favorilerim({ userId }) {
  const key = useMemo(() => lsKey(userId, "favoriler"), [userId]);
  const [liste, setListe] = useState(() => ls.oku(key));
  const navigate = useNavigate();

  const sil = (id) => {
    const yeni = liste.filter((x) => x.id !== id);
    setListe(yeni);
    ls.yaz(key, yeni);
  };

  if (!liste.length) {
    return (
      <EmptyState
        ikon="bx bx-heart"
        baslik="Favori listeniz boş"
        alt="Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilere ekleyebilirsiniz."
        btnAd="Ürünleri Keşfet"
        onBtn={() => navigate("/")}
      />
    );
  }

  return (
    <div style={ps.listeGrid}>
      {liste.map((u) => (
        <div key={u.id} style={ps.favKart}>
          {u.gorsel && <img src={u.gorsel} alt={u.ad} style={ps.favGorsel} />}
          <div style={ps.favIcerik}>
            <h4 style={ps.favAd}>{u.ad}</h4>
            {u.fiyat && <p style={ps.favFiyat}>{formatPara(u.fiyat)}</p>}
            <div style={ps.favButonlar}>
              <button style={ps.favIncele} onClick={() => navigate(u.link || "/")}>
                <Icon name="bx bx-show" /> İncele
              </button>
              <button style={ps.favSil} onClick={() => sil(u.id)}>
                <Icon name="bx bx-trash" /> Kaldır
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Adreslerim() {
  const [liste, setListe] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState(null);

  const yukle = async () => {
    setYukleniyor(true);
    try {
      const res = await api.get("/addresses");
      setListe(res.data);
      setHata("");
    } catch {
      setHata("Adresler yüklenemedi.");
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => { yukle(); }, []);

  const sil = async (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      setListe((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Adres silinemedi.");
    }
  };

  return (
    <div>
      <div style={ps.ustBar}>
        <p style={ps.altBaslik}>Kayıtlı teslimat adresleriniz</p>
        <button style={ps.ekleBtn} onClick={() => { setDuzenlenen(null); setFormAcik(true); }}>
          <Icon name="bx bx-plus" /> Yeni Adres
        </button>
      </div>

      {yukleniyor && <LoadingBox mesaj="Adresler yükleniyor..." />}
      {hata && <div style={ps.hataKutu}>{hata}</div>}

      {!yukleniyor && !liste.length && (
        <EmptyState
          ikon="bx bx-map"
          baslik="Kayıtlı adresiniz yok"
          alt="Daha hızlı sipariş verebilmek için adres ekleyin."
          btnAd="İlk Adresini Ekle"
          onBtn={() => { setDuzenlenen(null); setFormAcik(true); }}
        />
      )}

      {!yukleniyor && liste.length > 0 && (
        <div style={ps.listeGrid}>
          {liste.map((a) => (
            <div key={a.id} style={ps.adresKart}>
              <div style={ps.adresBaslik}>
                <Icon name="bx bx-map" /> {a.adres_basligi || "Adres"}
              </div>
              <p style={ps.adresMetin}>
                {a.tam_adres}
                {a.sehir_adi ? `, ${a.sehir_adi}` : ""}
                {a.posta_kodu ? ` ${a.posta_kodu}` : ""}
              </p>
              <div style={ps.adresButonlar}>
                <button style={ps.btnDuzenle} onClick={() => { setDuzenlenen(a); setFormAcik(true); }}>
                  <Icon name="bx bx-edit" /> Düzenle
                </button>
                <button style={ps.btnSil} onClick={() => sil(a.id)}>
                  <Icon name="bx bx-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formAcik && (
        <AdresForm
          mevcut={duzenlenen}
          onKapat={() => setFormAcik(false)}
          onBasari={() => { setFormAcik(false); yukle(); }}
        />
      )}
    </div>
  );
}

function AdresForm({ mevcut, onKapat, onBasari }) {
  const [form, setForm] = useState({
    sehir_id: mevcut?.sehir_id || "",
    adres_basligi: mevcut?.adres_basligi || "",
    tam_adres: mevcut?.tam_adres || "",
    posta_kodu: mevcut?.posta_kodu || ""
  });
  const [hata, setHata] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const handleKaydet = async (e) => {
    e.preventDefault();
    setHata("");

    if (!form.sehir_id) { setHata("Şehir seçiniz."); return; }
    if (!form.tam_adres.trim()) { setHata("Tam adres girin."); return; }
    if (form.tam_adres.length < 10) { setHata("Adres çok kısa (en az 10 karakter)."); return; }
    if (form.posta_kodu && !/^\d{5}$/.test(form.posta_kodu)) {
      setHata("Posta kodu 5 haneli olmalı."); return;
    }

    setKaydediliyor(true);
    try {
      const payload = {
        sehir_id: parseInt(form.sehir_id, 10),
        adres_basligi: form.adres_basligi.trim() || null,
        tam_adres: form.tam_adres.trim(),
        posta_kodu: form.posta_kodu.trim() || null
      };
      if (mevcut) await api.put(`/addresses/${mevcut.id}`, payload);
      else await api.post("/addresses", payload);
      onBasari();
    } catch (err) {
      setHata(err.response?.data?.mesaj || "Adres kaydedilemedi.");
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <div style={ms.overlay} onClick={onKapat}>
      <div style={{ ...ms.panel, maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
        <div style={ms.panelBaslik}>
          <div>
            <span style={ms.modalEtiket}>{mevcut ? "ADRES DÜZENLE" : "YENİ ADRES"}</span>
          </div>
          <button style={ms.kapat} onClick={onKapat}>
            <Icon name="bx bx-x" style={{ fontSize: "24px" }} />
          </button>
        </div>

        <form style={ms.scrollAlan} onSubmit={handleKaydet}>
          {hata && (
            <div style={fs.hataKutu}>
              <Icon name="bx bx-error-circle" /> {hata}
            </div>
          )}

          <label style={fs.label}>ADRES BAŞLIĞI (Örn: Ev, İş)</label>
          <input
            type="text"
            value={form.adres_basligi}
            onChange={(e) => setForm({ ...form, adres_basligi: e.target.value })}
            style={fs.input}
            maxLength={50}
            placeholder="Ev"
          />

          <label style={fs.label}>ŞEHİR *</label>
          <select
            value={form.sehir_id}
            onChange={(e) => setForm({ ...form, sehir_id: e.target.value })}
            style={fs.input}
            required
          >
            <option value="">Seçiniz...</option>
            {SEHIRLER.map((s) => (
              <option key={s.id} value={s.id}>{s.ad}</option>
            ))}
          </select>

          <label style={fs.label}>TAM ADRES *</label>
          <textarea
            value={form.tam_adres}
            onChange={(e) => setForm({ ...form, tam_adres: e.target.value })}
            style={{ ...fs.input, minHeight: "100px", resize: "vertical" }}
            maxLength={500}
            required
            placeholder="Mahalle, sokak, bina no, daire no..."
          />

          <label style={fs.label}>POSTA KODU</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.posta_kodu}
            onChange={(e) => setForm({ ...form, posta_kodu: e.target.value })}
            style={fs.input}
            maxLength={5}
            placeholder="34000"
          />

          <button type="submit" style={fs.submitBtn} disabled={kaydediliyor}>
            {kaydediliyor ? "Kaydediliyor..." : (mevcut ? "Güncelle" : "Adres Ekle")}
          </button>
        </form>
      </div>
    </div>
  );
}

function StokAlarm({ userId }) {
  const key = useMemo(() => lsKey(userId, "stok_alarm"), [userId]);
  const [liste, setListe] = useState(() => ls.oku(key));
  const [form, setForm] = useState({ urunAdi: "", link: "" });
  const [hata, setHata] = useState("");

  const ekle = (e) => {
    e.preventDefault();
    setHata("");
    if (!form.urunAdi.trim()) { setHata("Ürün adı zorunlu."); return; }
    const yeni = [...liste, {
      id: Date.now(),
      urunAdi: form.urunAdi.trim(),
      link: form.link.trim(),
      tarih: new Date().toISOString()
    }];
    setListe(yeni);
    ls.yaz(key, yeni);
    setForm({ urunAdi: "", link: "" });
  };

  const sil = (id) => {
    const yeni = liste.filter((x) => x.id !== id);
    setListe(yeni);
    ls.yaz(key, yeni);
  };

  return (
    <div>
      <div style={ps.ustBar}><p style={ps.altBaslik}>Stok geldiğinde bildirim almak istediğiniz ürünler</p></div>

      <form style={fs.kart} onSubmit={ekle}>
        <label style={fs.label}>ÜRÜN ADI *</label>
        <input
          value={form.urunAdi}
          onChange={(e) => setForm({ ...form, urunAdi: e.target.value })}
          style={fs.input}
          placeholder="Örn: El Yapımı Sabun"
        />
        <label style={fs.label}>ÜRÜN LİNKİ (İsteğe bağlı)</label>
        <input
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          style={fs.input}
          placeholder="https://..."
        />
        {hata && <div style={fs.hataKutu}><Icon name="bx bx-error-circle" /> {hata}</div>}
        <button type="submit" style={fs.submitBtn}><Icon name="bx bx-plus" /> Alarm Ekle</button>
      </form>

      <div style={{ marginTop: "18px" }}>
        {!liste.length ? (
          <EmptyState
            ikon="bx bx-bell-off"
            baslik="Stok alarm listeniz boş"
            alt="Takip etmek istediğiniz ürünleri ekleyin."
          />
        ) : liste.map((x) => (
          <div key={x.id} style={ps.alarmSatir}>
            <div style={{ flex: 1 }}>
              <p style={ps.alarmAd}><Icon name="bx bx-bell" /> {x.urunAdi}</p>
              <p style={ps.alarmTarih}>Eklenme: {formatTarih(x.tarih)}</p>
              {x.link && <a href={x.link} target="_blank" rel="noreferrer" style={ps.alarmLink}><Icon name="bx bx-link-external" /> Ürüne git</a>}
            </div>
            <button style={ps.btnSil} onClick={() => sil(x.id)}><Icon name="bx bx-trash" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HavaleBildirimi({ userId, user }) {
  const key = useMemo(() => lsKey(userId, "havale_bildirim"), [userId]);
  const [kayitlar, setKayitlar] = useState(() => ls.oku(key));
  const [form, setForm] = useState({
    siparisNo: "",
    gonderenAd: `${user?.ad || ""} ${user?.soyad || ""}`.trim(),
    banka: "",
    tutar: "",
    aciklama: ""
  });
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");

  const kaydet = (e) => {
    e.preventDefault();
    setMesaj("");
    setHata("");

    if (!form.siparisNo.trim()) { setHata("Sipariş numarası zorunlu."); return; }
    if (!form.gonderenAd.trim()) { setHata("Gönderen adı zorunlu."); return; }
    if (!form.banka.trim()) { setHata("Banka adı zorunlu."); return; }
    if (!form.tutar || Number(form.tutar) <= 0) { setHata("Geçerli bir tutar girin."); return; }

    const yeni = [{
      id: Date.now(),
      ...form,
      tarih: new Date().toISOString()
    }, ...kayitlar];

    setKayitlar(yeni);
    ls.yaz(key, yeni);
    setMesaj("Havale bildiriminiz alındı. En kısa sürede kontrol edilecektir.");
    setForm({ siparisNo: "", gonderenAd: `${user?.ad || ""} ${user?.soyad || ""}`.trim(), banka: "", tutar: "", aciklama: "" });
  };

  return (
    <div>
      <div style={ps.ustBar}><p style={ps.altBaslik}>EFT / Havale ile yaptığınız ödeme için bildirim bırakın</p></div>

      <form style={fs.kart} onSubmit={kaydet}>
        {hata && <div style={fs.hataKutu}><Icon name="bx bx-error-circle" /> {hata}</div>}
        {mesaj && <div style={fs.basariKutu}><Icon name="bx bx-check-circle" /> {mesaj}</div>}

        <label style={fs.label}>SİPARİŞ NO *</label>
        <input value={form.siparisNo} onChange={(e) => setForm({ ...form, siparisNo: e.target.value })} style={fs.input} />

        <label style={fs.label}>GÖNDEREN ADI *</label>
        <input value={form.gonderenAd} onChange={(e) => setForm({ ...form, gonderenAd: e.target.value })} style={fs.input} />

        <label style={fs.label}>BANKA *</label>
        <input value={form.banka} onChange={(e) => setForm({ ...form, banka: e.target.value })} style={fs.input} placeholder="Örn: Ziraat Bankası" />

        <label style={fs.label}>TUTAR *</label>
        <input type="number" min="0" step="0.01" value={form.tutar} onChange={(e) => setForm({ ...form, tutar: e.target.value })} style={fs.input} />

        <label style={fs.label}>AÇIKLAMA</label>
        <textarea value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} style={{ ...fs.input, minHeight: "90px", resize: "vertical" }} />

        <button type="submit" style={fs.submitBtn}><Icon name="bx bx-send" /> Bildirim Gönder</button>
      </form>

      <div style={ps.havaleKutu}>
        <div style={ps.havaleBilgiBaslik}><Icon name="bx bx-info-circle" /> BİLGİ</div>
        <div style={ps.havaleBilgi}>
          Havale/EFT ödemelerinizde açıklama alanına sipariş numaranızı yazmayı unutmayın.
          Bildiriminiz kontrol edildikten sonra siparişiniz onaylanır.
        </div>
      </div>

      {kayitlar.length > 0 && (
        <div style={{ marginTop: "18px" }}>
          <p style={{ ...ps.altBaslik, marginBottom: "10px" }}>Geçmiş havale bildirimleri</p>
          {kayitlar.map((k) => (
            <div key={k.id} style={ps.havaleGecmisKart}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <strong style={{ color: KAHVE }}>Sipariş #{k.siparisNo}</strong>
                <span style={{ color: "#888", fontSize: "12px" }}>{formatTarih(k.tarih)}</span>
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#444", lineHeight: 1.6 }}>
                <div><strong>Gönderen:</strong> {k.gonderenAd}</div>
                <div><strong>Banka:</strong> {k.banka}</div>
                <div><strong>Tutar:</strong> {formatPara(k.tutar)}</div>
                {k.aciklama && <div><strong>Açıklama:</strong> {k.aciklama}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FiyatAlarm({ userId }) {
  const key = useMemo(() => lsKey(userId, "fiyat_alarm"), [userId]);
  const [liste, setListe] = useState(() => ls.oku(key));
  const [form, setForm] = useState({ urunAdi: "", hedefFiyat: "", link: "" });
  const [hata, setHata] = useState("");

  const ekle = (e) => {
    e.preventDefault();
    setHata("");
    if (!form.urunAdi.trim()) { setHata("Ürün adı zorunlu."); return; }
    if (!form.hedefFiyat || Number(form.hedefFiyat) <= 0) { setHata("Geçerli hedef fiyat girin."); return; }

    const yeni = [...liste, {
      id: Date.now(),
      urunAdi: form.urunAdi.trim(),
      hedefFiyat: Number(form.hedefFiyat),
      link: form.link.trim(),
      tarih: new Date().toISOString()
    }];
    setListe(yeni);
    ls.yaz(key, yeni);
    setForm({ urunAdi: "", hedefFiyat: "", link: "" });
  };

  const sil = (id) => {
    const yeni = liste.filter((x) => x.id !== id);
    setListe(yeni);
    ls.yaz(key, yeni);
  };

  return (
    <div>
      <div style={ps.ustBar}><p style={ps.altBaslik}>İstediğiniz fiyat seviyesini takip edin</p></div>

      <form style={fs.kart} onSubmit={ekle}>
        {hata && <div style={fs.hataKutu}><Icon name="bx bx-error-circle" /> {hata}</div>}

        <label style={fs.label}>ÜRÜN ADI *</label>
        <input value={form.urunAdi} onChange={(e) => setForm({ ...form, urunAdi: e.target.value })} style={fs.input} />

        <label style={fs.label}>HEDEF FİYAT *</label>
        <input type="number" min="0" step="0.01" value={form.hedefFiyat} onChange={(e) => setForm({ ...form, hedefFiyat: e.target.value })} style={fs.input} />

        <label style={fs.label}>ÜRÜN LİNKİ</label>
        <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} style={fs.input} placeholder="https://..." />

        <button type="submit" style={fs.submitBtn}><Icon name="bx bx-plus" /> Alarm Ekle</button>
      </form>

      <div style={{ marginTop: "18px" }}>
        {!liste.length ? (
          <EmptyState
            ikon="bx bx-money-withdraw"
            baslik="Fiyat alarm listeniz boş"
            alt="Takip etmek istediğiniz ürünleri ve hedef fiyatı ekleyin."
          />
        ) : liste.map((x) => (
          <div key={x.id} style={ps.alarmSatir}>
            <div style={{ flex: 1 }}>
              <p style={ps.alarmAd}><Icon name="bx bx-money" /> {x.urunAdi}</p>
              <p style={ps.alarmTarih}>Hedef fiyat: {formatPara(x.hedefFiyat)} · Eklenme: {formatTarih(x.tarih)}</p>
              {x.link && <a href={x.link} target="_blank" rel="noreferrer" style={ps.alarmLink}><Icon name="bx bx-link-external" /> Ürüne git</a>}
            </div>
            <button style={ps.btnSil} onClick={() => sil(x.id)}><Icon name="bx bx-trash" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profil({ user }) {
  return (
    <div style={ps.profilKart}>
      <div style={ps.profilAvatarBuyuk}>
        {user.ad?.charAt(0).toUpperCase()}{user.soyad?.charAt(0).toUpperCase()}
      </div>

      <div style={ps.profilGrid}>
        <div style={ps.profilAlan}>
          <span style={ps.profilEtiket}>AD</span>
          <span style={ps.profilDeger}>{user.ad || "-"}</span>
        </div>
        <div style={ps.profilAlan}>
          <span style={ps.profilEtiket}>SOYAD</span>
          <span style={ps.profilDeger}>{user.soyad || "-"}</span>
        </div>
        <div style={ps.profilAlan}>
          <span style={ps.profilEtiket}>E-POSTA</span>
          <span style={ps.profilDeger}>{user.email || "-"}</span>
        </div>
        <div style={ps.profilAlan}>
          <span style={ps.profilEtiket}>KULLANICI ID</span>
          <span style={ps.profilDeger}>{user.id || "-"}</span>
        </div>
      </div>

      <div style={ps.profilBilgi}>
        <Icon name="bx bx-info-circle" />
        Profil bilgileri şimdilik sadece görüntüleniyor. Düzenleme istersen ayrıca ekleriz.
      </div>
    </div>
  );
}

export default function Hesabim() {
  const { user, cikisYap, yukleniyor } = useAuth();
  const navigate = useNavigate();
  const [aktifTab, setAktifTab] = useState("dashboard");
  const [seciliSiparis, setSeciliSiparis] = useState(null);

  useEffect(() => {
    if (!yukleniyor && !user) navigate("/giris-yap");
  }, [user, yukleniyor, navigate]);

  const handleCikis = async () => {
    await cikisYap();
    navigate("/");
  };

  if (yukleniyor) {
    return (
      <div style={ps.yukleniyor}>
        <div style={ps.spinner}></div>
        <p>Hesabınız kontrol ediliyor...</p>
      </div>
    );
  }
  if (!user) return null;

  const aktifMenu = MENU.find((m) => m.id === aktifTab);
  const baslikMetni =
    aktifTab === "dashboard" ? "Hesabım" :
    aktifTab === "profil" ? "Profil Bilgilerim" :
    aktifMenu?.ad || "Hesabım";

  return (
    <div style={ps.sayfa}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .siparis-kart:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(93,64,55,0.12) !important; }
        .tab-btn:hover { background: #f0ebe0 !important; }
        .dash-kart:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(46,125,50,0.15) !important; }
        .dash-kart:hover > div:first-child { background: #2e7d32 !important; }
        .hesabim-sayfa i.bx { line-height: 1; }
      `}</style>

      <div style={ps.konteyner} className="hesabim-sayfa">
        <aside style={ps.solPanel}>
          <div style={ps.avatar}>
            <div style={ps.avatarDaire}>
              {user.ad?.charAt(0).toUpperCase()}{user.soyad?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={ps.avatarAd}>{user.ad} {user.soyad}</p>
              <p style={ps.avatarEmail}>{user.email}</p>
            </div>
          </div>

          <nav style={ps.nav}>
            <button
              className="tab-btn"
              style={{ ...ps.navBtn, ...(aktifTab === "dashboard" ? ps.navBtnAktif : {}) }}
              onClick={() => setAktifTab("dashboard")}
            >
              <Icon name="bx bx-home" style={ps.navIkon} /> Hesabım Anasayfa
            </button>

            {MENU.map((m) => (
              <button
                key={m.id}
                className="tab-btn"
                style={{ ...ps.navBtn, ...(aktifTab === m.id ? ps.navBtnAktif : {}) }}
                onClick={() => setAktifTab(m.id)}
              >
                <Icon name={m.ikon} style={ps.navIkon} /> {m.ad}
              </button>
            ))}

            <button
              className="tab-btn"
              style={{ ...ps.navBtn, ...(aktifTab === "profil" ? ps.navBtnAktif : {}) }}
              onClick={() => setAktifTab("profil")}
            >
              <Icon name="bx bx-user" style={ps.navIkon} /> Profil Bilgilerim
            </button>
          </nav>

          <button style={ps.cikisBtn} onClick={handleCikis}>
            <Icon name="bx bx-log-out" style={ps.navIkon} /> Çıkış Yap
          </button>
        </aside>

        <main style={ps.icerik}>
          <div style={ps.icerikBaslik}>
            {aktifTab !== "dashboard" && (
              <button style={ps.geriBtn} onClick={() => setAktifTab("dashboard")}>
                <Icon name="bx bx-left-arrow-alt" /> Ana Panele Dön
              </button>
            )}
            <h2 style={ps.baslik}>{baslikMetni}</h2>
            {aktifTab === "dashboard" && (
              <p style={ps.altBaslik}>Hoş geldiniz {user.ad}! İşlem yapmak için aşağıdan bir bölüm seçin.</p>
            )}
          </div>

          {aktifTab === "dashboard" && (
            <Dashboard onSecim={setAktifTab} onSiparisTakipAc={(id) => setSeciliSiparis(id)} />
          )}
          {aktifTab === "siparisler"  && <Siparislerim onDetayAc={setSeciliSiparis} />}
          {aktifTab === "favoriler"   && <Favorilerim userId={user.id} />}
          {aktifTab === "adresler"    && <Adreslerim />}
          {aktifTab === "stok_alarm"  && <StokAlarm userId={user.id} />}
          {aktifTab === "havale"      && <HavaleBildirimi userId={user.id} user={user} />}
          {aktifTab === "fiyat_alarm" && <FiyatAlarm userId={user.id} />}
          {aktifTab === "profil"      && <Profil user={user} />}
        </main>
      </div>

      {seciliSiparis && (
        <SiparisDetayModal
          siparisId={seciliSiparis}
          onKapat={() => setSeciliSiparis(null)}
        />
      )}
    </div>
  );
}

const YESIL = "#4CAF50";
const YESIL_KOYU = "#2e7d32";
const KAHVE = "#5d4037";

const ds = {
  takipKutu: {
    backgroundColor: "#fff", borderRadius: "12px",
    border: "2px solid #222", padding: "18px 22px", marginBottom: "24px"
  },
  takipBaslik: {
    display: "flex", alignItems: "center", gap: "10px",
    fontSize: "16px", fontWeight: "800", color: "#222",
    letterSpacing: "1px", marginBottom: "14px"
  },
  takipIkon: { fontSize: "22px" },
  takipForm: {
    display: "flex", border: "1px solid #ccc", borderRadius: "4px",
    overflow: "hidden"
  },
  takipInput: {
    flex: 1, padding: "14px 18px", border: "none",
    fontSize: "15px", outline: "none", color: "#333"
  },
  takipBtn: {
    padding: "0 38px", background: YESIL, color: "#fff",
    border: "none", fontSize: "14px", fontWeight: "700",
    letterSpacing: "1px", cursor: "pointer"
  },
  takipHata: { color: "#c62828", fontSize: "13px", marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px"
  },
  kart: {
    backgroundColor: "#fff", border: "none", borderRadius: "4px",
    padding: "28px 16px 24px", cursor: "pointer", textAlign: "center",
    transition: "all 0.25s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
  },
  kartIkonDaire: {
    width: "72px", height: "72px", borderRadius: "50%",
    backgroundColor: YESIL, margin: "0 auto 18px",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.25s"
  },
  kartIkon: { fontSize: "34px", color: "#fff" },
  kartAd: {
    fontSize: "13px", fontWeight: "800", color: "#666",
    letterSpacing: "0.5px", lineHeight: 1.4
  }
};

const ms = {
  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 1000, display: "flex", justifyContent: "flex-end",
    animation: "fadeIn 0.2s ease"
  },
  panel: {
    width: "100%", maxWidth: "520px", backgroundColor: "#fff",
    height: "100%", overflowY: "auto", display: "flex", flexDirection: "column",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.15)"
  },
  panelBaslik: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "28px 28px 20px", borderBottom: "1px solid #f0ebe0",
    backgroundColor: "#f8f5eb", position: "sticky", top: 0, zIndex: 10
  },
  modalEtiket: { fontSize: "11px", fontWeight: "800", color: "#a68b6d", letterSpacing: "1.5px" },
  siparisNo: { margin: "4px 0 0", fontSize: "22px", fontWeight: "900", color: KAHVE },
  kapat: {
    background: "none", border: "none", color: "#a68b6d",
    cursor: "pointer", padding: "4px 8px", borderRadius: "8px", lineHeight: 1,
    display: "flex", alignItems: "center"
  },
  scrollAlan: { padding: "24px 28px", flex: 1 },
  bilgi: { textAlign: "center", color: "#a68b6d", padding: "40px 0", fontSize: "15px" },
  ozetSatir: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "7px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "700"
  },
  tarihKucuk: { fontSize: "13px", color: "#a68b6d" },
  blok: { marginBottom: "20px", padding: "16px", backgroundColor: "#faf8f3", borderRadius: "16px" },
  blokBaslik: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "800", color: "#a68b6d", letterSpacing: "1px", marginBottom: "10px" },
  blokIcerik: { margin: 0, fontSize: "14px", color: KAHVE, lineHeight: 1.6 },
  urunListesi: { display: "flex", flexDirection: "column", gap: "10px" },
  urunSatir: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  urunAd: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: KAHVE },
  urunAdet: {
    backgroundColor: KAHVE, color: "#fff", borderRadius: "8px",
    padding: "2px 8px", fontSize: "12px", fontWeight: "700", flexShrink: 0
  },
  urunFiyat: { fontWeight: "700", color: KAHVE, fontSize: "14px", whiteSpace: "nowrap" },
  toplamSatir: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "18px 20px", backgroundColor: KAHVE, borderRadius: "16px", marginTop: "8px"
  },
  toplamLabel: { color: "#d2b48c", fontSize: "13px", fontWeight: "700" },
  toplamTutar: { color: "#fff", fontSize: "20px", fontWeight: "900" }
};

const fs = {
  kart: {
    backgroundColor: "#fff", borderRadius: "18px", padding: "22px",
    boxShadow: "0 2px 10px rgba(93,64,55,0.06)"
  },
  label: {
    display: "block", color: KAHVE, fontSize: "12px",
    fontWeight: "800", marginTop: "16px", marginBottom: "6px", letterSpacing: "1px"
  },
  input: {
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    border: "1.5px solid #e0d5c1", backgroundColor: "#fdfdfd",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
    color: "#333", marginBottom: "4px", fontFamily: "inherit"
  },
  submitBtn: {
    width: "100%", padding: "14px", marginTop: "24px",
    background: YESIL, color: "#fff", border: "none",
    borderRadius: "12px", fontSize: "14px", fontWeight: "800",
    cursor: "pointer", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: "8px"
  },
  formSatir: {
    display: "flex", gap: "10px", flexWrap: "wrap",
    alignItems: "center", marginTop: "16px"
  },
  hataKutu: {
    padding: "12px 16px", backgroundColor: "#fff3f3",
    border: "1px solid #ffcdd2", borderRadius: "12px",
    color: "#c62828", fontSize: "14px", marginBottom: "12px",
    display: "flex", alignItems: "center", gap: "8px"
  },
  basariKutu: {
    padding: "12px 16px", backgroundColor: "#e8f5e9",
    border: "1px solid #a5d6a7", borderRadius: "12px",
    color: "#2e7d32", fontSize: "14px", marginBottom: "12px",
    display: "flex", alignItems: "center", gap: "8px"
  }
};

const ps = {
  sayfa: { backgroundColor: "#f8f5eb", minHeight: "100vh", padding: "40px 16px", fontFamily: "'Segoe UI', sans-serif" },
  konteyner: { maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" },

  solPanel: {
    width: "260px", flexShrink: 0, backgroundColor: "#fff",
    borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px rgba(93,64,55,0.07)",
    display: "flex", flexDirection: "column", gap: "8px",
    position: "sticky", top: "100px"
  },
  avatar: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px", paddingBottom: "20px", borderBottom: "1px solid #f0ebe0" },
  avatarDaire: {
    width: "52px", height: "52px", borderRadius: "50%",
    backgroundColor: YESIL, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "900", flexShrink: 0
  },
  avatarAd: { margin: 0, fontSize: "15px", fontWeight: "800", color: KAHVE },
  avatarEmail: { margin: "3px 0 0", fontSize: "12px", color: "#a68b6d", wordBreak: "break-all" },
  nav: { display: "flex", flexDirection: "column", gap: "4px" },
  navBtn: {
    display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px",
    borderRadius: "12px", border: "none", backgroundColor: "transparent",
    color: KAHVE, fontSize: "13.5px", fontWeight: "600", cursor: "pointer",
    textAlign: "left", transition: "all 0.2s"
  },
  navBtnAktif: { backgroundColor: "#e8f5e9", color: YESIL_KOYU, fontWeight: "800" },
  navIkon: { fontSize: "18px" },
  cikisBtn: {
    marginTop: "14px", padding: "12px 16px", borderRadius: "12px",
    border: "1px solid #ffcdd2", backgroundColor: "#fff5f5",
    color: "#c62828", fontSize: "14px", fontWeight: "700", cursor: "pointer",
    textAlign: "left", display: "flex", alignItems: "center", gap: "10px"
  },

  icerik: { flex: 1, minWidth: "320px" },
  icerikBaslik: { marginBottom: "24px" },
  baslik: { margin: "0 0 4px", fontSize: "26px", fontWeight: "900", color: KAHVE },
  altBaslik: { margin: 0, fontSize: "14px", color: "#a68b6d" },
  geriBtn: {
    background: "none", border: "none", color: YESIL_KOYU,
    fontSize: "13px", fontWeight: "700", cursor: "pointer",
    padding: "0 0 8px", display: "inline-flex", alignItems: "center", gap: "4px"
  },

  ustBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" },
  ekleBtn: {
    padding: "12px 22px", background: YESIL, color: "#fff",
    border: "none", borderRadius: "12px", fontSize: "14px",
    fontWeight: "700", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px"
  },

  yukleniyor: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px", color: "#a68b6d" },
  spinnerKutu: { textAlign: "center", padding: "60px 0" },
  spinner: {
    width: "36px", height: "36px", borderRadius: "50%",
    border: "3px solid #f0ebe0", borderTopColor: YESIL,
    animation: "spin 0.8s linear infinite", display: "inline-block"
  },
  bilgiYazi: { marginTop: "16px", color: "#a68b6d", fontSize: "14px" },

  bos: { textAlign: "center", padding: "80px 20px", backgroundColor: "#fff", borderRadius: "24px" },
  bosIkon: { fontSize: "64px", marginBottom: "16px", color: "#d2b48c", lineHeight: 1 },
  bosBaslik: { fontSize: "20px", fontWeight: "800", color: KAHVE, margin: "0 0 8px" },
  bosAlt: { fontSize: "14px", color: "#a68b6d", margin: "0 0 28px" },
  alisverisBtn: {
    padding: "14px 32px", backgroundColor: YESIL, color: "#fff",
    border: "none", borderRadius: "14px", fontSize: "15px",
    fontWeight: "700", cursor: "pointer"
  },
  hataKutu: { padding: "16px 20px", backgroundColor: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "14px", color: "#c62828", fontSize: "14px" },

  siparisListesi: { display: "flex", flexDirection: "column", gap: "14px" },
  siparisKart: {
    backgroundColor: "#fff", borderRadius: "16px", padding: "20px 22px",
    boxShadow: "0 2px 10px rgba(93,64,55,0.06)", cursor: "pointer",
    transition: "all 0.2s ease", border: "1px solid transparent"
  },
  kartUst: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" },
  siparisNoEtiket: { fontSize: "11px", fontWeight: "700", color: "#a68b6d", letterSpacing: "1px" },
  siparisNo: { margin: "4px 0 0", fontSize: "20px", fontWeight: "900", color: KAHVE },
  durumBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "30px", fontSize: "13px", fontWeight: "700"
  },
  kartAlt: { display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" },
  kartAksiyonlari: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  kartBilgi: { display: "flex", flexDirection: "column", gap: "2px" },
  kartEtiket: { fontSize: "11px", fontWeight: "700", color: "#a68b6d", letterSpacing: "0.5px", display: "inline-flex", alignItems: "center", gap: "4px" },
  kartDeger: { fontSize: "14px", color: KAHVE, fontWeight: "600" },
  pdfButon: {
    padding: "10px 14px", background: "#eef7ee", color: YESIL_KOYU,
    border: "1px solid #cfe6cf", borderRadius: "10px", fontSize: "13px",
    fontWeight: "700", cursor: "pointer", display: "inline-flex",
    alignItems: "center", gap: "6px"
  },
  pdfIndirButon: {
    padding: "10px 14px", background: YESIL, color: "#fff",
    border: "1px solid #3f9143", borderRadius: "10px", fontSize: "13px",
    fontWeight: "700", cursor: "pointer", display: "inline-flex",
    alignItems: "center", gap: "6px"
  },
  detayOk: { marginLeft: "auto", fontSize: "13px", color: YESIL_KOYU, fontWeight: "700", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "4px" },

  listeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" },

  favKart: { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 10px rgba(93,64,55,0.06)" },
  favGorsel: { width: "100%", height: "160px", objectFit: "cover" },
  favIcerik: { padding: "16px" },
  favAd: { margin: "0 0 8px", fontSize: "15px", fontWeight: "800", color: KAHVE },
  favFiyat: { margin: "0 0 12px", fontSize: "16px", fontWeight: "800", color: YESIL_KOYU },
  favButonlar: { display: "flex", gap: "8px" },
  favIncele: { flex: 1, padding: "8px 12px", background: YESIL, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" },
  favSil: { flex: 1, padding: "8px 12px", background: "#fff5f5", color: "#c62828", border: "1px solid #ffcdd2", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" },

  adresKart: { backgroundColor: "#fff", borderRadius: "16px", padding: "18px", boxShadow: "0 2px 10px rgba(93,64,55,0.06)" },
  adresBaslik: { fontSize: "15px", fontWeight: "800", color: KAHVE, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" },
  adresMetin: { margin: "0 0 14px", fontSize: "14px", color: "#666", lineHeight: 1.5 },
  adresButonlar: { display: "flex", gap: "8px" },
  btnDuzenle: { flex: 1, padding: "8px 12px", background: "#f8f5eb", color: KAHVE, border: "1px solid #e0d5c1", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" },
  btnSil: { flex: "0 0 auto", padding: "8px 14px", background: "#fff5f5", color: "#c62828", border: "1px solid #ffcdd2", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" },

  alarmSatir: {
    display: "flex", alignItems: "center", gap: "12px",
    backgroundColor: "#fff", borderRadius: "12px", padding: "14px 18px",
    marginBottom: "10px", boxShadow: "0 2px 8px rgba(93,64,55,0.05)"
  },
  alarmAd: { margin: 0, fontSize: "15px", fontWeight: "700", color: KAHVE, display: "flex", alignItems: "center", gap: "6px" },
  alarmTarih: { margin: "4px 0 0", fontSize: "12px", color: "#999" },
  alarmLink: { fontSize: "12px", color: YESIL_KOYU, textDecoration: "none", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" },

  havaleKutu: { padding: "18px 20px", backgroundColor: "#e3f2fd", borderRadius: "14px", marginTop: "16px" },
  havaleBilgiBaslik: { fontSize: "13px", fontWeight: "800", color: "#1565c0", marginBottom: "10px", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" },
  havaleBilgi: { fontSize: "14px", color: "#333", lineHeight: 1.7 },
  havaleGecmisKart: { backgroundColor: "#fff", borderRadius: "12px", padding: "14px 18px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(93,64,55,0.05)" },

  profilKart: { backgroundColor: "#fff", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 20px rgba(93,64,55,0.07)" },
  profilAvatarBuyuk: {
    width: "80px", height: "80px", borderRadius: "50%",
    backgroundColor: YESIL, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "28px", fontWeight: "900", marginBottom: "24px"
  },
  profilGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" },
  profilAlan: { display: "flex", flexDirection: "column", gap: "6px", padding: "16px", backgroundColor: "#f8f5eb", borderRadius: "14px" },
  profilEtiket: { fontSize: "11px", fontWeight: "800", color: "#a68b6d", letterSpacing: "1.5px" },
  profilDeger: { fontSize: "16px", fontWeight: "700", color: KAHVE },
  profilBilgi: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "14px 18px", backgroundColor: "#e8f5e9", borderRadius: "12px",
    fontSize: "13px", color: "#2e7d32"
  }
};
