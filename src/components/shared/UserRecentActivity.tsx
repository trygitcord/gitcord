"use client";

import React, { useEffect, useState } from "react";
import { FileChartColumn } from "lucide-react";
import { userEventsSlice } from "@/stores/user/eventsSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

enum RecentActivityType {
  Issue = "IssuesEvent",
  PullRequest = "PullRequestEvent",
  Commit = "PushEvent",
}

function UserRecentActivity() {
  const {
    data: userEventsData,
    loading: userEventsLoading,
    error: userEventsError,
    fetchData: getUserEvents,
  } = userEventsSlice();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getUserEvents();
  }, []);

  const isLoading =
    !mounted ||
    userEventsLoading ||
    userEventsError ||
    !userEventsData ||
    userEventsData.length === 0;

  if (isLoading)
    return (
      <div className="w-full h-96">
        <Skeleton className="w-full h-96" />
      </div>
    );

  return (
    <div className="w-full h-96 bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div>
        <div className="flex items-center gap-3 sm:gap-4">
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
              <a
                href={commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                #{commitShortSha}
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
              has been commit to
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
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                {prNumber}
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
              opened a pull request in
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
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                {issueNumber}
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
              opened an issue in
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
      );
    }
    default:
      return null;
  }
}

function MessageCard({ events }: { events: any[] }) {
  const shownEvents = events.slice(0, 5);

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
