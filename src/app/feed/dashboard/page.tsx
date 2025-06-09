import UserOverview from "@/components/shared/UserOverview";
import React from "react";

function page() {
  return (
    <div className="w-full h-full">
      <h1 className="text-lg font-medium">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <UserOverview />
        </div>
      </div>
    </div>
  );
}

export default page;
