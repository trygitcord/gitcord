"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  Mail,
  MessageSquare,
  Github,
  Twitter,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { HeroHeader } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";
import { signIn } from "next-auth/react";

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

export default function ContactPage() {
  const handleGetStarted = () => {
    signIn("github", { callbackUrl: "/feed/dashboard" });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "works.lumi@gmail.com",
      description: "For general inquiries",
      href: "mailto:works.lumi@gmail.com",
    },
    {
      icon: MessageSquare,
      title: "Discord",
      value: "Join our server",
      description: "Chat with the community",
      href: "https://discord.gg/8w4yKtBEy2",
    },
    {
      icon: Github,
      title: "GitHub",
      value: "Gitcord",
      description: "Check our repositories",
      href: "https://github.com/lumi-work/gitcord",
    },
    {
      icon: Twitter,
      title: "Twitter",
      value: "@works_lumi",
      description: "Follow for updates",
      href: "https://x.com/works_lumi",
    },
  ];

  return (
    <>
      <HeroHeader />
      <div className="min-h-screen bg-background py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.02),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.02),transparent)]" />
        </div>

        <div className="relative pt-20 md:pt-28 pb-20">
          <div className="mx-auto max-w-6xl px-6">
            {/* Header Section */}
            <div className="text-center mb-20">
              <AnimatedGroup variants={transitionVariants}>
                <div className="inline-flex items-center gap-2 bg-neutral-100/50 dark:bg-neutral-800/50 px-4 py-1.5 rounded-full border border-neutral-200/50 dark:border-neutral-700/50 mb-6">
                  <Sparkles className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
                    We&apos;re here to help
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-medium text-balance mb-6">
                  Let&apos;s Connect
                </h1>

                <p className="mx-auto max-w-2xl text-balance text-lg text-neutral-400 leading-relaxed">
                  Have questions or want to learn more about Gitcord? We&apos;re
                  just a message away.
                </p>
              </AnimatedGroup>
            </div>

            {/* Main Contact Methods */}
            <AnimatedGroup variants={transitionVariants} className="mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <Card className="relative overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 bg-card/30 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-card/50 hover:border-neutral-300/50 dark:hover:border-neutral-700/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                          <method.icon className="w-6 h-6 text-[#4CFFAF]" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>

                      <h3 className="text-base font-medium mb-1">
                        {method.title}
                      </h3>
                      <p className="text-foreground font-normal mb-2">
                        {method.value}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {method.description}
                      </p>
                    </Card>
                  </a>
                ))}
              </div>
            </AnimatedGroup>

            {/* Bottom CTA */}
            <AnimatedGroup variants={transitionVariants} className="mt-20">
              <div className="text-center max-w-2xl mx-auto">
                <Card className="p-10 bg-transparent border-none">
                  <h3 className="text-xl font-medium mb-4">
                    Ready to transform your GitHub experience?
                  </h3>
                  <p className="text-sm text-neutral-400 mb-6">
                    Join thousands of developers who are already using Gitcord
                    to enhance their collaboration.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleGetStarted}
                      className="w-full rounded-lg px-5 py-2 bg-gradient-to-b from-neutral-800 to-neutral-900 text-white shadow hover:cursor-pointer transition-colors duration-200 sm:w-auto flex items-center justify-center hover:from-neutral-700 hover:to-neutral-800"
                    >
                      <span className="text-sm">
                        Get Started Free{" "}
                        <ArrowUpRight className="w-5 h-5 inline" />
                      </span>
                    </button>
                  </div>
                </Card>
              </div>
            </AnimatedGroup>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
