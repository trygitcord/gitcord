"use client";

import { LastCommits } from "@/components/shared/LastCommits";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRepositoryCommits } from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { ArrowLeft, AlertCircle, RefreshCw, Filter, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

function Page() {
  const params = useParams();
  const repositoryId = params.repositoryId as string;
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Since repositoryId might be URL encoded, decode it first
  const decodedRepositoryId = repositoryId
    ? decodeURIComponent(repositoryId)
    : "";

  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  const { owner, repo } = useMemo(() => {
    let parsedOwner: string | null = null;
    let parsedRepo: string | null = null;

    if (decodedRepositoryId) {
      if (decodedRepositoryId.includes("/")) {
        // Format: "owner/repo"
        [parsedOwner, parsedRepo] = decodedRepositoryId.split("/");
      } else {
        // Format: just "repo" - we need to get owner from user profile
        parsedRepo = decodedRepositoryId;
        // If owner is not in the URL, use the current user's username
        if (userProfile?.username) {
          parsedOwner = userProfile.username;
        }
      }
    }

    return { owner: parsedOwner, repo: parsedRepo };
  }, [decodedRepositoryId, userProfile?.username]);

  const {
    data: commitsData,
    isLoading: commitsLoading,
    error: commitsError,
  } = useRepositoryCommits(owner, repo);

  // Extract unique users from commits
  const uniqueUsers = useMemo(() => {
    if (!commitsData) return [];

    const users = new Map<string, { login: string; avatar_url: string }>();

    commitsData.forEach((commit) => {
      if (commit.author) {
        users.set(commit.author.login, {
          login: commit.author.login,
          avatar_url: commit.author.avatar_url,
        });
      }
    });

    return Array.from(users.values()).sort((a, b) =>
      a.login.localeCompare(b.login)
    );
  }, [commitsData]);

  // Filter commits based on selected user
  const filteredCommits = useMemo(() => {
    if (!commitsData) return [];

    if (selectedUser === "all") {
      return commitsData;
    }

    return commitsData.filter(
      (commit) => commit.author?.login === selectedUser
    );
  }, [commitsData, selectedUser]);

  const isLoading = profileLoading || commitsLoading;

  // Error state
  if (commitsError) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-shrink-0">
          <div className="pt-1">
            <Link
              href={`/feed/repositories`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
          <div className="pt-2">
            <h1 className="text-lg font-medium">Activity</h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Latest activity in this repository.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
            We couldn&apos;t load the repository activity. This might be due to
            network issues or the repository being private.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-shrink-0">
          <div className="pt-1">
            <Link
              href={`/feed/repositories`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
          <div className="pt-2">
            <h1 className="text-lg font-medium">Activity</h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Latest activity in this repository.
            </p>
          </div>
        </div>

        <div className="flex-1 mt-6 space-y-4 overflow-hidden">
          {/* Repository info skeleton */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Commits skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-900 p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-shrink-0">
        <div className="pt-1">
          <Link
            href={`/feed/repositories`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
        <div className="pt-2 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Activity</h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Latest activity in this repository.
            </p>
          </div>

          {/* User Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors">
                <Filter className="w-4 h-4" />
                <span>
                  {selectedUser === "all"
                    ? "All Users"
                    : uniqueUsers.find((u) => u.login === selectedUser)
                        ?.login || "All Users"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setSelectedUser("all")}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>All Users</span>
                {selectedUser === "all" && (
                  <span className="ml-auto text-xs text-neutral-500">
                    ({commitsData?.length || 0})
                  </span>
                )}
              </DropdownMenuItem>

              {uniqueUsers.map((user) => (
                <DropdownMenuItem
                  key={user.login}
                  onClick={() => setSelectedUser(user.login)}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={user.avatar_url}
                    alt={user.login}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="truncate">{user.login}</span>
                  {selectedUser === user.login && (
                    <span className="ml-auto text-xs text-neutral-500">
                      ({filteredCommits.length})
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 mt-4 overflow-hidden mb-8">
        <LastCommits
          commits={filteredCommits}
          owner={owner || ""}
          repo={repo || ""}
          slice={1000}
        />
      </div>
    </div>
  );
}

export default Page;
