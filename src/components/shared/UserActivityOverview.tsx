"use client";

import { getUserProfile } from "@/stores/user/userProfileSlice";
import React, { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MessageCircle, HardDriveUpload } from "lucide-react";
import { userEventsSlice } from "@/stores/user/eventsSlice";

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

  const [countsReady, setCountsReady] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userData?.username) {
      getUserEvents(userData?.username);
    }
  }, [userData]);

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
      setCountsReady(true);
    }

    return tempCounts;
  }, [userEventsData]);

  const isLoading =
    userLoading ||
    !userData ||
    userError ||
    userEventsLoading ||
    userEventsError ||
    !userEventsData ||
    !countsReady;

  if (isLoading)
    return (
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
      </div>
    );

  return (
    <div className="w-full h-36">
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        {/* Push Events */}
        <Card
          icon={
            <Clock className="text-neutral-800 w-6 h-6 dark:text-neutral-300" />
          }
          count={counts.PushEvent}
          label="Commits"
        />

        {/* Issues */}
        <Card
          icon={
            <MessageCircle className="text-neutral-800 w-6 h-6 dark:text-neutral-300" />
          }
          count={counts.IssuesEvent}
          label="Issues"
        />

        {/* Pull Requests */}
        <Card
          icon={
            <HardDriveUpload className="text-neutral-800 w-6 h-6 dark:text-neutral-300" />
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
    <div className="w-full h-full bg-neutral-50 rounded-xl col-span-1 px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full">
        <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
          {icon}
        </div>
        <div className="border-2 border-neutral-100 rounded-lg px-4 py-1.5 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 dark:border-neutral-800">
          <p className="text-neutral-700 text-sm dark:text-neutral-300">
            View Details
          </p>
        </div>
      </div>
      <div className="flex flex-col pt-4">
        <div>
          <p className="text-neutral-800 text-xl font-medium dark:text-neutral-200">
            {count}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserActivityOverview;
