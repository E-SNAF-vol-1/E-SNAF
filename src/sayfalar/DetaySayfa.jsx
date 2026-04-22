import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetayKarti from '../components/DetayKarti';

const DetaySayfa = () => {
  const { id } = useParams();
  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null); // Hata durumunu takip edelim

  useEffect(() => {
    setYukleniyor(true);
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Sunucu hatası: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Gelen ürün verisi:", data); // Konsola bakmayı unutma!
        setUrun(data);
        setYukleniyor(false);
      })
      .catch(err => {
        console.error("Ürün çekilirken hata oluştu:", err);
        setHata(err.message);
        setYukleniyor(false);
      });
  }, [id]);

  if (yukleniyor) return <div className="p-10 text-center text-xl">Ürün yükleniyor...</div>;

  // Eğer hata varsa beyaz ekran yerine hatayı görelim:
  if (hata) return <div className="p-10 text-center text-red-500 font-bold">Hata: {hata}</div>;

  if (!urun) return <div className="p-10 text-center">Ürün bulunamadı.</div>;

  return (
    <div className="sayfa-konteyner">
      <DetayKarti urun={urun} />
    </div>
  );
};

export default DetaySayfa;