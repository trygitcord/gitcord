"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Sparkles, Gift } from "lucide-react";

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
      <Sparkles className="w-3 h-3 text-yellow-300 opacity-60" />
    </div>
  );
};

// Shop items data
const shopItems = [
  {
    id: "duck-bundle",
    title: "the duck bundle",
    price: 115.99,
    discount: 8,
    image: "/badge-1.png",
    previewImage: "/banner.png",
    description: "A cute duck-themed profile bundle with animated effects",
    rarity: "epic",
  },
  {
    id: "bubble-bundle",
    title: "Bubble Bundle",
    price: 115.99,
    discount: 8,
    image: "/badge-2.png",
    previewImage: "/member-card.png",
    description: "Floating bubbles effect for your profile",
    rarity: "rare",
  },
  {
    id: "fireflies-bundle",
    title: "Fireflies Bundle",
    price: 115.99,
    discount: 8,
    image: "/badge-3.png",
    previewImage: "/light-preview-1.png",
    description: "Magical fireflies animation for night theme",
    rarity: "legendary",
  },
  {
    id: "sunflowers",
    title: "Sunflowers",
    price: 62.99,
    discount: 0,
    image: "/badge-4.png",
    previewImage: "/light-preview-2.png",
    description: "Beautiful sunflower decoration for summer vibes",
    rarity: "common",
  },
  {
    id: "galaxy-bundle",
    title: "Galaxy Bundle",
    price: 149.99,
    discount: 12,
    image: "/premium.png",
    previewImage: "/light-preview-3.png",
    description: "Stunning galaxy effects with shooting stars",
    rarity: "legendary",
  },
  {
    id: "ocean-waves",
    title: "Ocean Waves",
    price: 89.99,
    discount: 5,
    image: "/fire.png",
    previewImage: "/light-preview-4.png",
    description: "Calming ocean waves animation for your profile",
    rarity: "rare",
  },
  {
    id: "cherry-blossom",
    title: "Cherry Blossom",
    price: 99.99,
    discount: 10,
    image: "/badge-1.png",
    previewImage: "/light-preview-5.png",
    description: "Falling cherry blossom petals effect",
    rarity: "epic",
  },
  {
    id: "northern-lights",
    title: "Northern Lights",
    price: 179.99,
    discount: 15,
    image: "/badge-2.png",
    previewImage: "/preview1.png",
    description: "Aurora borealis animated background",
    rarity: "legendary",
  },
];

// Modal component
const ItemModal = ({ item, isOpen, onClose }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-3xl p-8 shadow-2xl border border-purple-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-8">
              <Image
                src={item.previewImage}
                alt={item.title}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {item.title}
              </h2>
              <p className="text-gray-300 mb-4">{item.description}</p>

              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.rarity === "legendary"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : item.rarity === "epic"
                      ? "bg-purple-500/20 text-purple-300"
                      : item.rarity === "rare"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {item.rarity.toUpperCase()}
                </span>
                <Gift className="w-4 h-4 text-pink-400" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">
                  TRY {item.price}
                </span>
                {item.discount > 0 && (
                  <span className="text-green-400 text-sm font-semibold">
                    (-{item.discount}%)
                  </span>
                )}
              </div>

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
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
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <AnimatedSparkle key={i} delay={i * 200} />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col px-4 py-8">
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold mb-3">Shop</h1>
          <p className="text-gray-400 text-base mb-6">
            Personalize your profile with unique bundles and effects.
          </p>
        </div>

        {/* Shop Grid - 2 rows, 4 columns */}
        <div>
          <div className="h-full grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 lg:gap-6">
            {shopItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 flex flex-col">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300" />

                  {/* Item image container */}
                  <div className="relative mb-3 mx-auto w-20 h-20 lg:w-24 lg:h-24">
                    <div className="relative w-full h-full rounded-full bg-black/40 backdrop-blur-sm p-3 border border-purple-500/30">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={72}
                        height={72}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Gift emoji floating */}
                    <div className="absolute -top-1 -right-1 animate-bounce">
                      <div className="bg-pink-500/20 backdrop-blur-sm rounded-full p-1.5 border border-pink-500/30">
                        <Gift className="w-3 h-3 text-pink-400" />
                      </div>
                    </div>
                  </div>

                  {/* Item details */}
                  <h3 className="text-white font-semibold text-sm lg:text-base text-center mb-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-center gap-2 mt-auto">
                    <span className="text-white font-bold text-sm">
                      TRY {item.price}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-green-400 text-xs font-semibold">
                        (-{item.discount}%)
                      </span>
                    )}
                  </div>

                  {/* Sparkles on hover */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="absolute top-4 right-4 w-3 h-3 text-yellow-300 animate-pulse" />
                      <Sparkles className="absolute bottom-4 left-4 w-3 h-3 text-pink-300 animate-pulse animation-delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

export default ShopPage;
