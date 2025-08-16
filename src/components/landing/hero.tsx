"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Star, ArrowUpRight } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGitHubStars } from "@/hooks/useGitHubStars";
import SearchUserInput from "@/components/shared/SearchUserInput";
import HeroImage from "@/assets/hero.png";
import HeroImageLight from "@/assets/herolight.png";
import { signIn } from "next-auth/react";
import { annotate } from "rough-notation";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export function HeroSection() {
  const smarterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (smarterRef.current) {
      const annotation = annotate(smarterRef.current, {
        type: "underline",
        color: "#42DB96",
        strokeWidth: 4,
        animationDuration: 1000,
        padding: -5,
        multiline: false,
      });

      setTimeout(() => {
        annotation.show();
      }, 1500);
    }
  }, []);

  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/feed/dashboard" });
  };

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section id="home" className="scroll-mt-20">
          <div className="relative pt-20 md:pt-28">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/#preview"
                    className="mt-6 hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-3.5 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-sm">
                      All your data, one dashboard
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <h1 className="mt-10 max-w-4xl font-semibold mx-auto text-balance text-7xl md:text-7xl lg:mt-10 xl:text-[5.25rem]">
                    Track smarter Code <span ref={smarterRef}>better.</span>
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-neutral-400">
                    Gitcord helps you track and analyze your GitHub repos with
                    real-time stats and insights in one simple dashboard.
                  </p>
                </AnimatedGroup>

                {/* Call to Action */}
                <AnimatedGroup
                  variants={transitionVariants}
                  className="mt-10 space-y-8"
                >
                  {/* Search Demo */}
                  <div className="max-w-sm mx-auto">
                    <div className="text-center mb-4">
                      <p className="text-sm text-neutral-400">
                        Try it with any GitHub username
                      </p>
                    </div>
                    <div className="relative">
                      <SearchUserInput />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleGithubLogin}
                      className="w-full rounded-lg px-5 py-2 bg-gradient-to-b from-neutral-800 to-neutral-900 text-white shadow hover:cursor-pointer transition-colors duration-200 sm:w-auto flex items-center justify-center hover:from-neutral-700 hover:to-neutral-800"
                    >
                      <span className="text-sm">
                        Get Started Free{" "}
                        <ArrowUpRight className="w-5 h-5 inline" />
                      </span>
                    </button>

                    <Link
                      href="https://github.com/lumi-work/gitcord"
                      target="_blank"
                      className="text-white/70 hover:text-white py-2.5 px-6 transition-all flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-sm">View on GitHub</span>
                    </Link>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-8 md:mt-16">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src={HeroImage}
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src={HeroImageLight}
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}

const menuItems = [
  { name: "Features", href: "/#features" },
  { name: "Preview", href: "/#preview" },
  { name: "Reviews", href: "/#reviews" },
  { name: "FAQ", href: "/#faq" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { stars, loading } = useGitHubStars("lumi-work/gitcord");

  const handleGetStarted = () => {
    signIn("github", { callbackUrl: "/feed/dashboard" });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-5xl px-6 transition-all duration-300 lg:px-12 relative",
            isScrolled &&
              "before:absolute before:inset-[-1px] before:bg-background/40 before:backdrop-blur-2xl before:-z-10 before:blur-md before:rounded-3xl"
          )}
        >
          <AnimatedGroup variants={transitionVariants}>
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto lg:flex-1">
                <div className="flex items-center gap-8">
                  <Link
                    href="/"
                    aria-label="home"
                    className="flex items-center space-x-2"
                  >
                    <Logo />
                  </Link>

                  <div className="hidden lg:block">
                    <ul className="flex gap-8 text-sm">
                      {menuItems.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-accent-foreground block duration-150"
                          >
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:hidden">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:flex-row lg:items-center">
                  <Link
                    href="https://github.com/lumi-work/gitcord"
                    target="_blank"
                    className="group relative flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                  >
                    {!loading && stars > 0 && (
                      <div className="flex items-center gap-1 ml-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{stars.toLocaleString()}</span>
                      </div>
                    )}
                    <svg
                      className="w-4.5 h-4.5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </Link>

                  <button
                    onClick={handleGetStarted}
                    className="w-full rounded-lg px-4 py-1.5 bg-gradient-to-b from-neutral-800 to-neutral-900 text-white shadow hover:cursor-pointer transition-colors duration-200 sm:w-auto flex items-center justify-center hover:from-neutral-700 hover:to-neutral-800"
                  >
                    <span className="text-sm">Get Started</span>
                  </button>
                </div>
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </nav>
    </header>
  );
};

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image src="/logo.svg" alt="Gitcord Logo" width={24} height={24} />
      <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
        Gitcord
      </h1>
    </div>
  );
};
