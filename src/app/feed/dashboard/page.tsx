import React from "react";

function page() {
  return (
    <div className="w-full h-full">
      <h1 className="text-lg font-medium">Dashboard</h1>
      <div className="grid grid-cols-3 mt-4 gap-x-6 gap-y-6 w-full">
        <div className="bg-neutral-100 h-40 rounded-xl"></div>
        <div className="bg-neutral-100 h-40 rounded-xl"></div>
        <div className="bg-neutral-100 h-40 rounded-xl"></div>

        <div className="col-span-full grid grid-cols-[1.5fr_1.5fr] gap-x-4 gap-y-2">
          <div className="bg-neutral-100 h-80 rounded-xl"></div>
          <div className="bg-neutral-100 h-80 rounded-xl"></div>
        </div>

        <div className="bg-neutral-100 h-64 rounded-xl col-span-3"></div>
      </div>
    </div>
  );
}

export default page;
