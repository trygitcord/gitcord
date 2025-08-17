"use client";

import { FaqSection } from "@/components/ui/faq";

const DEMO_FAQS = [
  {
    question: "What is Gitcord?",
    answer: "Gitcord is a comprehensive Github analytics platform that helps you monitor and analyze your repositories. We provide detailed insights with real-time stats, contribution tracking, and beautiful visualizations all in one unified dashboard."
  },
  {
    question: "Is Gitcord free to use?",
    answer: "Yes! Gitcord is completely free and open source. All features are available to everyone without any premium tiers or paid plans. You can even contribute to the project on Github."
  },
  {
    question: "What kind of insights can I get from Gitcord?",
    answer: "You can track your coding patterns, language usage, contribution trends, commit history, and repository health. Gitcord also provides team performance metrics, issue tracking, and interactive leaderboards to showcase your Github activity."
  },
  {
    question: "How do I get started with Gitcord?",
    answer: "Simply sign in with your Github account and Gitcord will automatically sync your repositories and activity data. You can also search for any Github username on our homepage to preview the analytics before signing up."
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
