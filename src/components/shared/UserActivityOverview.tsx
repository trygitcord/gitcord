"use client";

import React, { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MessageCircle, HardDriveUpload } from "lucide-react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useUserEvents } from "@/hooks/useGitHubQueries";

function UserActivityOverview() {
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

  const counts = useMemo(() => {
    const tempCounts = {
      PushEvent: 0,
      PullRequestEvent: 0,
      IssuesEvent: 0,
    };

    if (Array.isArray(userEventsData)) {
      for (const event of userEventsData) {
        if (tempCounts.hasOwnProperty(event.type)) {
          tempCounts[event.type as keyof typeof tempCounts]++;
        }
      }
    }

    return tempCounts;
  }, [userEventsData]);

  if (
    userLoading ||
    userEventsLoading ||
    !userData ||
    !userEventsData ||
    userError ||
    userEventsError
  )
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full h-full">
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
      </div>
    );

  return (
    <div className="w-full h-full ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full h-full ">
        {/* Push Events */}
        <Card
          icon={<Clock className="text-black w-6 h-6 dark:text-white" />}
          count={counts.PushEvent}
          label="Commits"
          filterType="PushEvent"
        />

        {/* Issues */}
        <Card
          icon={
            <MessageCircle className="text-black w-6 h-6 dark:text-white" />
          }
          count={counts.IssuesEvent}
          label="Issues"
          filterType="IssuesEvent"
        />

        {/* Pull Requests */}
        <Card
          icon={
            <HardDriveUpload className="text-black w-6 h-6 dark:text-white" />
          }
          count={counts.PullRequestEvent}
          label="Pull Requests"
          filterType="PullRequestEvent"
        />
      </div>
    </div>
  );
}

function Card({
  icon,
  count,
  label,
  filterType,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  filterType: string;
}) {
  return (
    <div className="w-full h-full bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 col-span-1 px-6 py-6 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between w-full">
        <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-900">
          {icon}
        </div>
        <Link
          href={`/feed/activity?filter=${filterType}`}
          className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-0.5"
        >
          View Details
        </Link>
      </div>
      <div className="flex flex-col pt-3 sm:pt-4">
        <div>
          <p className="text-black text-xl font-semibold dark:text-white">
            {count}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserActivityOverview;
