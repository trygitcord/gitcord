import { HeroSection } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";
import { Features } from "@/components/landing/features";
import AppPreview from "@/components/landing/app-preview";
import { Faq } from "@/components/landing/faq";
import { MarqueeColumns } from "@/components/landing/marquee-columns";
import { Team } from "@/components/landing/team";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <div className="max-w-6xl mx-auto pt-16 space-y-10">
          <Features />
          <AppPreview />
          <MarqueeColumns />
          <Team />
        </div>
        <div className="flex items-center justify-center pt-10">
          <Faq />
        </div>
        <Footer />
      </div>
    </div>
  );
}
