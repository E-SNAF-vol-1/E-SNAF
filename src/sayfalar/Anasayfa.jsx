import UstBilgiBar from "../components/UstBilgiBar";

export default function Anasayfa() {
  return (
    
    <div className="bg-brand-bg min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 pt-6">
     
        <div className="bg-brand-card rounded-[2.5rem] overflow-hidden shadow-sm border border-black/5">
          <UstBilgiBar />

          <iframe
            src="/angular-urun/index.html"
            title="Angular Urun Listeleme"
            className="w-full h-[1400px] border-0 bg-brand-card transition-colors duration-500"
          />
        </div>
      </div>
    </div>
  );
}