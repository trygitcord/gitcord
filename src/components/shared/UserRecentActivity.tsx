"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    getUserEvents();
  }, []);

  const isLoading =
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
    <div className="w-full h-full bg-neutral-50 rounded-xl px-6 py-4 dark:bg-neutral-900">
      <div>
        <div className="flex items-center gap-4">
          <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
            <FileChartColumn className="text-neutral-800 w-6 h-6 dark:text-neutral-300" />
          </div>
          <div>
            <h2 className="text-neutral-800 text-xl font-medium dark:text-neutral-200">
              Recent Activities
            </h2>
            <p className="text-sm text-neutral-500">Your recent activities</p>
          </div>
        </div>
        <div className="w-full h-full pt-4">
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
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
            <Image
              src={event.actor.avatar_url}
              alt={event.actor.display_login}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full"
            />
            <span className="text-neutral-600 dark:text-neutral-300">
              {event.actor.display_login}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              has been commit to
            </span>
            <span className="text-neutral-600 dark:text-neutral-300">
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
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
            <Image
              src={event.actor.avatar_url}
              alt={event.actor.display_login}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full"
            />
            <span className="text-neutral-600 dark:text-neutral-300">
              {event.actor.display_login}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              opened a pull request in
            </span>
            <span className="text-neutral-600 dark:text-neutral-300">
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {issueUrl && (
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                {issueNumber}
              </a>
            )}
            <Image
              src={event.actor.avatar_url}
              alt={event.actor.display_login}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full"
            />
            <span className="text-neutral-600 dark:text-neutral-300">
              {event.actor.display_login}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              opened an issue in
            </span>
            <span className="text-neutral-600 dark:text-neutral-300">
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
  const hasMore = events.length > 5;

  return (
    <div className="space-y-4 mt-4">
      {shownEvents.map((event, idx) => (
        <div key={idx}>{renderActivityCard(event)}</div>
      ))}
      {hasMore && (
        <div className="text-center text-2xl text-neutral-400 select-none">
          ...
        </div>
      )}
    </div>
  );
}

export default UserRecentActivity;
