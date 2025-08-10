"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

interface Testimonial {
  image: string;
  name: string;
  username: string;
  text: string;
  social: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
  title?: string;
  description?: string;
  maxDisplayed?: number;
}

export function Testimonials({
  testimonials,
  className,
  title = "What developers say about Gitcord",
  description = "Discover how Gitcord is transforming the way developers track and showcase their Github activity.",
  maxDisplayed = 6,
}: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false);

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus();
  };

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center pt-5">
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description.split("<br />").map((line, i) => (
              <span key={i}>
                {line}
                {i !== description.split("<br />").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="relative pt-4">
        <div
          className={cn(
            "flex justify-center items-center gap-5 flex-wrap",
            !showAll &&
              testimonials.length > maxDisplayed &&
              "max-h-[720px] overflow-hidden"
          )}
        >
          {testimonials
            .slice(0, showAll ? undefined : maxDisplayed)
            .map((testimonial, index) => (
              <Card
                key={index}
                className="w-80 h-auto p-5 relative bg-background rounded-2xl border border-neutral-900 max-w-xs w-full"
              >
                <div className="flex items-center">
                  <Image
                    src={testimonial.image}
                    alt={"User Avatar"}
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <div className="flex flex-col pl-3">
                    <span className="font-medium text-neutral-100">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      @{testimonial.username}
                    </span>
                  </div>
                </div>
                <div className="py-4 px-1.5">
                  <p className="text-neutral-100 text-sm">
                    "{testimonial.text}"
                  </p>
                </div>
                <button
                  onClick={() => openInNewTab(testimonial.social)}
                  className="absolute top-4 right-4 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Icons.twitter className="h-4 w-4" aria-hidden="true" />
                </button>
              </Card>
            ))}

          {/* Special invitation card */}
          <Card className="w-80 h-auto p-6 relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/30 shadow-lg shadow-primary/20 max-w-xs w-full">
            <div className="flex items-center">
              <div className="w-[45px] h-[45px] rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                <Icons.twitter className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col pl-3">
                <span className="font-medium text-primary">
                  Want to be featured?
                </span>
                <span className="text-sm text-primary/80">@gitcord</span>
              </div>
            </div>
            <div className="py-5 px-1.5">
              <p className="text-neutral-100 text-sm">
                "Share your Gitcord experience on X to get featured here!"
              </p>
            </div>
          </Card>
        </div>

        {testimonials.length > maxDisplayed && !showAll && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <Button variant="secondary" onClick={() => setShowAll(true)}>
                Load More
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
