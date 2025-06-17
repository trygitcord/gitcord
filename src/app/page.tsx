import { HeroSection } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="max-w-6xl mx-auto">
          <Marquee />
        </div>
        <div className="h-92"></div>
        <Footer />
      </div>
    </div>
  );
}
