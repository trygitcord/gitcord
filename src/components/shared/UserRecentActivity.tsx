"use client";

import React, { useEffect, useState } from "react";
import { FileChartColumn } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useUserEvents } from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

enum RecentActivityType {
  Issue = "IssuesEvent",
  PullRequest = "PullRequestEvent",
  Commit = "PushEvent",
}

function UserRecentActivity() {
  const { data: userData, isLoading: userLoading } = useUserProfile();

  const {
    data: userEventsData,
    isLoading: userEventsLoading,
    error: userEventsError,
  } = useUserEvents(userData?.username);

  if (
    userLoading ||
    userEventsLoading ||
    !userData ||
    !userEventsData ||
    userEventsError
  )
    return (
      <div className="w-full h-full">
        <Skeleton className="w-full h-full" />
      </div>
    );

  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div>
        <div className="flex items-center w-full h-full gap-3 sm:gap-4">
          <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
            <FileChartColumn className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
          </div>
          <div>
            <h2 className="text-neutral-800 text-lg sm:text-xl font-medium dark:text-neutral-200">
              Recent Activities
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Your recent activities
            </p>
          </div>
        </div>
        <div className="w-full h-full">
          <MessageCard events={userEventsData} />
        </div>
      </div>
    </div>
  );
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

function renderActivityCard(event: any) {
  switch (event.type) {
    case RecentActivityType.Commit: {
      const firstCommit = event.payload?.commits?.[0];
      const commitUrl = firstCommit
        ? `https://github.com/${event.repo.name}/commit/${firstCommit.sha}`
        : null;
      const commitShortSha = firstCommit ? firstCommit.sha.slice(0, 7) : null;
      return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {commitUrl && (
              <Link
                href={commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                #{commitShortSha}
              </Link>
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
              has been commit to
            </span>
            <span className="text-neutral-600 dark:text-neutral-300 text-sm">
              <Link
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#5BC898] transition-colors"
              >
                {event.repo.name}
              </Link>
            </span>
          </div>
          <span className="text-neutral-400 text-xs ml-2">
            {timeAgo(event.created_at)}
          </span>
        </div>
      );
    }
    case RecentActivityType.PullRequest: {
      const pr = event.payload?.pull_request;
      const prUrl = pr?.html_url;
      const prNumber = pr ? `#${pr.number}` : null;
      return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {prUrl && (
              <Link
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                {prNumber}
              </Link>
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
              opened a pull request in
            </span>
            <span className="text-neutral-600 dark:text-neutral-300 text-sm">
              <Link
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#5BC898] transition-colors"
              >
                {event.repo.name}
              </Link>
            </span>
          </div>
          <span className="text-neutral-400 text-xs ml-2">
            {timeAgo(event.created_at)}
          </span>
        </div>
      );
    }
    case RecentActivityType.Issue: {
      const issue = event.payload?.issue;
      const issueUrl = issue?.html_url;
      const issueNumber = issue ? `#${issue.number}` : null;
      return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {issueUrl && (
              <Link
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                {issueNumber}
              </Link>
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
              opened an issue in
            </span>
            <span className="text-neutral-600 dark:text-neutral-300 text-sm">
              <Link
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#5BC898] transition-colors"
              >
                {event.repo.name}
              </Link>
            </span>
          </div>
          <span className="text-neutral-400 text-xs ml-2">
            {timeAgo(event.created_at)}
          </span>
        </div>
      );
    }
    default:
      return null;
  }
}

function MessageCard({ events }: { events: any[] }) {
  const isMobile = useIsMobile();

  const getEventCount = () => {
    if (typeof window === "undefined") return 5;
    const width = window.innerWidth;
    if (width < 640) return 3;
    if (width < 768) return 4;
    if (width < 1024) return 5;
    if (width < 1280) return 6;
    if (width < 1536) return 8;
    if (width < 1920) return 10;
    return 12;
  };

  const [eventCount, setEventCount] = useState(5);

  useEffect(() => {
    const updateEventCount = () => setEventCount(getEventCount());
    updateEventCount();
    window.addEventListener("resize", updateEventCount);
    return () => window.removeEventListener("resize", updateEventCount);
  }, []);

  const shownEvents = events.slice(0, eventCount);

  return (
    <div className="space-y-4 mt-4">
      {shownEvents.map((event, idx) => (
        <div
          key={idx}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {renderActivityCard(event)}
        </div>
      ))}
    </div>
  );
}

export default UserRecentActivity;
