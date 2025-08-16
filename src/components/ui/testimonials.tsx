"use client";

import Image from "next/image";
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
}

export function Testimonials({
  testimonials,
  className,
  title = "What developers say about Gitcord",
  description = "Discover how Gitcord is transforming the way developers track and showcase their Github activity.",
}: TestimonialsProps) {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus();
  };

  const feedbackCard = {
    image: "/logo.svg",
    name: "Have feedback?",
    username: "gitcord",
    text: "Want to help us improve? Try Gitcord now and share your thoughts!",
    social: "/feed",
  };

  const allTestimonials = [...testimonials, feedbackCard];

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

      <div className="relative pt-4 overflow-hidden">
        <div
          className="flex gap-6"
          style={{
            animation: "scroll 60s linear infinite",
          }}
        >
          {[...allTestimonials, ...allTestimonials, ...allTestimonials].map(
            (testimonial, index) => {
              const isFeedbackCard =
                testimonial.username === "gitcord" &&
                testimonial.name === "Have feedback?";

              return (
                <Card
                  key={index}
                  className="w-80 h-auto p-4 relative bg-background/70 backdrop-blur-sm rounded-lg flex-shrink-0 shadow-sm border border-border/40"
                >
                  <div className="flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={"User Avatar"}
                      width={isFeedbackCard ? 25 : 35}
                      height={isFeedbackCard ? 25 : 35}
                      className={isFeedbackCard ? "rounded-none" : "rounded-full"}
                    />
                    <div className="flex flex-col pl-3">
                      <span className="font-medium text-neutral-100">
                        {testimonial.name}
                      </span>
                      <span className="text-sm text-muted-foreground text-xs">
                        @{testimonial.username}
                      </span>
                    </div>
                  </div>
                  <div className="py-3 px-0">
                    <p className="text-neutral-100 text-sm leading-relaxed break-words">
                      "{testimonial.text}"
                    </p>
                  </div>
                  {!isFeedbackCard && (
                    <button
                      onClick={() => openInNewTab(testimonial.social)}
                      className="absolute top-4 right-4 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Icons.gitHub className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </Card>
              );
            }
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  );
}
