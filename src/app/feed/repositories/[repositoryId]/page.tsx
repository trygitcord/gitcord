"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { RepositoryBasicInformation } from "@/components/shared/RepositoryBasicInformation";
import { ContributorsStats } from "@/components/shared/ContributorsStats";
import { LastCommits } from "@/components/shared/LastCommits";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguagesPieChart } from "@/components/shared/LanguagesPieChart";
import { StatCard } from "@/components/shared/StatCard";
import {
  useRepository,
  useRepositoryCommitActivity,
  useRepositoryCommits,
  useRepositoryLanguages,
} from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, GitCommit } from "lucide-react";

interface RepositoryData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  watchers_count: number;
}

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

function Page() {
  const params = useParams();
  const repositoryId = params.repositoryId as string;

  // Since repositoryId might be URL encoded, decode it first
  const decodedRepositoryId = repositoryId
    ? decodeURIComponent(repositoryId)
    : "";

  // Get user profile to determine owner if not provided
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  // Parse owner and repo from repositoryId (trying different formats)
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

  const [mainLanguage, setMainLanguage] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // TanStack Query hooks - already have internal enabled checks
  const {
    data: repoData,
    isLoading: repoLoading,
    error: repoError,
  } = useRepository(owner, repo);

  const {
    data: languagesData,
    isLoading: languagesLoading,
    error: languagesError,
  } = useRepositoryLanguages(owner, repo);

  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
    isFetching: activityFetching,
    refetch: refetchActivity,
  } = useRepositoryCommitActivity(owner, repo);

  const {
    data: commitsData,
    isLoading: commitsLoading,
    error: commitsError,
  } = useRepositoryCommits(owner, repo);

  useEffect(() => {
    document.title = `Feed | Repository | ${
      repo ? repo.charAt(0).toUpperCase() + repo.slice(1) : "Repository"
    }`;
  }, [repo]);

  // Process languages data when it changes
  useEffect(() => {
    if (languagesData && typeof languagesData === "object") {
      const languageEntries = Object.entries(languagesData);
      const totalBytes = languageEntries.reduce(
        (sum, [_, bytes]) => sum + (bytes as number),
        0
      );

      const processedData = languageEntries
        .map(([language, bytes]) => ({
          name: language,
          value: (((bytes as number) / totalBytes) * 100).toFixed(2),
          bytes: bytes as number,
        }))
        .sort((a, b) => b.bytes - a.bytes);

      if (processedData.length > 0) {
        setMainLanguage(processedData[0].name);
      }
    }
  }, [languagesData]);

  // Process activity data when it changes
  useEffect(() => {
    if (activityData && Array.isArray(activityData)) {
      const formattedData = activityData.map((week: any) => ({
        week: new Date(week.week * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        commits: week.total,
      }));
      setChartData(formattedData);
    } else {
      setChartData([]);
    }
  }, [activityData]);

  // Show loading state
  const isLoading =
    profileLoading || repoLoading || languagesLoading || commitsLoading;

  // Show commit activity loading separately
  const isActivityLoading = activityLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Show error state
  const error = repoError || languagesError || activityError || commitsError;
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {error instanceof Error
              ? error.message
              : "An error occurred while loading repository data"}
          </p>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!repoData || !owner || !repo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-600 dark:text-neutral-400">
          No repository data found
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-1">
        <Link
          href="/feed/repositories"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>
      <div className="pt-2">
        <h1 className="text-lg font-medium">Repository</h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Explore the latest activity in this repository.
        </p>
      </div>

      {repoData && (
        <>
          <RepositoryBasicInformation
            name={repoData.name}
            description={repoData.description}
            visibility="public"
            language={mainLanguage}
            stars={repoData.stargazers_count}
            forks={repoData.forks_count}
            watchers={repoData.watchers_count}
            lastUpdate={repoData.updated_at}
            commitGraph={chartData}
            isLoadingCommitActivity={isActivityLoading}
            isFetchingCommitActivity={activityFetching}
            activityError={activityError}
            refetchActivity={refetchActivity}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4">
            <StatCard
              icon={
                <Star className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
              }
              count={repoData.stargazers_count}
              label="Stars"
            />
            <StatCard
              icon={
                <GitFork className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
              }
              count={repoData.forks_count}
              label="Forks"
            />
            <StatCard
              icon={
                <GitCommit className="text-neutral-800 w-5 h-5 sm:w-6 sm:h-6 dark:text-neutral-300" />
              }
              count={commitsData?.length || 0}
              label="Commits"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4">
            <div className="space-y-4">
              <ContributorsStats owner={owner || ""} repo={repo || ""} />
              {languagesData && (
                <div>
                  <LanguagesPieChart languages={languagesData} />
                </div>
              )}
            </div>
            {commitsData && (
              <div className="sm:col-span-2">
                <LastCommits
                  commits={commitsData}
                  owner={owner || ""}
                  repo={repo || ""}
                  isMain={true}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
