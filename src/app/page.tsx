import { HeroSection } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Footer } from "@/components/ui/footer-section";
import { Faq3Demo } from "@/components/landing/faqs";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="max-w-6xl mx-auto">
          <Marquee />
        </div>
        <div className="flex items-center justify-center">
          <Faq3Demo />
        </div>
        <Footer />
      </div>
    </div>
  );
}
