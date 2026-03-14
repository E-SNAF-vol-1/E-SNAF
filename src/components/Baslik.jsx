import { useNavigate } from "react-router-dom";

export default function Baslik() {
    const navigate = useNavigate();

    const buttonStyle = "flex items-center justify-center gap-1 px-1 py-2 rounded-xl border border-transparent hover:bg-[#5d4037] hover:text-[#f5f5dc] transition-all duration-300 cursor-pointer min-w-[130px]";

    return (
        <header className="sticky top-0 z-50 bg-[#ede6ca] border-b border-[#d2b48c] shadow-sm text-[#5d4037]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-15 gap-4">

                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
                        <h1 className="text-2xl md:text-3xl font-serif tracking-[0.15em] font-bold uppercase hover:tracking-[0.20em] transition-all duration-500">
                            E-SNAF
                        </h1>
                    </div>


                    <div className="hidden md:flex flex-grow max-w-xl relative">
                        <input
                            type="text"
                            placeholder="Aradığınız ürün, kategori veya markayı yazınız"
                            className="w-full bg-[#fdfcf7] border border-[#d2b48c] rounded-lg py-2.5 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-[#5d4037] text-sm placeholder:text-[#5d4037]/50" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-[#5d4037]/10 transition-colors">
                            <i className='bx bx-search text-2xl opacity-70 text-[#5d4037]'></i>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">


                        <div className={buttonStyle}>
                            <i className='bx bx-user text-2xl'></i>
                            <span className="text-sm font-semibold hidden sm:inline">Giriş Yap/Kaydol</span>
                        </div>


                        <div className={buttonStyle}>
                            <i className='bx bx-heart text-2xl'></i>
                            <span className="text-sm font-semibold hidden sm:inline">Favorilerim</span>
                        </div>


                        <div
                            onClick={() => navigate("/sepet")}
                            className={`${buttonStyle} `}>
                            <i className='bx bx-cart text-2xl'></i>
                            <span className="text-sm font-semibold hidden sm:inline">Sepetim</span>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}