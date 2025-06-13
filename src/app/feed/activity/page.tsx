"use client";

import React, { useEffect, useState } from "react";
import { userEventsSlice } from "@/stores/user/eventsSlice";
import { getUserProfile } from "@/stores/user/userProfileSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { GitCommit, GitPullRequest, AlertCircle } from "lucide-react";

enum RecentActivityType {
  Issue = "IssuesEvent",
  PullRequest = "PullRequestEvent",
  Commit = "PushEvent",
}

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function renderActivityCard(event: any, expanded: boolean) {
  let icon = null;
  let borderColor = "";
  switch (event.type) {
    case RecentActivityType.Commit:
      icon = <GitCommit className="w-5 h-5 text-[#5BC898]" />;
      borderColor = "border-l-4 border-[#5BC898]";
      break;
    case RecentActivityType.PullRequest:
      icon = <GitPullRequest className="w-5 h-5 text-purple-500" />;
      borderColor = "border-l-4 border-purple-500";
      break;
    case RecentActivityType.Issue:
      icon = <AlertCircle className="w-5 h-5 text-yellow-400" />;
      borderColor = "border-l-4 border-yellow-400";
      break;
    default:
      borderColor = "border-l-4 border-neutral-300";
  }

  return (
    <div className={`flex ${borderColor} bg-inherit rounded-xl`}>
      <div className="flex flex-col flex-1 gap-2 pl-3">
        <div className="flex items-center gap-2">{icon}</div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {event.type === RecentActivityType.Commit && (
              <div className="flex flex-wrap gap-1">
                {event.payload?.commits?.slice(0, 3).map((commit: any) => (
                  <a
                    key={commit.sha}
                    href={`https://github.com/${event.repo.name}/commit/${commit.sha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
                  >
                    #{commit.sha.slice(0, 7)}
                  </a>
                ))}
                {event.payload?.commits?.length > 3 && (
                  <span className="text-xs font-mono bg-neutral-200 dark:bg-neutral-700 text-neutral-500 px-2 py-1 rounded">
                    +{event.payload?.commits?.length - 3} more
                  </span>
                )}
              </div>
            )}
            {event.type === RecentActivityType.PullRequest && (
              <a
                href={`https://github.com/${event.repo.name}/pull/${event.payload?.pull_request?.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                #{event.payload?.pull_request?.number}
              </a>
            )}
            {event.type === RecentActivityType.Issue && (
              <a
                href={`https://github.com/${event.repo.name}/issues/${event.payload?.issue?.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                #{event.payload?.issue?.number}
              </a>
            )}
            <div className="flex items-center gap-2">
              <Image
                src={event.actor.avatar_url}
                alt={event.actor.display_login}
                width={28}
                height={28}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
              />
              <span className="text-neutral-600 dark:text-neutral-300 text-sm">
                {event.actor.display_login}
              </span>
            </div>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">
              {event.payload?.action} {event.type.toLowerCase()} in
            </span>
            <span className="text-neutral-600 dark:text-neutral-300 text-sm">
              <a
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#5BC898] transition-colors"
              >
                {event.repo.name}
              </a>
            </span>
          </div>
          <span className="text-neutral-400 text-xs ml-2">
            {timeAgo(event.created_at)}
          </span>
        </div>
        {expanded && (
          <div className="mt-2 border-t border-neutral-200 dark:border-neutral-800 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {event.type === RecentActivityType.Commit && (
              <div>
                <div className="font-semibold mb-1">All Commits:</div>
                <ul className="list-disc pl-4">
                  {event.payload?.commits?.map((commit: any) => (
                    <li key={commit.sha}>
                      <a
                        href={`https://github.com/${event.repo.name}/commit/${commit.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#5BC898]"
                      >
                        {commit.message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {event.type === RecentActivityType.PullRequest && (
              <div>
                <div className="text-base mb-1 text-neutral-800 dark:text-neutral-300">
                  {event.payload?.pull_request?.title}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {event.payload?.pull_request?.body || "No description."}
                </div>
              </div>
            )}
            {event.type === RecentActivityType.Issue && (
              <div>
                <div className="font-semibold mb-1">Issue Description:</div>
                <div>{event.payload?.issue?.body || "No description."}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityPage() {
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    fetchData: getUser,
  } = getUserProfile();

  const {
    data: userEventsData,
    loading: userEventsLoading,
    error: userEventsError,
    fetchData: getUserEvents,
  } = userEventsSlice();

  const [mounted, setMounted] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<RecentActivityType | "all">(
    "all"
  );

  useEffect(() => {
    setMounted(true);
    getUser();
  }, []);

  useEffect(() => {
    if (mounted && userData?.username) {
      getUserEvents(userData.username);
    }
  }, [userData, mounted]);

  const isLoading =
    !mounted ||
    userLoading ||
    !userData ||
    userError ||
    userEventsLoading ||
    userEventsError ||
    !userEventsData ||
    userEventsData.length === 0;

  if (isLoading)
    return (
      <div className="w-full min-h-screen">
        <Skeleton className="w-full h-screen" />
      </div>
    );

  const filteredEvents = userEventsData.filter((event: any) => {
    if (activeFilter === "all") return true;
    return event.type === activeFilter;
  });

  const shownEvents = filteredEvents.slice(0, 30);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-medium flex items-center gap-2">
            Activity
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Track all recent actions and updates in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-[#5BC898] text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter(RecentActivityType.Commit)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === RecentActivityType.Commit
                ? "bg-[#5BC898] text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <GitCommit className="w-4 h-4" />
            Commits
          </button>
          <button
            onClick={() => setActiveFilter(RecentActivityType.PullRequest)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === RecentActivityType.PullRequest
                ? "bg-purple-500 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            Pull Requests
          </button>
          <button
            onClick={() => setActiveFilter(RecentActivityType.Issue)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === RecentActivityType.Issue
                ? "bg-yellow-400 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Issues
          </button>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-12rem)] overflow-y-auto mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {shownEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-neutral-400 dark:text-neutral-500 text-lg mb-2">
              {activeFilter === "all"
                ? "No activities found"
                : activeFilter === RecentActivityType.Commit
                ? "No commits found"
                : activeFilter === RecentActivityType.PullRequest
                ? "No pull requests found"
                : "No issues found"}
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Try selecting a different filter or check back later
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {shownEvents.map((event: any, idx: number) => (
              <div
                key={idx}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              >
                {renderActivityCard(event, expandedIdx === idx)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityPage;
