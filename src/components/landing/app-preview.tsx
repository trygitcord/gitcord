"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const previewImages = [
  {
    src: "/preview5.png",
    lightSrc: "/light-preview-5.png",
    title: "feed/dashboard",
  },
  {
    src: "/preview2.png",
    lightSrc: "/light-preview-2.png",
    title: "feed/activity",
  },
  {
    src: "/preview3.png",
    lightSrc: "/light-preview-3.png",
    title: "feed/repositories",
  },
  {
    src: "/preview4.png",
    lightSrc: "/light-preview-4.png",
    title: "feed/organization",
  },
];

export default function AppPreview() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    aspectRatio: "16/9",
  });
  const imgRef = useRef<HTMLImageElement>(null);

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always use dark theme images for landing page
  const getCurrentImageSrc = useCallback(
    (image: (typeof previewImages)[0]) => {
      return image.src; // Always use dark theme images
    },
    []
  );

  useEffect(() => {
    if (!mounted) return;

    // Load first image to get exact dimensions
    const img = new window.Image();
    img.onload = () => {
      setContainerStyle({
        aspectRatio: `${img.width}/${img.height}`,
      });
    };
    img.src = getCurrentImageSrc(previewImages[0]);
  }, [mounted, getCurrentImageSrc]);

  // Show loading state during SSR and initial client render
  if (!mounted) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent text-center">
              App Preview
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Explore the features and interface of our powerful GitHub
              analytics platform
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-3xl">
              <div className="relative bg-gray-50 dark:bg-neutral-950 rounded-2xl p-4 border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 mb-4 bg-gray-200 dark:bg-neutral-800 rounded-t-lg p-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full opacity-80"></div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-neutral-700 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-neutral-300 border border-gray-300 dark:border-neutral-600 mx-4">
                    https://gitcord.dev/feed/analytics
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden bg-white dark:bg-[#0a0a0a] aspect-video">
                  <div className="w-full h-full bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-center flex-wrap gap-6 mt-8">
                {previewImages.map((image, index) => {
                  const pageName = image.title.split("/").pop() || image.title;
                  return (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-600 dark:text-neutral-400 capitalize animate-pulse"
                    >
                      {pageName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="preview" className="py-20 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent text-center">
            App Preview
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Explore the features and interface of our powerful GitHub analytics
            platform
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Preview Container */}
          <div className="relative rounded-3xl">
            {/* Device Frame */}
            <div className="relative bg-gray-50 dark:bg-background rounded-2xl p-4 border border-gray-200 dark:border-neutral-900">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 mb-4 bg-gray-100 dark:bg-neutral-950 rounded-lg p-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"></div>
                </div>
                <div className="flex-1 bg-white dark:bg-neutral-900 dark:text-neutral-300 rounded-md px-4 py-1.5 text-sm text-gray-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-950 mx-4">
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
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100 z-10"
                          : "opacity-0 scale-95 z-0"
                      }`}
                    >
                      <Image
                        ref={index === 0 ? imgRef : null}
                        src={getCurrentImageSrc(image)}
                        alt={image.title}
                        className="w-full h-full object-contain"
                        width={2000}
                        height={2000}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Tabs */}
            <div className="flex justify-center flex-wrap gap-6 mt-8">
              {previewImages.map((image, index) => {
                const pageName = image.title.split("/").pop() || image.title;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 capitalize cursor-pointer ${
                      index === currentIndex
                        ? "text-[#49F9AA]"
                        : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-100/50 dark:hover:bg-neutral-800/30"
                    }`}
                  >
                    {pageName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
