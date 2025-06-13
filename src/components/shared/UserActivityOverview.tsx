"use client";

import { getUserProfile } from "@/stores/user/userProfileSlice";
import React, { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MessageCircle, HardDriveUpload } from "lucide-react";
import { userEventsSlice } from "@/stores/user/eventsSlice";
import Link from "next/link";

function UserActivityOverview() {
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

  useEffect(() => {
    setMounted(true);
    getUser();
  }, []);

  useEffect(() => {
    if (mounted && userData?.username) {
      getUserEvents(userData?.username);
    }
  }, [userData, mounted]);

  const counts = useMemo(() => {
    if (!mounted) return { PushEvent: 0, PullRequestEvent: 0, IssuesEvent: 0 };

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
  }, [userEventsData, mounted]);

  const isLoading =
    !mounted ||
    userLoading ||
    !userData ||
    userError ||
    userEventsLoading ||
    userEventsError ||
    !userEventsData;

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full h-full">
        <Skeleton className="w-full h-32 sm:h-36" />
        <Skeleton className="w-full h-32 sm:h-36" />
        <Skeleton className="w-full h-32 sm:h-36" />
      </div>
    );

  return (
    <div className="w-full h-auto sm:h-36">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full h-full">
        {/* Push Events */}
        <Card
          icon={
            <Clock className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
          }
          count={counts.PushEvent}
          label="Commits"
        />

        {/* Issues */}
        <Card
          icon={
            <MessageCircle className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
          }
          count={counts.IssuesEvent}
          label="Issues"
        />

        {/* Pull Requests */}
        <Card
          icon={
            <HardDriveUpload className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
          }
          count={counts.PullRequestEvent}
          label="Pull Requests"
        />
      </div>
    </div>
  );
}

function Card({
  icon,
  count,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
}) {
  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl col-span-1 px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full">
        <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
          {icon}
        </div>
        <div className="border-2 border-neutral-100 rounded-lg px-3 sm:px-4 py-1.5 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 dark:border-neutral-800">
          <Link href={`/feed/activity`} className="w-full h-full">
            <p className="text-neutral-700 text-xs sm:text-sm dark:text-neutral-300">
              View Details
            </p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col pt-3 sm:pt-4">
        <div>
          <p className="text-neutral-800 text-lg sm:text-xl font-medium dark:text-neutral-200">
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
