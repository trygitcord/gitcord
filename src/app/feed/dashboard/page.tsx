import UserOverview from "@/components/shared/UserOverview";
import React from "react";

function page() {
  return (
    <div className="w-full h-full">
      <h1 className="text-lg font-medium">Dashboard</h1>
      <div className="w-full h-full pt-4">
        <UserOverview />
      </div>
    </div>
  );
}

export default page;
