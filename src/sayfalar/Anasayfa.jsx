import { useMemo, useState } from "react";
import { urunler } from "../data/Urunler";
import UrunKartlari from "../components/UrunKartlari";

export default function Anasayfa() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [selectedProductName, setSelectedProductName] = useState("Hepsi");
  const [selectedPriceRange, setSelectedPriceRange] = useState("Hepsi");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const categories = useMemo(() => {
    const cats = [...new Set(urunler.map((p) => p.kategori))];
    return ["Hepsi", ...cats];
  }, []);

  const productNames = useMemo(() => {
    let list = urunler;

    if (selectedCategory !== "Hepsi") {
      list = list.filter((p) => p.kategori === selectedCategory);
    }

    const names = [...new Set(list.map((p) => p.isim))];
    return ["Hepsi", ...names];
  }, [selectedCategory]);

  const priceRanges = [
    "Hepsi",
    "0-500 TL",
    "500-1000 TL",
    "1000-2000 TL",
    "2000+ TL",
  ];

  const matchesPriceRange = (price) => {
    switch (selectedPriceRange) {
      case "0-500 TL":
        return price >= 0 && price <= 500;
      case "500-1000 TL":
        return price > 500 && price <= 1000;
      case "1000-2000 TL":
        return price > 1000 && price <= 2000;
      case "2000+ TL":
        return price > 2000;
      default:
        return true;
    }
  };

  const filteredProducts = useMemo(() => {
    const s = searchText.trim().toLowerCase();

    const filtered = urunler.filter((p) => {
      const matchText =
        p.isim.toLowerCase().includes(s) ||
        p.kategori.toLowerCase().includes(s);

      const matchCategory =
        selectedCategory === "Hepsi" || p.kategori === selectedCategory;

      const matchProductName =
        selectedProductName === "Hepsi" || p.isim === selectedProductName;

      const matchPriceRange = matchesPriceRange(p.fiyat);

      return matchText && matchCategory && matchProductName && matchPriceRange;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-desc":
          return b.fiyat - a.fiyat;
        case "price-asc":
          return a.fiyat - b.fiyat;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [searchText, selectedCategory, selectedProductName, selectedPriceRange, sortBy]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedProductName("Hepsi");
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-3xl border border-[#d2b48c]/30 shadow-sm p-5 h-fit">
            <h3 className="text-lg font-bold text-[#5d4037] mb-4">Filtreler</h3>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Ara..."
                  className="w-full px-4 py-3 rounded-xl border border-[#d2b48c] outline-none focus:ring-2 focus:ring-[#5d4037]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5d4037] mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#d2b48c] bg-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5d4037] mb-2">
                  Ürün
                </label>
                <select
                  value={selectedProductName}
                  onChange={(e) => setSelectedProductName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#d2b48c] bg-white outline-none"
                >
                  {productNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5d4037] mb-2">
                  Fiyat Aralığı
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#d2b48c] bg-white outline-none"
                >
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5d4037] mb-2">
                  Sıralama
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#d2b48c] bg-white outline-none"
                >
                  <option value="newest">Yeniden Eskiye</option>
                  <option value="oldest">Eskiden Yeniye</option>
                  <option value="price-desc">Pahalıdan Ucuza</option>
                  <option value="price-asc">Ucuzdan Pahalıya</option>
                </select>
              </div>
            </div>
          </aside>

          <section>
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-full border transition ${
                    viewMode === "grid"
                      ? "bg-[#5d4037] text-white border-[#5d4037]"
                      : "bg-white text-[#5d4037] border-[#d2b48c]"
                  }`}
                >
                  Kare
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-full border transition ${
                    viewMode === "list"
                      ? "bg-[#5d4037] text-white border-[#5d4037]"
                      : "bg-white text-[#5d4037] border-[#d2b48c]"
                  }`}
                >
                  Liste
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#d2b48c]/30 p-10 text-center text-[#5d4037]">
                Sonuç yok.
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((urun) => (
                  <UrunKartlari key={urun.id} item={urun} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredProducts.map((urun) => (
                  <UrunKartlari key={urun.id} item={urun} viewMode="list" />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}