"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Gift } from "lucide-react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useRouter } from "next/navigation";

// Animated sparkle component
const AnimatedSparkle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <div
      className="absolute animate-sparkle"
      style={{
        animationDelay: `${delay}ms`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    >
      <Sparkles className="w-3 h-3 text-[#5BC898] opacity-70" />
    </div>
  );
};

// Shop items data
const shopItems = [
  {
    id: "duck-bundle",
    title: "the duck bundle",
    price: 500,
    discount: 8,
    image: "/badge-1.png",
    previewImage: "/banner.png",
    description: "A cute duck-themed profile bundle with animated effects",
    rarity: "epic",
  },
  {
    id: "bubble-bundle",
    title: "Bubble Bundle",
    price: 1250,
    discount: 8,
    image: "/badge-2.png",
    previewImage: "/member-card.png",
    description: "Floating bubbles effect for your profile",
    rarity: "rare",
  },
  {
    id: "fireflies-bundle",
    title: "Fireflies Bundle",
    price: 5000,
    discount: 8,
    image: "/badge-3.png",
    previewImage: "/light-preview-1.png",
    description: "Magical fireflies animation for night theme",
    rarity: "legendary",
  },
  {
    id: "sunflowers",
    title: "Sunflowers",
    price: 4000,
    discount: 0,
    image: "/badge-4.png",
    previewImage: "/light-preview-2.png",
    description: "Beautiful sunflower decoration for summer vibes",
    rarity: "common",
  },
];

// Modal component
const ItemModal = ({ item, isOpen, onClose }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2d23]/95">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#19382e] via-[#145c43]/80 to-[#19382e] rounded-3xl p-8 shadow-2xl border border-[#145c43]/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#145c43]/20 hover:bg-[#145c43]/40 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#145c43]/40 to-[#19382e]/40 p-8">
              <Image
                src={item.previewImage}
                alt={item.title}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e2d23]/80 to-transparent" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {item.title}
              </h2>
              <p className="text-white/80 mb-4">{item.description}</p>

              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.rarity === "legendary"
                      ? "bg-[#5BC898]/20 text-[#5BC898]"
                      : item.rarity === "epic"
                      ? "bg-[#47a87a]/20 text-[#47a87a]"
                      : item.rarity === "rare"
                      ? "bg-[#b6f2d6]/20 text-[#b6f2d6]"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {item.rarity.toUpperCase()}
                </span>
                <Gift className="w-4 h-4 text-[#5BC898]" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">
                  CREDITS {item.price}
                </span>
                {item.discount > 0 && (
                  <span className="text-green-400 text-sm font-semibold">
                    (-{item.discount}%)
                  </span>
                )}
              </div>

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#145c43] to-[#19382e] text-white font-semibold hover:from-[#19382e] hover:to-[#145c43] transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ShopPage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { data: userProfile, isLoading } = useUserProfile();
  const userCredits = userProfile?.stats?.credit ?? 0;

  // Redirect to dashboard since shop is not live yet
  useEffect(() => {
    router.replace("/feed/dashboard");
  }, [router]);

  // Return null to prevent rendering while redirecting
  return null;
}

export default ShopPage;
