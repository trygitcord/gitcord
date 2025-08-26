"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { HeroHeader } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";
import { AnimatedGroup } from "@/components/ui/animated-group";

interface Stargazer {
  login: string;
  avatar_url: string;
  html_url: string;
}

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

const teamMembers = [
  {
    name: "@chefberke",
    role: "Software Developer",
    bio: "Developing Gitcord's backend infrastructure and data processing systems. Working on real-time analytics and making GitHub insights fast and reliable.",
    avatar: "https://github.com/chefberke.png",
    github: "https://github.com/chefberke",
    twitter: "https://x.com/chef_berke",
    fallback: "CB",
  },
  {
    name: "@chefHarun",
    role: "Software Developer",
    bio: "Building Gitcord's frontend experience and user interface. Focused on creating intuitive dashboards that make GitHub analytics accessible to every developer.",
    avatar: "https://github.com/chefHarun.png",
    github: "https://github.com/chefHarun",
    twitter: "https://x.com/harun0x01",
    fallback: "CH",
  },
];

export default function TeamPage() {
  const [stargazers, setStargazers] = useState<Stargazer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStargazers = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/lumi-work/gitcord/stargazers"
        );

        if (!response.ok) {
          throw new Error(
            `GitHub API responded with status: ${response.status}`
          );
        }

        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setStargazers(data);
        } else {
          console.error("Expected array but got:", data);
          setError("Invalid data format received from GitHub API");
          setStargazers([]);
        }
      } catch (error) {
        console.error("Error fetching stargazers:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch stargazers"
        );
        setStargazers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStargazers();
  }, []);

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

        <section id="team" className="scroll-mt-20">
          <div className="relative pt-20 md:pt-28">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <h1 className="mt-10 max-w-4xl font-semibold mx-auto text-balance text-4xl md:text-5xl lg:mt-10">
                    Our Team
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-neutral-400">
                    Meet the passionate developers building the future of GitHub
                    analytics
                  </p>
                </AnimatedGroup>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">
              <AnimatedGroup variants={transitionVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMembers.map((member, index) => (
                    <Card
                      key={index}
                      className="bg-card/30 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-card/50 hover:border-neutral-300/50 dark:hover:border-neutral-700/50 transition-all duration-300"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={member.avatar}
                                alt={member.name}
                              />
                              <AvatarFallback className="bg-muted text-sm font-semibold">
                                {member.fallback}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-foreground text-lg mb-1">
                                {member.name}
                              </CardTitle>
                              <p className="text-muted-foreground text-sm">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
                            >
                              <Icons.gitHub className="h-4 w-4 text-muted-foreground" />
                            </a>
                            <a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
                            >
                              <Icons.twitter className="h-4 w-4 text-muted-foreground" />
                            </a>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {member.bio}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AnimatedGroup>

              <AnimatedGroup variants={transitionVariants}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Our Supporters
                  </h2>
                  <p className="text-muted-foreground">
                    Amazing people who starred our project and believe in our
                    mission
                  </p>
                </div>

                <Card className="bg-card/30 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50">
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Icons.spinner className="h-6 w-6 text-muted-foreground animate-spin" />
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">
                          Unable to load supporters
                        </p>
                        <p className="text-muted-foreground/70 text-sm">
                          GitHub API rate limit reached. Please try again later.
                        </p>
                      </div>
                    ) : stargazers.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        {stargazers.slice(0, 16).map((stargazer, index) => (
                          <a
                            key={index}
                            href={stargazer.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            title={`${stargazer.login}`}
                          >
                            <Avatar className="h-10 w-10 transition-all duration-200 group-hover:scale-110">
                              <AvatarImage
                                src={stargazer.avatar_url}
                                alt={stargazer.login}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted text-xs">
                                {stargazer.login.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No supporters found yet
                        </p>
                      </div>
                    )}

                    <div className="mt-8 text-center">
                      <a
                        href="https://github.com/lumi-work/gitcord"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-b from-neutral-800 to-neutral-900 text-white shadow hover:cursor-pointer transition-colors duration-200 hover:from-neutral-700 hover:to-neutral-800"
                      >
                        <Icons.gitHub className="h-4 w-4" />
                        <span className="text-sm">Star us on GitHub</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
