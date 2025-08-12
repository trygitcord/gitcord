"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight, Github, Twitter } from "lucide-react";
import { HeroHeader } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
};

const teamMembers = [
  {
    name: "Harun Demirci",
    role: "Software Developer",
    image: "https://avatars.githubusercontent.com/u/69716874?v=4",
    github: "https://github.com/chefharun",
    twitter: "https://x.com/harun0x01",
  },
  {
    name: "Berke Kanber",
    role: "Software Developer",
    image: "https://avatars.githubusercontent.com/u/115804625?v=4",
    github: "https://github.com/chefberke",
    twitter: "https://twitter.com/chef_berke",
  },
];

function page() {
  useEffect(() => {
    document.title = "Gitcord | Team";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-6 pt-40 py-24"
      >
        <motion.div variants={itemVariants} className="mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
            Meet the Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We&apos;re passionate developers building tools to help track and
            showcase GitHub activity.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mb-16"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="flex items-center space-x-4 group"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 transition-all duration-300 group-hover:scale-110">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>

                <div className="flex items-center gap-1 pt-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </a>
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <a
            href="mailto:works.lumi@gmail.com"
            className="w-fit bg-gradient-to-b from-neutral-700 hover:from-neutral-700/90 to-neutral-900 text-white py-2 px-4 rounded-lg shadow hover:brightness-105 cursor-pointer transition-all inline-flex items-center"
          >
            <span className="text-sm">
              Get in Touch <ArrowUpRight className="w-4 h-4 inline" />
            </span>
          </a>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default page;
