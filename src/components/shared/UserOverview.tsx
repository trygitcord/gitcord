"use client";

import { getUserProfile } from "@/stores/user/userProfileSlice";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MessageCircle, HardDriveUpload } from "lucide-react";
import { userEventsSlice } from "@/stores/user/eventsSlice";

function UserOverview() {
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

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userData?.username) {
      getUserEvents(userData?.username);
    }
  }, [userData]);

  const counts = {
    PushEvent: 0,
    PullRequestEvent: 0,
    IssuesEvent: 0,
  };

  for (const event of Array.isArray(userEventsData) ? userEventsData : []) {
    if (counts.hasOwnProperty(event.type)) {
      counts[event.type as keyof typeof counts]++;
    }
  }

  if (userLoading || !userData || userError)
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
        <div className="w-full h-full bg-neutral-50 rounded-xl col-span-1 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="border-2 border-neutral-100 rounded-lg p-2">
              <Clock className="text-neutral-500 w-6 h-6" />
            </div>
            <div className="border-2 border-neutral-100 rounded-lg px-4 py-1.5 hover:cursor-pointer hover:bg-neutral-100 transition-all duration-300">
              <p className="text-neutral-700 text-sm">View Details</p>
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <div>
              <p className="text-neutral-800 text-2xl font-medium">
                {counts.PushEvent}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Commits</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-neutral-50 rounded-xl col-span-1 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="border-2 border-neutral-100 rounded-lg p-2">
              <MessageCircle className="text-neutral-500 w-6 h-6" />
            </div>
            <div className="border-2 border-neutral-100 rounded-lg px-4 py-1.5 hover:cursor-pointer hover:bg-neutral-100 transition-all duration-300">
              <p className="text-neutral-700 text-sm">View Details</p>
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <div>
              <p className="text-neutral-800 text-2xl font-medium">
                {counts.IssuesEvent}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Issues</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-neutral-50 rounded-xl col-span-1 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="border-2 border-neutral-100 rounded-lg p-2">
              <HardDriveUpload className="text-neutral-500 w-6 h-6" />
            </div>
            <div className="border-2 border-neutral-100 rounded-lg px-4 py-1.5 hover:cursor-pointer hover:bg-neutral-100 transition-all duration-300">
              <p className="text-neutral-700 text-sm">View Details</p>
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <div>
              <p className="text-neutral-800 text-2xl font-medium">
                {counts.PullRequestEvent}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pull Requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOverview;
