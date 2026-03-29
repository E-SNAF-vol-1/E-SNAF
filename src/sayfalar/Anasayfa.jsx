import Doviz from "../components/Doviz";

export default function Anasayfa() {
    return (
        <div className="bg-[#f5f5f5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <iframe
                    src="/angular-urun/index.html"
                    title="Angular Urun Listeleme"
                    className="w-full h-[1400px] border-0 rounded-2xl bg-white"
                />
            </div>
            <div style={{
                position: "absolute",
                top: "20px",
                right: "20px"
            }}>
                <Doviz />
            </div>
        </div>
    );
}