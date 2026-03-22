import { useSepet } from "../context/SepetContext.jsx";

export default function UrunKartlari({ item, viewMode = "grid" }) {
  const { dispatch } = useSepet();

  const handleSepeteEkle = () => {
    dispatch({ type: "SEPETEEKLE", payload: item });
  };

  if (viewMode === "list") {
    return (
      <div className="w-full flex items-center justify-between gap-4 p-4 bg-white border border-[#d2b48c]/30 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-xl bg-[#f8f8f8] shrink-0">
            <img
              className="w-20 h-20 object-contain"
              src={item.resim}
              alt={item.isim}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#5d4037] truncate">
              {item.isim}
            </h3>
            <p className="text-sm text-[#5d4037]/70">{item.kategori}</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">
              {item.fiyat} TL
            </p>
          </div>
        </div>

        <button
          onClick={handleSepeteEkle}
          className="px-4 py-2 bg-[#5d4037] text-[#f5f5dc] rounded-full font-bold text-xs uppercase tracking-[0.08em] hover:bg-[#d2b48c] hover:text-[#5d4037] transition-all duration-300 cursor-pointer shrink-0"
        >
          Sepete Ekle
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-[#ede6ca]/30 border border-[#d2b48c]/20 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group w-full">
      <div className="flex h-48 items-center justify-center w-full overflow-hidden rounded-2xl bg-transparent">
        <img
          className="w-40 h-40 object-contain group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          src={item.resim}
          alt={item.isim}
        />
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-base font-black uppercase tracking-tight text-[#5d4037] line-clamp-1">
          {item.isim}
        </h3>
        <p className="text-xs font-light text-[#5d4037]/70 leading-relaxed">
          Kategori: {item.kategori}
        </p>
        <p className="text-lg font-medium text-slate-900">{item.fiyat} TL</p>
      </div>

      <button
        onClick={handleSepeteEkle}
        className="w-full py-2.5 bg-[#5d4037] text-[#f5f5dc] rounded-full font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-[#d2b48c] hover:text-[#5d4037] transition-all duration-300 shadow-md hover:shadow-none cursor-pointer"
      >
        Sepete Ekle
      </button>
    </div>
  );
}