"use client";

import { FaqSection } from "@/components/ui/faq";

const DEMO_FAQS = [
  {
    question: "What is Gitcord?",
    answer:
      "Gitcord is a comprehensive GitHub analytics platform that makes it effortless to monitor and analyze all your GitHub repositories. We provide deep insights with real-time stats, issue patterns, and contributor activity all from a single, unified dashboard.",
  },
  {
    question: "Is Gitcord free to use?",
    answer:
      "Yes! Gitcord offers a free tier that includes core features like repository tracking, basic analytics, and contribution graphs. We also offer premium features for advanced users who need enhanced analytics and team collaboration tools.",
  },
  {
    question: "What kind of insights can I get from Gitcord?",
    answer:
      "Gitcord provides detailed analytics on your coding patterns, language usage, contribution trends, team performance, and repository health. You can track commits, pull requests, issues, and collaborate effectively with beautiful visualizations and leaderboards.",
  },
  {
    question: "How do I get started with Gitcord?",
    answer:
      "Getting started is simple! Just sign in with your GitHub account and Gitcord will automatically sync your repositories and activity. You can try searching for any GitHub username on our homepage to see a demo of our analytics.",
  },
];

export function Faq() {
  return (
    <FaqSection
      id="faq"
      title="Frequently Asked Questions"
      description="Everything you need to know about our platform"
      items={DEMO_FAQS}
    />
  );
}
