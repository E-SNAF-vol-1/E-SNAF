import { useEffect, useState } from "react";

function Doviz() {
  const [usd, setUsd] = useState("...");
  const [eur, setEur] = useState("...");

  const kurGetir = () => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        const tryRate = data.rates.TRY;
        const eurRate = data.rates.EUR;

        setUsd(tryRate.toFixed(2));
        setEur((tryRate / eurRate).toFixed(2));
      });
  };

  useEffect(() => {
    kurGetir();
    const interval = setInterval(kurGetir, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "#f5efe6",
      padding: "15px",
      borderRadius: "10px",
      width: "120px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      fontFamily: "Roboto"
    }}>
      <h3 style={{ marginBottom: "15px", color: "#5a4a42" }}>
        💱 Canlı Döviz
      </h3>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        padding: "8px",
        background: "#fff",
        borderRadius: "8px"
      }}>
         <span>USD</span>
  <strong>{usd} ₺</strong>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px",
        background: "#fff",
        borderRadius: "8px"
      }}>
        <span>EUR</span>
        <strong>{eur} ₺</strong>
      </div>
    </div>
  );
}

export default Doviz;