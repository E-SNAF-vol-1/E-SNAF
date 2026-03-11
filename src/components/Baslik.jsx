import { useNavigate } from "react-router-dom"

export default function Baslik() {
    const navigate = useNavigate()

    return (

        <header className="flex justify-between items-center h-20 px-8 bg-[#ede6ca] border-b border-[#d2b48c] text-[#5d4037] shadow-sm sticky top-0 z-50">
            <div>
                <span onClick={() => navigate("/")}>
                    <h1 className="text-3xl font-serif tracking-[0.2em] text-[#5d4037] font-bold uppercase hover:tracking-[0.25em] transition-all duration-500 cursor-default cursor-pointer">E-SNAF</h1>
                </span>
            </div>

            <div>
                <span onClick={() => navigate("/sepet")} className="flex items-center gap-1 text-[#f5f5dc] bg-[#8d6e63] px-3 py-1.5 rounded-2xl hover:bg-[#5d4037] hover:scale-105 transition-all duration-300 cursor-pointer shadow-md">
                    <i className="bx bx-cart"></i>
                </span>
            </div>

        </header>
    )
}