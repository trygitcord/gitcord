"use client";

import React, { useEffect } from "react";
import { HeroHeader } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";
import { motion } from "motion/react";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Sparkles,
  Code,
  Palette,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Team member data
const teamMembers = [
  {
    name: "Berke Kanber",
    role: "Software Developer",
    avatar: "https://avatars.githubusercontent.com/u/115804625?v=4",
    bio: "Full-stack developer passionate about building tools that help developers track their progress.",
    github: "https://github.com/chefberke",
    twitter: "https://twitter.com/chef_berke",
    linkedin: "www.linkedin.com/in/berke-kanber-942392265",
    gradient: "from-[#4CFFAF] to-[#3ABA81]",
    icon: <Rocket className="w-4 h-4" />,
  },
  {
    name: "Harun Demirci",
    role: "Software Developer",
    avatar: "https://avatars.githubusercontent.com/u/69716874?v=4",
    bio: "Full-stack developer passionate about building tools that help developers track their progress.",
    github: "https://github.com/chefharun",
    twitter: "https://x.com/harundcii",
    linkedin: "https://www.linkedin.com/in/harun-demirci-727360230/",
    gradient: "from-[#dd7bbb] to-[#d79f1e]",
    icon: <Code className="w-4 h-4" />,
  },
  {
    name: "We're Hiring.",
    role: "Product Designer",
    bio: "",
    gradient: "from-[#5a922c] to-[#4c7894]",
    icon: <Palette className="w-4 h-4" />,
    isHiring: true,
  },
  {
    name: "We're Hiring!",
    role: "Frontend Engineer",
    bio: "",
    gradient: "from-[#FF6B6B] to-[#4ECDC4]",
    icon: <Sparkles className="w-4 h-4" />,
    isHiring: true,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

function TeamMemberCard({
  member,
  index,
}: {
  member: (typeof teamMembers)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    document.title = "Gitcord | Team";
  }, []);

  return (
    <motion.div
      variants={itemVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div
        className={cn(
          "relative rounded-2xl p-6 border transition-all duration-300 h-90 overflow-hidden",
          member.isHiring
            ? "bg-neutral-50 dark:bg-neutral-800/50 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
        )}
      >
        {/* Gradient background effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
            `bg-gradient-to-br ${member.gradient}`
          )}
        />

        {/* Avatar and basic info */}
        <div className="relative flex flex-col items-center text-center h-full">
          {member.isHiring ? (
            /* Hiring card - only show large question mark */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-8xl font-bold text-neutral-400 dark:text-neutral-500">
                ?
              </div>
            </div>
          ) : (
            <>
              {/* Top section - Avatar, Name, Role */}
              <div className="flex flex-col items-center space-y-4 mb-4">
                {/* Avatar with gradient ring on hover */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none",
                      `bg-gradient-to-r ${member.gradient}`
                    )}
                  />
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-neutral-200 dark:ring-neutral-800 group-hover:ring-4 transition-all duration-300">
                    <Image
                      src={member.avatar!}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Role icon */}
                  <div
                    className={cn(
                      "absolute -bottom-2 -right-2 p-1.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800",
                      "group-hover:scale-110 transition-transform duration-300"
                    )}
                  >
                    {member.icon}
                  </div>
                </div>

                {/* Name and role */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {member.name}
                  </h3>
                  <p
                    className={cn(
                      "text-sm font-medium bg-gradient-to-r bg-clip-text text-transparent",
                      member.gradient
                    )}
                  >
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Bio - takes up available space */}
              <div className="flex-1 flex items-start justify-center mb-6">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social links - always at bottom */}
              <div className="flex items-center gap-3 mt-auto">
                {member.github && (
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </Link>
                )}
                {member.twitter && (
                  <Link
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <Twitter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </Link>
                )}
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function page() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5BC898]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 pt-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-[#4CFFAF] to-[#3ABA81] bg-clip-text text-transparent">
                Team
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're a passionate group of developers and designers working
              together to revolutionize how developers track and showcase their
              GitHub activity.
            </p>
          </motion.div>

          {/* Team Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#4CFFAF] to-[#3ABA81] flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Developer First</h3>
                <p className="text-muted-foreground">
                  We build tools by developers, for developers, always keeping
                  the developer experience at heart.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#dd7bbb] to-[#d79f1e] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  Constantly pushing boundaries to deliver cutting-edge
                  analytics and insights.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5a922c] to-[#4c7894] flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <p className="text-muted-foreground">
                  Empowering developers to track, improve, and showcase their
                  coding journey.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-12 mb-24"
          >
            <h2 className="text-3xl font-bold mb-4">Want to Join Us?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always looking for talented individuals who share our
              passion for building great developer tools.
            </p>
            <Link
              href="mailto:careers@gitcord.pro"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4CFFAF] to-[#3ABA81] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default page;
