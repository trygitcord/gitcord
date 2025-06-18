import { HeroSection } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Footer } from "@/components/landing/footer-section";
import { FaqSection } from "@/components/landing/faqs";
import { PricingSection } from "@/components/landing/pricing";
import { Features } from "@/components/landing/features";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="max-w-6xl mx-auto">
          <Marquee />
          <Features />
          <PricingSection />
        </div>
        <div className="flex items-center justify-center">
          <FaqSection />
        </div>
        <Footer />
      </div>
    </div>
  );
}
