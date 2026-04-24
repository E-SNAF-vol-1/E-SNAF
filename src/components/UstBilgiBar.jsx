import { useEffect, useState } from "react";

function weatherCodeText(code) {
  const map = {
    0: "Açık", 1: "Az bulutlu", 2: "Parçalı bulutlu", 3: "Bulutlu",
    45: "Sisli", 48: "Kırağı sis", 51: "Hafif çiseleme", 53: "Çiseleme",
    55: "Yoğun çiseleme", 61: "Yağmur", 63: "Yağmur", 65: "Şiddetli yağmur",
    71: "Kar", 73: "Kar", 75: "Yoğun kar", 80: "Sağanak", 81: "Sağanak",
    82: "Şiddetli sağanak", 95: "Fırtına"
  };
  return map[code] || `Kod: ${code}`;
}

export default function UstBilgiBar() {
  const [usd, setUsd] = useState("...");
  const [eur, setEur] = useState("...");
  const [altin, setAltin] = useState(null);

  const [durum, setDurum] = useState("...");
  const [sicaklik, setSicaklik] = useState("...");
  const [ruzgar, setRuzgar] = useState("...");

  const kurGetir = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      const tryRate = data.rates.TRY;
      const eurRate = data.rates.EUR;

      setUsd(tryRate.toFixed(2));
      setEur((tryRate / eurRate).toFixed(2));

      const goldUsd = data.rates.XAU ? (1 / data.rates.XAU) : null;
      const gramAltin = goldUsd ? (goldUsd * tryRate / 31.1) : null;

      if (gramAltin) {
        setAltin(gramAltin.toFixed(2));
      }
    } catch (err) {
      console.error("Döviz alınamadı:", err);
    }
  };

  const havaGetir = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://esnaf.apps.srv.aykutdurgut.com.tr/api/weather?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setDurum(weatherCodeText(data.current.weather_code));
      setSicaklik(`${data.current.temperature_2m}°C`);
      setRuzgar(`${data.current.wind_speed_10m} km/s`);
    } catch (err) {
      console.error("Hava durumu alınamadı:", err);
    }
  };

  useEffect(() => {
    kurGetir();
    const interval = setInterval(kurGetir, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      havaGetir(41.0082, 28.9784);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { havaGetir(pos.coords.latitude, pos.coords.longitude); },
      () => { havaGetir(41.0082, 28.9784); }
    );
  }, []);

  return (
    /* bg-brand-card: Arka planı temanın kart rengi yapar.
       text-brand-text: Yazı rengini temanın ana yazı rengi yapar.
       border-brand-text/10: Kenarlığı yazı renginin %10 şeffaf hali yapar (çok şık durur).
    */
    <div className="w-full flex items-center justify-between px-6 py-2.5 text-[11px] bg-brand-card text-brand-text border-b border-brand-text/10 transition-colors duration-500">

      {/* SOL: HAVA */}
      <div className="flex items-center gap-5">
        <span className="font-bold uppercase tracking-wider text-brand-accent">🌤 Hava Durumu</span>

        <span className="opacity-20">|</span>

        <span className="flex gap-1.5">
          <span className="opacity-60">Durum:</span>
          <strong className="text-brand-accent">{durum}</strong>
        </span>

        <span className="flex gap-1.5">
          <span className="opacity-60">Sıcaklık:</span>
          <strong className="text-brand-accent">{sicaklik}</strong>
        </span>

        <span className="flex gap-1.5">
          <span className="opacity-60">Rüzgar:</span>
          <strong className="text-brand-accent">{ruzgar}</strong>
        </span>
      </div>

      {/* SAĞ: DÖVİZ */}
      <div className="flex items-center gap-5">
        <span className="font-bold uppercase tracking-wider text-brand-accent">💱 Döviz Kurları</span>

        <span className="opacity-20">|</span>

        <span className="flex gap-1.5">
          <span className="opacity-60">USD:</span>
          <strong className="text-brand-accent">{usd} ₺</strong>
        </span>

        <span className="flex gap-1.5">
          <span className="opacity-60">EUR:</span>
          <strong className="text-brand-accent">{eur} ₺</strong>
        </span>

        {altin && (
          <span className="flex gap-1.5">
            <span className="opacity-60">Altın (gr):</span>
            <strong className="text-brand-accent">{altin} ₺</strong>
          </span>
        )}
      </div>
    </div>
  );
}