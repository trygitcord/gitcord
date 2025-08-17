"use client";

import React from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Eye } from "lucide-react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { useGitHubUser } from "@/hooks/useGitHubQueries";

function UserProfileOverview() {
  const { data: userData, isLoading, error } = useUserProfile();
  const { data: githubUser } = useGitHubUser(userData?.username || null);

  if (isLoading || !userData || error) {
    return <Skeleton className="w-full h-full" />;
  }

  if (error || !userData) {
    return (
      <div className="w-full bg-neutral-50 rounded-xl dark:bg-neutral-900 p-6">
        <div className="text-center text-neutral-500 dark:text-neutral-400">
          Failed to load profile data
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl dark:bg-neutral-900">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar Section */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
            <Image
              src={userData.avatar_url}
              alt={`${userData.name}'s avatar`}
              fill
              className="object-cover"
            />
          </div>

          {/* User Info Section */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-neutral-700 dark:text-neutral-200">
                    {userData.name}
                  </h2>
                  {/* Profile Views - Mobile Only */}
                  <div className="flex sm:hidden items-center gap-1.5 text-sm">
                    <Eye className="w-5 h-5 text-neutral-500 dark:text-neutral-300" />
                    <span className="font-medium text-neutral-500 dark:text-neutral-300">
                      {userData.stats?.view_count || 0}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {userData.isModerator && (
                    <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full dark:bg-neutral-800 dark:text-neutral-300">
                      Moderator
                    </span>
                  )}
                  {userData.premium?.isPremium && (
                    <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full flex items-center gap-1 dark:bg-neutral-800 dark:text-neutral-300">
                      <Crown className="w-3 h-3 text-[#5BC898]" />
                      Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Views - Desktop Only */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm">
                <Eye className="w-5 h-5 text-neutral-500 dark:text-neutral-300" />
                <span className="font-medium text-neutral-500 dark:text-neutral-300">
                  {userData.stats?.view_count || 0}
                </span>
              </div>
            </div>

            <p className="text-neutral-600 mt-1 dark:text-neutral-300 text-center sm:text-left">
              @{userData.username}
            </p>

            {userData.bio && (
              <p className="text-neutral-700 mt-3 text-sm leading-relaxed dark:text-neutral-300 text-center sm:text-left">
                {userData.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="mt-4 flex gap-8 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium text-neutral-700 dark:text-neutral-200">
                  {githubUser?.followers || 0}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-neutral-700 dark:text-neutral-200">
                  {githubUser?.following || 0}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">Following</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileOverview;
