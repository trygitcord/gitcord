"use client";

import React, { useEffect } from "react";
import { ChartColumnBig } from "lucide-react";
import { ChartTooltipDefault } from "../ui/chart-tooltip-default";
import { userEventsSlice } from "@/stores/user/eventsSlice";
import { Skeleton } from "@/components/ui/skeleton";

function UserActivityChart() {
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
      <div className="w-full h-72 sm:h-96">
        <Skeleton className="w-full h-72 sm:h-96" />
      </div>
    );

  return (
    <div className="w-full h-72 sm:h-96 bg-neutral-50 rounded-xl px-3 sm:px-6 py-3 sm:py-4 dark:bg-neutral-900">
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-neutral-100 rounded-lg p-1.5 sm:p-2 dark:bg-neutral-800">
            <ChartColumnBig className="text-neutral-800 w-4 h-4 sm:w-6 sm:h-6 dark:text-neutral-300" />
          </div>
          <div>
            <h2 className="text-neutral-800 text-base sm:text-xl font-medium dark:text-neutral-200">
              Activity
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Your stats by day
            </p>
          </div>
        </div>
        <div className="flex-1 min-h-0 mt-2 sm:mt-4">
          <ChartTooltipDefault data={userEventsData} />
        </div>
      </div>
    </div>
  );
}

export default UserActivityChart;
