"use client";

import {
  Trello,
  Building2,
  BookMarked,
  Book,
  Settings,
  ChartColumnBig,
  Inbox,
  User,
  LineChart,
  Crown,
  Trophy,
  FileText,
  Activity,
  ShoppingCart,
  Shield,
} from "lucide-react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/assets/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import SidebarUserFooter from "@/components/shared/SidebarUserFooter";
import React, { useState, useEffect, useCallback } from "react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useVersion } from "@/hooks/useVersion";
import { useRepository } from "@/hooks/useGitHubQueries";

// Menu items.
const mainItems = [
  {
    title: "Dashboard",
    url: "/feed/dashboard",
    icon: Trello,
    live: true,
  },
  {
    title: "Inbox",
    url: "/feed/inbox",
    icon: Inbox,
    live: true,
  },
  {
    title: "Activity",
    url: "/feed/activity",
    icon: ChartColumnBig,
    live: true,
  },
  {
    title: "Analytics",
    url: "/feed/analytics",
    icon: LineChart,
    live: true,
    premium: true,
  },
];

const dataItems = [
  {
    title: "Repositories",
    url: "/feed/repositories",
    icon: BookMarked,
    live: true,
  },
  {
    title: "Organization",
    url: "/feed/organization",
    icon: Building2,
    live: true,
  },
  {
    title: "Leaderboard",
    url: "/feed/leaderboard",
    icon: Trophy,
    live: true,
  },
];

