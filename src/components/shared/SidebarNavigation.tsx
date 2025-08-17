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
              // Badge only for Inbox
              const showInboxBadge = item.title === "Inbox" && unreadCount > 0;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.live ? (
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 w-full p-2 rounded-md transition-all duration-150 ease-out  border border-transparent ${
                          isActive
                            ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border-neutral-100 dark:border-neutral-800 shadow-sm"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm"
                        } relative`}
                      >
                        <item.icon
                          className={`${isActive ? "text-[#5BC898]" : ""}`}
                        />
                        <span
                          className={`${
                            isActive ? "text-[#5BC898]" : ""
                          } flex-1 flex items-center gap-2`}
                        >
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
                        className="flex items-center gap-2 w-full p-2 rounded-md transition-all duration-200 ease-in-out text-neutral-400 cursor-not-allowed"
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
              const isActive =
                item.live &&
                (pathname === item.url ||
                  (item.title === "Organization" &&
                    pathname.includes("/organization/") &&
                    !pathname.includes("/repository/")));

              return (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      {item.live ? (
                        <Link
                          href={item.url}
                          className={`flex items-center gap-2 w-full p-2 rounded-md transition-all duration-150 ease-out  border border-transparent ${
                            isActive
                              ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border-neutral-100 dark:border-neutral-800 shadow-sm"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm"
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
                          className="flex items-center gap-2 w-full p-2 rounded-md transition-all duration-200 ease-in-out text-neutral-400 cursor-not-allowed"
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
                            className={`flex items-center gap-2 py-1.5 px-3 rounded-md transition-all duration-150 ease-out  text-sm border border-transparent ${
                              pathname.startsWith(
                                `/feed/repositories/${repositoryInfo.repositoryId}`
                              ) ||
                              pathname.startsWith(
                                `/feed/organization/${repositoryInfo.owner}/repository/${repositoryInfo.repo}`
                              )
                                ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border-neutral-100 dark:border-neutral-800 shadow-sm"
                                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm"
                            }`}
                          >
                            <Book
                              className={`w-4 h-4 ${
                                pathname.startsWith(
                                  `/feed/repositories/${repositoryInfo.repositoryId}`
                                ) ||
                                pathname.startsWith(
                                  `/feed/organization/${repositoryInfo.owner}/repository/${repositoryInfo.repo}`
                                )
                                  ? "text-[#5BC898]"
                                  : ""
                              }`}
                            />
                            <span
                              className={`${
                                pathname.startsWith(
                                  `/feed/repositories/${repositoryInfo.repositoryId}`
                                ) ||
                                pathname.startsWith(
                                  `/feed/organization/${repositoryInfo.owner}/repository/${repositoryInfo.repo}`
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
                          {(() => {
                            // Determine if this is an organization repository
                            const isOrgRepo =
                              pathname.includes("/organization/");
                            const baseUrl = isOrgRepo
                              ? `/feed/organization/${repositoryInfo.owner}/repository/${repositoryInfo.repo}`
                              : `/feed/repositories/${repositoryInfo.repositoryId}`;

                            return [
                              {
                                title: "Overview",
                                icon: FileText,
                                url: baseUrl,
                              },
                              {
                                title: "Activity",
                                icon: Activity,
                                url: `${baseUrl}/activity`,
                              },
                            ];
                          })().map((subItem) => {
                            const isSubActive = pathname === subItem.url;

                            return (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={subItem.url}
                                    className={`flex items-center gap-2 py-1.5 px-3 rounded-md transition-all duration-150 ease-out  text-sm border border-transparent ${
                                      isSubActive
                                        ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border-neutral-100 dark:border-neutral-800 shadow-sm"
                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm"
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
                        className={`flex items-center gap-2 w-full p-2 rounded-md transition-all duration-150 ease-out  border border-transparent ${
                          isActive
                            ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border-neutral-100 dark:border-neutral-800 shadow-sm"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm"
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
                        className="flex items-center gap-2 w-full p-2 rounded-md transition-all duration-200 ease-in-out text-neutral-400 cursor-not-allowed"
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
                    className={`flex items-center gap-2 w-full p-2 rounded-md transition-all duration-150 ease-out  border border-transparent ${
                      pathname === "/feed/moderator"
                        ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border-neutral-100 dark:border-neutral-800 shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm"
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
        <div className="space-y-2">
          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="flex items-center gap-2 w-full p-2 rounded-md transition-all duration-150 ease-out text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white hover:shadow-sm border border-transparent cursor-pointer"
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
