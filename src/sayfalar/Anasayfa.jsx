import { useState } from "react";
import { urunler } from "../data/Urunler";
import UrunKartlari from "../components/UrunKartlari";

export default function Anasayfa() {
  const [search, setSearch] = useState("");

  const filtreliUrunler = urunler.filter((urun) =>
    urun.isim.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ARAMA ÇUBUĞU */}

      <div className="flex justify-center py-6 bg-[#f5f5f5]">
        <input
          type="text"
          placeholder="Ürün, kategori veya marka ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[400px] px-5 py-3 rounded-full border border-[#d2b48c] outline-none focus:ring-2 focus:ring-[#5d4037] text-sm"
        />
      </div>

      {/* ÜRÜNLER */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-[#f5f5f5] p-10 min-h-screen">
        {filtreliUrunler.map((urun) => {
          return <UrunKartlari key={urun.id} item={urun} />;
        })}
      </div>
    </>
  );
}