const profileItems = [
  {
    title: "Shop",
    url: "/feed/shop",
    icon: ShoppingCart,
    live: false,
  },
  {
    title: "Profile",
    url: "/user",
    icon: User,
    live: true,
  },
  {
    title: "Settings",
    url: "/feed/settings",
    icon: Settings,
    live: true,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const { data: profile } = useUserProfile();
  const { data: versionData } = useVersion();
  const profileUrl = profile?.username ? `/user/${profile.username}` : "/user";

  // Extract repository info from URL
  const getRepositoryFromPath = () => {
    // Match /feed/repositories/owner/repo or /feed/repositories/repo (ignoring sub-paths)
    const pathParts = pathname.split("/");
    if (
      pathParts.length >= 4 &&
      pathParts[1] === "feed" &&
      pathParts[2] === "repositories"
    ) {
      const repoSegment1 = decodeURIComponent(pathParts[3]);
      const repoSegment2 = pathParts[4]
        ? decodeURIComponent(pathParts[4])
        : null;

      let owner: string | null = null;
      let repo: string | null = null;
      let repositoryId: string;

      // Check if it's owner/repo format or just repo format
      if (repoSegment2 && !["activity", "overview"].includes(repoSegment2)) {
        // Format: /feed/repositories/owner/repo
        owner = repoSegment1;
        repo = repoSegment2;
        repositoryId = `${owner}/${repo}`;
      } else {
        // Format: /feed/repositories/repo
        repo = repoSegment1;
        owner = profile?.username || null;
        repositoryId = repo;
      }

      return { owner, repo, repositoryId };
    }
    return null;
  };

  const repositoryInfo = getRepositoryFromPath();
  const { data: repoData } = useRepository(
    repositoryInfo?.owner || null,
    repositoryInfo?.repo || null
  );

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemTitle)
        ? prev.filter((item) => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const isExpanded = useCallback(
    (itemTitle: string) => expandedItems.includes(itemTitle),
    [expandedItems]
  );

  // Auto-expand repository if user is on a repository page
  useEffect(() => {
    if (repositoryInfo && !isExpanded(repositoryInfo.repositoryId)) {
      setExpandedItems((prev) => [...prev, repositoryInfo.repositoryId]);
    }
  }, [repositoryInfo, pathname, isExpanded]);

  return (
    <Sidebar className="p-4 border-r-2 border-r-neutral-200 dark:bg-neutral-950 dark:border-r-neutral-800 overflow-hidden">
      <SidebarContent className="dark:bg-neutral-950 overflow-hidden">
        <SidebarGroup>
          <Link href="/feed/dashboard" className="flex items-center gap-3">
            <Image src={Logo} width={28} height={28} alt="Logo" />
            <div className="flex items-center gap-2">
              <h1 className="font-medium">Gitcord</h1>
              {versionData && (
                <span className="px-2 py-1 text-xs font-mono bg-neutral-900 text-neutral-100 rounded-full dark:bg-neutral-800 dark:text-neutral-200">
                  {versionData.version}
                </span>
              )}
            </div>
          </Link>
        </SidebarGroup>

        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => {
              const isActive = item.live && pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.live ? (
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                          isActive
                            ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`${isActive ? "text-[#5BC898]" : ""}`}
                        />
                        <span
                          className={`${
                            isActive ? "text-[#5BC898]" : ""
                          } flex-1`}
                        >
                          {item.title}
                        </span>
                        {item.premium && (
                          <Crown className="w-4 h-4 text-[#5BC898]" />
                        )}
                        {!item.live && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        className="flex items-center gap-2 w-full p-2 rounded-md transition-all text-neutral-400 cursor-not-allowed"
                        disabled
                      >
                        <item.icon />
                        <span className="flex-1">{item.title}</span>
                        {!item.live && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        )}
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupLabel>Data & Content</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {dataItems.map((item) => {
              const isActive = item.live && pathname === item.url;

              return (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      {item.live ? (
                        <Link
                          href={item.url}
                          className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                            isActive
                              ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                          }`}
                        >
                          <item.icon
                            className={`${isActive ? "text-[#5BC898]" : ""}`}
                          />
                          <span
                            className={`${isActive ? "text-[#5BC898]" : ""}`}
                          >
                            {item.title}
                          </span>
                          {!item.live && (
                            <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                              Soon
                            </span>
                          )}
                        </Link>
                      ) : (
                        <button
                          className="flex items-center gap-2 w-full p-2 rounded-md transition-all text-neutral-400 cursor-not-allowed"
                          disabled
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        </button>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Repository Sub-Menu appears right after Repositories */}
                  {item.title === "Repositories" && repositoryInfo && (
                    <div className="ml-4 border-l border-neutral-200 dark:border-neutral-700 pl-2">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button
                            onClick={() =>
                              toggleExpanded(repositoryInfo.repositoryId)
                            }
                            className={`flex items-center gap-2 py-1.5 px-3 rounded-md transition-all text-sm ${
                              pathname.startsWith(
                                `/feed/repositories/${repositoryInfo.repositoryId}`
                              )
                                ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                            }`}
                          >
                            <Book
                              className={`w-4 h-4 ${
                                pathname.startsWith(
                                  `/feed/repositories/${repositoryInfo.repositoryId}`
                                )
                                  ? "text-[#5BC898]"
                                  : ""
                              }`}
                            />
                            <span
                              className={`${
                                pathname.startsWith(
                                  `/feed/repositories/${repositoryInfo.repositoryId}`
                                )
                                  ? "text-[#5BC898]"
                                  : ""
                              } flex-1 truncate`}
                            >
                              {repoData?.name || repositoryInfo.repo}
                            </span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Repository Sub Items */}
                      {isExpanded(repositoryInfo.repositoryId) && (
                        <div className="ml-4 border-l border-neutral-200 dark:border-neutral-700 space-y-1 py-1 pl-2">
                          {[
                            {
                              title: "Overview",
                              icon: FileText,
                              url: `/feed/repositories/${repositoryInfo.repositoryId}`,
                            },
                            {
                              title: "Activity",
                              icon: Activity,
                              url: `/feed/repositories/${repositoryInfo.repositoryId}/activity`,
                            },
                          ].map((subItem) => {
                            const isSubActive = pathname === subItem.url;

                            return (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={subItem.url}
                                    className={`flex items-center gap-2 py-1.5 px-3 rounded-md transition-all text-sm ${
                                      isSubActive
                                        ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                                    }`}
                                  >
                                    <subItem.icon
                                      className={`w-4 h-4 flex-shrink-0 ${
                                        isSubActive ? "text-[#5BC898]" : ""
                                      }`}
                                    />
                                    <span
                                      className={`${
                                        isSubActive ? "text-[#5BC898]" : ""
                                      } flex-1 truncate`}
                                    >
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {profileItems.map((item) => {
              const isActive = item.live && pathname === item.url;
              const url = item.title === "Profile" ? profileUrl : item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.live ? (
                      <Link
                        href={url}
                        target={item.title === "Profile" ? "_blank" : undefined}
                        className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                          isActive
                            ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`${isActive ? "text-[#5BC898]" : ""}`}
                        />
                        <span className={`${isActive ? "text-[#5BC898]" : ""}`}>
                          {item.title}
                        </span>
                        {!item.live && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        className="flex items-center gap-2 w-full p-2 rounded-md transition-all text-neutral-400 cursor-not-allowed"
                        disabled
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                          Soon
                        </span>
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

            {/* Moderator Menu Item - Only visible for moderators */}
            {profile?.isModerator && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/feed/moderator"
                    className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                      pathname === "/feed/moderator"
                        ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <Shield
                      className={`${
                        pathname === "/feed/moderator" ? "text-[#5BC898]" : ""
                      }`}
                    />
                    <span
                      className={`${
                        pathname === "/feed/moderator" ? "text-[#5BC898]" : ""
                      }`}
                    >
                      Moderator
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
