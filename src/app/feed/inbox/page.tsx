import React from "react";
import { MessageSquare } from "lucide-react";

function Page() {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-lg font-medium flex items-center gap-2">Inbox</h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Manage your messages and notifications in one place.
        </p>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-8 mt-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-[#5BC898]/10 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-[#5BC898]" />
          </div>
          <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
            Welcome to Gitcord Inbox
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-sm">
            Your central hub for all GitHub-related messages and notifications.
            Stay connected with your repositories, organizations, and team
            members.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
