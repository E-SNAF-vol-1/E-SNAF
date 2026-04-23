import { useEffect, useState } from "react";

function weatherCodeText(code) {
  const map = {
    0: "Açık",
    1: "Az bulutlu",
    2: "Parçalı bulutlu",
    3: "Bulutlu",
    45: "Sisli",
    48: "Kırağı sis",
    51: "Hafif çiseleme",
    53: "Çiseleme",
    55: "Yoğun çiseleme",
    61: "Hafif yağmur",
    63: "Yağmur",
    65: "Şiddetli yağmur",
    71: "Hafif kar",
    73: "Kar",
    75: "Yoğun kar",
    80: "Sağanak",
    81: "Kuvvetli sağanak",
    82: "Şiddetli sağanak",
    95: "Fırtına"
  };

  return map[code] || `Kod: ${code}`;
}

export default function HavaDurumu() {
  const [durum, setDurum] = useState("Yükleniyor...");
  const [sicaklik, setSicaklik] = useState("...");
  const [ruzgar, setRuzgar] = useState("...");
  const [hata, setHata] = useState("");

  const veriGetir = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://esnaf.apps.srv.aykutdurgut.com.tr/api/weather?lat=${lat}&lon=${lon}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mesaj || "Hava durumu alınamadı");
      }

      setDurum(weatherCodeText(data.current.weather_code));
      setSicaklik(`${data.current.temperature_2m}°C`);
      setRuzgar(`${data.current.wind_speed_10m} km/s`);
      setHata("");
    } catch (err) {
      console.error("hava durumu hata:", err);
      setHata("Hava durumu alınamadı");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      veriGetir(41.0082, 28.9784);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        veriGetir(position.coords.latitude, position.coords.longitude);
      },
      () => {
        veriGetir(41.0082, 28.9784);
      }
    );
  }, []);

  return (
    <div className="w-full bg-[#f5efe6] border border-[#e4dacb] rounded-xl px-5 py-3 text-[#5a4a42] shadow-sm">
      {hata ? (
        <div className="text-sm text-red-600 font-medium">{hata}</div>
      ) : (
        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
          <div className="font-semibold">🌤 Hava Durumu</div>
          <div>
            <span className="text-[#8b776d] mr-2">Durum:</span>
            <strong>{durum}</strong>
          </div>
          <div>
            <span className="text-[#8b776d] mr-2">Sıcaklık:</span>
            <strong>{sicaklik}</strong>
          </div>
          <div>
            <span className="text-[#8b776d] mr-2">Rüzgar:</span>
            <strong>{ruzgar}</strong>
          </div>
        </div>
      )}
    </div>
  );
}