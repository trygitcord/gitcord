import Navbar from "@/components/landing/navbar";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="w-full max-w-[1200px] px-4">
        <Navbar />
        <div className="h-full"></div>
        <Footer />
      </div>
    </div>
  );
}
