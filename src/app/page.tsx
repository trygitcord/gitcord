import { HeroSection } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";
import MarqueeColumns from "@/components/landing/marquee-columns";
import { Features } from "@/components/landing/features";
import AppPreview from "@/components/landing/app-preview";
import { Faq } from "@/components/landing/faq";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="max-w-6xl mx-auto pt-16">
          <Features />
          <AppPreview />
          <MarqueeColumns />
        </div>
        <div className="flex items-center justify-center">
          <Faq />
        </div>
        <Footer />
      </div>
    </div>
  );
}
