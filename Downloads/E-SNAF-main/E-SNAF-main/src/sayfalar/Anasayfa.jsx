import UstBilgiBar from "../components/UstBilgiBar";

export default function Anasayfa() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <UstBilgiBar />

          <iframe
            src="/angular-urun/index.html"
            title="Angular Urun Listeleme"
            className="w-full h-[1400px] border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}