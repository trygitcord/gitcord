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
import React from "react";

function page() {
  return (
    <div className="w-full">
      <h1 className="text-lg font-medium flex items-center gap-2">
        Dashboard
        <Tooltip>
          <TooltipTrigger className="dark:text-neutral-300">
            <Info className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              The data here comes entirely from github and no data is stored in
              any way.
            </p>
          </TooltipContent>
        </Tooltip>
      </h1>
      <p className="text-neutral-500 text-sm dark:text-neutral-400">
        Overview of your key data and insights.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-6">
          <UserProfileOverview />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-6">
          <UserActivityOverview />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <UserActivityChart />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-4">
          <UserRecentActivity />
        </div>
      </div>
    </div>
  );
}

export default page;
