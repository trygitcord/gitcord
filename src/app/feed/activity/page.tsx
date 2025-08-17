"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { GitCommit, GitPullRequest, AlertCircle, SlidersHorizontal } from "lucide-react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useUserEvents } from "@/hooks/useGitHubQueries";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum RecentActivityType {
  Issue = "IssuesEvent",
  PullRequest = "PullRequestEvent",
  Commit = "PushEvent",
}

interface Commit {
  sha: string;
  message: string;
}

interface PullRequest {
  number: number;
  title: string;
  body?: string;
}

interface Issue {
  number: number;
  body?: string;
}

interface Actor {
  avatar_url: string;
  display_login: string;
}

interface Repo {
  name: string;
}

interface EventPayload {
  commits?: Commit[];
  pull_request?: PullRequest;
  issue?: Issue;
  action?: string;
}

interface GitHubEvent {
  type: RecentActivityType;
  actor: Actor;
  repo: Repo;
  payload?: EventPayload;
  created_at: string;
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

function renderActivityCard(event: GitHubEvent, expanded: boolean) {
  let icon: React.ReactElement | null = null;
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
                {event.payload?.commits?.slice(0, 3).map((commit: Commit) => (
                  <Link
                    key={commit.sha}
                    href={`https://github.com/${event.repo.name}/commit/${commit.sha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
                  >
                    #{commit.sha.slice(0, 7)}
                  </Link>
                ))}
                {event.payload?.commits?.length &&
                  event.payload.commits.length > 3 && (
                    <span className="text-xs font-mono bg-neutral-200 dark:bg-neutral-700 text-neutral-500 px-2 py-1 rounded">
                      +{event.payload.commits.length - 3} more
                    </span>
                  )}
              </div>
            )}
            {event.type === RecentActivityType.PullRequest && (
              <Link
                href={`https://github.com/${event.repo.name}/pull/${event.payload?.pull_request?.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                #{event.payload?.pull_request?.number}
              </Link>
            )}
            {event.type === RecentActivityType.Issue && (
              <Link
                href={`https://github.com/${event.repo.name}/issues/${event.payload?.issue?.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors"
              >
                #{event.payload?.issue?.number}
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
              {event.payload?.action} {event.type.toLowerCase()} in
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
        {expanded && (
          <div className="mt-2 border-t border-neutral-200 dark:border-neutral-800 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {event.type === RecentActivityType.Commit && (
              <div>
                <div className="font-semibold mb-1">All Commits:</div>
                <ul className="list-disc pl-4">
                  {event.payload?.commits?.map((commit: Commit) => (
                    <li key={commit.sha}>
                      <Link
                        href={`https://github.com/${event.repo.name}/commit/${commit.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#5BC898]"
                      >
                        {commit.message}
                      </Link>
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
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  useEffect(() => {
    document.title = "Feed | Activity";
  }, []);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUserProfile();

  const {
    data: userEventsData,
    isLoading: userEventsLoading,
    error: userEventsError,
  } = useUserEvents(userData?.username || null);

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<RecentActivityType | "all">(
    filterParam && Object.values(RecentActivityType).includes(filterParam as RecentActivityType) 
      ? filterParam as RecentActivityType 
      : "all"
  );

  if (
    userLoading ||
    userEventsLoading ||
    !userData ||
    !userEventsData ||
    userError ||
    userEventsError
  )
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
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="w-full h-[calc(100vh-12rem)] overflow-y-auto mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4"
              >
                <div className="flex border-l-4 border-neutral-300">
                  <div className="flex flex-col flex-1 gap-2 pl-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-7 h-7 rounded-full" />
                          <Skeleton className="h-4 w-24 rounded" />
                        </div>
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-4 w-40 rounded" />
                      </div>
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  const filteredEvents = userEventsData.filter((event: GitHubEvent) => {
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
        <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as RecentActivityType | "all")}>
          <SelectTrigger className="w-32">
            <SlidersHorizontal />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={RecentActivityType.Commit}>Commits</SelectItem>
            <SelectItem value={RecentActivityType.PullRequest}>Pull Requests</SelectItem>
            <SelectItem value={RecentActivityType.Issue}>Issues</SelectItem>
          </SelectContent>
        </Select>
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
            {shownEvents.map((event: GitHubEvent, idx: number) => (
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

export default function Page() {
  return (
    <Suspense>
      <ActivityPage />
    </Suspense>
  );
}
