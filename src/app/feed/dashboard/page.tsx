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
          <TooltipTrigger>
            <Info className="w-4 h-4 text-neutral-800" />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              The data here comes entirely from github and no data is stored in
              any way.
            </p>
          </TooltipContent>
        </Tooltip>
      </h1>
      <div className="grid grid-cols-6 gap-4 mt-6">
        <div className="col-span-6">
          <UserProfileOverview />
        </div>
        <div className="col-span-6">
          <UserActivityOverview />
        </div>
        <div className="col-span-2">
          <UserActivityChart />
        </div>
        <div className="col-span-4">
          <UserRecentActivity />
        </div>
      </div>
    </div>
  );
}

export default page;
