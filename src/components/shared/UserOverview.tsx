"use client";

import { getUserProfile } from "@/stores/user/userProfileSlice";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function UserOverview() {
  const { data, loading, error, fetchData: getUser } = getUserProfile();

  useEffect(() => {
    getUser();
  }, []);

  console.log(data);

  if (loading || !data || error)
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
        <div className="w-full h-full bg-neutral-100 rounded-xl col-span-1">
          1
        </div>
        <div className="w-full h-full bg-neutral-100 rounded-xl col-span-1">
          1
        </div>
        <div className="w-full h-full bg-neutral-100 rounded-xl col-span-1">
          1
        </div>
      </div>
    </div>
  );
}

export default UserOverview;
