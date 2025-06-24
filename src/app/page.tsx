import { HeroSection } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";
import { FaqSection } from "@/components/landing/faqs";
import MarqueeColumns from "@/components/landing/marquee-columns";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="max-w-6xl mx-auto pt-16">
          <MarqueeColumns />
        </div>
        <div className="flex items-center justify-center">
          <FaqSection />
        </div>
        <Footer />
      </div>
    </div>
  );
}
