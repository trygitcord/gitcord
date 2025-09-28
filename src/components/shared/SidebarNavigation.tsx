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
  Trophy,
  FileText,
  Activity,
  Shield,
  MessageSquare,
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
import FeedbackModal from "@/components/modals/FeedbackModal";
import React, { useState, useEffect, useCallback } from "react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useVersion } from "@/hooks/useVersion";
import { useRepository } from "@/hooks/useGitHubQueries";
import { useGetUserMessages } from "@/hooks/useMessageQueries";

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
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const { data: profile } = useUserProfile();
  const { data: versionData } = useVersion();
  const profileUrl = profile?.username ? `/user/${profile.username}` : "/user";

  // Extract repository info from URL
  const getRepositoryFromPath = () => {
    const pathParts = pathname.split("/");

    // Match /feed/repositories/owner/repo or /feed/repositories/repo (ignoring sub-paths)
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

    // Match /feed/organization/[organizationId]/repository/[repoName] (ignoring sub-paths)
    if (
      pathParts.length >= 6 &&
      pathParts[1] === "feed" &&
      pathParts[2] === "organization" &&
      pathParts[4] === "repository"
    ) {
      const owner = decodeURIComponent(pathParts[3]);
      const repo = decodeURIComponent(pathParts[5]);
      const repositoryId = `${owner}/${repo}`;

      return { owner, repo, repositoryId };
    }

    return null;
  };

  const repositoryInfo = getRepositoryFromPath();
  const { data: repoData } = useRepository(
    repositoryInfo?.owner || null,
    repositoryInfo?.repo || null
  );

  // Unread message count for Inbox badge
  const { data: unreadMessagesData } = useGetUserMessages(1, 1, "unread");
  const unreadCount = unreadMessagesData?.data?.unreadCount || 0;

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
    <Sidebar className="bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 min-h-screen p-4">
      <SidebarContent className="bg-white dark:bg-black">
        <SidebarGroup>
          <Link href="/feed/dashboard" className="flex items-center gap-3 mb-4">
            <Image src={Logo} width={28} height={28} alt="Logo" />
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-black dark:text-white">
                Gitcord
              </h1>
              {versionData && (
                <span className="px-2 py-1 text-xs font-mono bg-black text-white rounded-full dark:bg-white dark:text-black">
                  {versionData.version}
                </span>
              )}
            </div>
          </Link>
        </SidebarGroup>

        <SidebarGroupLabel className="text-neutral-400 uppercase tracking-wider text-xs px-2 pt-2 pb-1">
          Main
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => {
              const isActive = item.live && pathname === item.url;
              const showInboxBadge = item.title === "Inbox" && unreadCount > 0;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.live ? (
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-150 border border-transparent text-base font-medium ${
                          isActive
                            ? "bg-white text-black dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 shadow-sm"
                            : "text-neutral-600 hover:bg-white hover:text-black dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white hover:shadow-sm"
                        } relative`}
                      >
                        <item.icon className={`w-5 h-5`} />
                        <span className={`flex-1 flex items-center gap-2`}>
                          {item.title}
                          {showInboxBadge && (
                            <span className="bg-gray-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </span>
                        {!item.live && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        className="flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-200 text-neutral-400 cursor-not-allowed"
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

        <SidebarGroupLabel className="text-neutral-400 uppercase tracking-wider text-xs px-2 pt-4 pb-1">
          Data & Content
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {dataItems.map((item) => {
              const isActive =
                item.live &&
                (pathname === item.url ||
                  (item.title === "Organization" &&
                    pathname.includes("/organization/") &&
                    !pathname.includes("/repository/")));
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.live ? (
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-150 border border-transparent text-base font-medium ${
                          isActive
                            ? "bg-white text-black dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 shadow-sm"
                            : "text-neutral-600 hover:bg-white hover:text-black dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white hover:shadow-sm"
                        }`}
                      >
                        <item.icon className={`w-5 h-5`} />
                        <span className={``}>{item.title}</span>
                        {!item.live && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        className="flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-200 text-neutral-400 cursor-not-allowed"
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
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupLabel className="text-neutral-400 uppercase tracking-wider text-xs px-2 pt-4 pb-1">
          Account
        </SidebarGroupLabel>
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
                        className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-150 border border-transparent text-base font-medium ${
                          isActive
                            ? "bg-white text-black dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 shadow-sm"
                            : "text-neutral-600 hover:bg-white hover:text-black dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white hover:shadow-sm"
                        }`}
                      >
                        <item.icon className={`w-5 h-5`} />
                        <span className={``}>{item.title}</span>
                        {!item.live && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                            Soon
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        className="flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-200 text-neutral-400 cursor-not-allowed"
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
                    className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-150 border border-transparent text-base font-medium ${
                      pathname === "/feed/moderator"
                        ? "bg-white text-black dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 shadow-sm"
                        : "text-neutral-600 hover:bg-white hover:text-black dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white hover:shadow-sm"
                    }`}
                  >
                    <Shield className={`w-5 h-5`} />
                    <span className={``}>Moderator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-2 px-2 pb-4 bg-black">
          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="flex items-center gap-2 w-full p-3 rounded-xl transition-all duration-150 text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Give us feedback</span>
          </button>
          <SidebarUserFooter />
        </div>
      </SidebarFooter>
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </Sidebar>
  );
}
