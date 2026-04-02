const https = require("https");

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

exports.getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ mesaj: "lat ve lon zorunlu" });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
      lat
    )}&longitude=${encodeURIComponent(
      lon
    )}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;

    const data = await getJson(url);

    if (!data || !data.current) {
      return res.status(500).json({ mesaj: "Hava durumu alınamadı" });
    }

    res.json({
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      current: data.current
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Hava durumu alınamadı" });
  }
};