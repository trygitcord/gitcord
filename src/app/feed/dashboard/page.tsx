import UserActivityChart from "@/components/shared/UserActivityChart";
import UserActivityOverview from "@/components/shared/UserActivityOverview";
import UserProfileOverview from "@/components/shared/UserProfileOverview";
import UserRecentActivity from "@/components/shared/UserRecentActivity";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Feed | Dashboard",
    description: "View your latest feed updates",
  };
}

function page() {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-black min-h-screen px-4 sm:px-8 py-8">
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-black dark:text-white tracking-tight">
          Dashboard
          <Tooltip>
            <TooltipTrigger className="dark:text-neutral-300 text-neutral-700">
              <Info className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-neutral-700 dark:text-neutral-200">
                The data here comes entirely from github and no data is stored
                in any way.
              </p>
            </TooltipContent>
          </Tooltip>
        </h1>
        <p className="text-neutral-500 text-base dark:text-neutral-400 mt-2">
          Overview of your key data and insights.
        </p>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 pt-2 overflow-hidden">
        <div className="col-span-1 md:col-span-2 lg:col-span-6 min-h-0 overflow-hidden">
          <UserProfileOverview />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-6 min-h-0 overflow-hidden">
          <UserActivityOverview />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 min-h-0 overflow-hidden">
          <UserActivityChart />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-4 min-h-0 overflow-hidden">
          <UserRecentActivity />
        </div>
      </div>
    </div>
  );
}

export default page;
