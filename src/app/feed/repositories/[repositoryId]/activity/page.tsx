"use client";

import { LastCommits } from "@/components/shared/LastCommits";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositoryCommits } from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

function page() {
  const params = useParams();
  const repositoryId = params.repositoryId as string;

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

  const isLoading = profileLoading || commitsLoading;

  // Error state
  if (commitsError) {
    return (
      <div>
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

        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
            We couldn't load the repository activity. This might be due to
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
      <div>
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

        <div className="mt-6 space-y-4">
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
    <div>
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

      <div className="mt-4 pb-8">
        <LastCommits
          commits={commitsData || []}
          owner={owner || ""}
          repo={repo || ""}
          slice={1000}
        />
      </div>
    </div>
  );
}

export default page;
