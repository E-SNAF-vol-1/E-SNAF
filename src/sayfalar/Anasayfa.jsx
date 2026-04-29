import UstBilgiBar from "../components/UstBilgiBar";
import AngularUrunEmbed from "../components/AngularUrunEmbed";

export default function Anasayfa() {
  return (
    <div className="bg-brand-bg min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <UstBilgiBar />

        <AngularUrunEmbed />
      </div>
    </div>
  );
}