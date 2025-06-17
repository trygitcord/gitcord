import { HeroSection } from "@/components/landing/hero";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="h-92"></div>
        <Footer />
      </div>
    </div>
  );
}
