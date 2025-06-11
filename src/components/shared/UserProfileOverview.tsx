"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { getUserProfile } from "@/stores/user/userProfileSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Eye } from "lucide-react";

function UserProfileOverview() {
  const {
    data: userData,
    loading,
    error,
    fetchData: getUser,
  } = getUserProfile();

  useEffect(() => {
    getUser();
  }, []);

  if (loading || !userData || error) {
    return (
      <div className="w-full bg-neutral-50 rounded-xl">
        <div className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-50 rounded-xl">
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar Section */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={userData.avatar_url}
              alt={`${userData.name}'s avatar`}
              fill
              className="object-cover"
            />
          </div>

          {/* User Info Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-neutral-700">
                  {userData.name}
                </h2>
                {userData.isModerator && (
                  <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-[#5BC898] rounded-full">
                    Moderator
                  </span>
                )}
                {userData.premium?.isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>

              {/* Profile Views */}
              <div className="flex items-center gap-1.5 text-sm">
                <Eye className="w-5 h-5 text-neutral-500" />
                <span className="font-medium text-neutral-500">
                  {userData.stats?.view_count || 0}
                </span>
              </div>
            </div>

            <p className="text-neutral-600 mt-1">@{userData.username}</p>

            {userData.bio && (
              <p className="text-neutral-700 mt-3 text-sm leading-relaxed">
                {userData.bio}
              </p>
            )}

            {/* Contact Links */}
            <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600">
              {userData.email && (
                <a
                  href={`mailto:${userData.email}`}
                  className="flex items-center gap-1 hover:text-[#5BC898] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {userData.email}
                </a>
              )}

              <a
                href={userData.github_profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#5BC898] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileOverview;
