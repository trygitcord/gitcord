"use client";
import React from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Platform",
    links: [
      { title: "Dashboard", href: "/feed/dashboard" },
      { title: "Analytics", href: "/feed/activity" },
      { title: "Repositories", href: "/feed/repositories" },
      { title: "Organizations", href: "/feed/organization" },
    ],
  },
  {
    label: "Resources",
    links: [
      {
        title: "GitHub API",
        href: "https://docs.github.com/en/rest",
      },
      { title: "Status", href: "https://gitcord.betteruptime.com" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "Team", href: "/team" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Contact", href: "/contact" },
    ],
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-24 h-8" />; // Placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-full bg-muted/30 backdrop-blur-sm border border-border/50">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="System mode"
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-8 py-16 lg:px-12 lg:py-20">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-12 xl:grid-cols-3 xl:gap-12">
        <AnimatedContainer className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Gitcord Logo"
                width={24}
                height={24}
              />
              <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Gitcord
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-sm font-normal">
            Track smarter, code better. Monitor and analyze all your GitHub
            repositories with real-time insights and unified analytics.
          </p>

          <p className="text-muted-foreground mt-8 text-sm md:mt-4">
            © {new Date().getFullYear()} Gitcord. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 xl:col-span-2 xl:mt-0 justify-items-start sm:justify-items-end">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-12 md:mb-0">
                <h3 className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                  {section.label}
                </h3>
                <ul className="text-muted-foreground mt-6 space-y-4 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="hover:text-foreground inline-flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                        target="_blank"
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.icon && (
                          <link.icon className="size-4 flex-shrink-0" />
                        )}
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      {/* Bottom section with additional info */}
      <AnimatedContainer delay={0.5} className="w-full">
        <div className="border-t border-foreground/10 mt-16 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Built by developers, for developers</span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
                target="_blank"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
                target="_blank"
              >
                Terms
              </Link>
              <span>•</span>
              <Link
                href="https://gitcord.betteruptime.com"
                className="hover:text-foreground transition-colors"
                target="_blank"
              >
                Status
              </Link>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", y: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
