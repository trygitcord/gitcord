"use client";

import { TestimonialsColumn } from "@/components/ui/testimonial-columns";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Thanks to AI integration, I now have a clear vision for my upcoming projects, it feels like all my ideas are right at my fingertips.",
    image: "https://avatars.githubusercontent.com/u/21373355?v=4",
    name: "BlanchDev",
    role: "Software Developer",
  },
  {
    text: "I was new to software development and GitHub felt overwhelming but after discovering Gitcord, I realized there was nothing to stress about.",
    image: "https://avatars.githubusercontent.com/u/70480951?v=4",
    name: "Pingu",
    role: "Frontend Developer",
  },
  {
    text: "Gitcord's analytics dashboard gives me a clear overview of my team's GitHub activity. It's now so much easier to track progress and celebrate achievements!",
    image: "https://avatars.githubusercontent.com/u/9919?v=4",
    name: "Alex Turner",
    role: "Team Lead",
  },
  {
    text: "The seamless integration with GitHub motivates our contributors and helps us recognize top performers instantly. Highly recommended for open source communities.",
    image: "https://avatars.githubusercontent.com/u/583231?v=4",
    name: "Maria Lopez",
    role: "Community Manager",
  },
  {
    text: "With Gitcord, onboarding new developers is a breeze. The activity feed and stats make it easy for everyone to get up to speed.",
    image: "https://avatars.githubusercontent.com/u/9287?v=4",
    name: "David Kim",
    role: "Senior Developer",
  },
  {
    text: "I love how Gitcord visualizes my daily contributions. It keeps me motivated and helps me set new goals every month.",
    image: "https://avatars.githubusercontent.com/u/36260787?v=4",
    name: "Emily Chen",
    role: "Full Stack Developer",
  },
  {
    text: "The instant notifications and team stats have improved our workflow tremendously. Gitcord is now an essential part of our development process.",
    image: "https://avatars.githubusercontent.com/u/1709822?v=4",
    name: "Michael Brown",
    role: "DevOps Engineer",
  },
  {
    text: "Gitcord's leaderboard feature brings a fun, competitive spirit to our team. Everyone is more engaged and productive!",
    image: "https://avatars.githubusercontent.com/u/18133?v=4",
    name: "Sara Williams",
    role: "Product Manager",
  },
  {
    text: "Tracking my open source impact has never been easier. Gitcord makes my contributions visible and valued.",
    image: "https://avatars.githubusercontent.com/u/3369400?v=4",
    name: "Omar Faruk",
    role: "Open Source Contributor",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const MarqueeColumns = () => {
  return (
    <section id="testimonials" className="bg-background my-20 relative pt-14">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[700px] mx-auto"
        >
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl text-center">
            What developers say about Gitcord
          </h2>
          <p className="text-muted-foreground lg:text-lg text-center">
            Discover how GitCord is transforming the way developers track and
            showcase their GitHub activity.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default MarqueeColumns;
