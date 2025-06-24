"use client";

import { useState, useEffect, useRef } from "react";

const previewImages = [
  {
    src: "/preview1.png",
    title: "feed/analytics",
  },
  {
    src: "/preview2.png",
    title: "feed/activity",
  },
  {
    src: "/preview3.png",
    title: "feed/repositories/lumi-board",
  },
  {
    src: "/preview4.png",
    title: "feed/organization/lumi-work",
  },
  {
    src: "/preview5.png",
    title: "feed/dashboard",
  },
];

export default function AppPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    aspectRatio: "16/9",
  });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % previewImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load first image to get exact dimensions
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      setContainerStyle({
        aspectRatio: `${img.width}/${img.height}`,
      });
    };
    img.src = previewImages[0].src;
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl text-center">
            App Preview
          </h2>
          <p className="text-muted-foreground lg:text-lg text-center">
            Explore the features and interface of our powerful GitHub analytics
            platform
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Preview Container */}
          <div className="relative rounded-3xl">
            {/* Device Frame */}
            <div className="relative bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200 dark:border-neutral-700">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 mb-4 bg-gray-200 dark:bg-neutral-800 rounded-t-lg p-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
                </div>
                <div className="flex-1 bg-white dark:bg-neutral-700 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-neutral-300 border border-gray-300 dark:border-neutral-600 mx-4">
                  https://gitcord.dev/
                  {previewImages[currentIndex].title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}
                </div>
              </div>

              {/* Image Container */}
              <div
                className="relative rounded-lg overflow-hidden bg-white dark:bg-[#0a0a0a]"
                style={containerStyle}
              >
                <div className="relative w-full h-full">
                  {previewImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    >
                      <img
                        ref={index === 0 ? imgRef : null}
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {previewImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#49F9AA] w-8"
                      : "bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
