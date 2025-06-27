"use client";

import { ArrowLeft, Star, GitFork, GitCommit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRepository,
  useRepositoryLanguages,
  useRepositoryCommitActivity,
  useRepositoryCommits,
} from "@/hooks/useGitHubQueries";
import { RepositoryBasicInformation } from "@/components/shared/RepositoryBasicInformation";
import { StatCard } from "@/components/shared/StatCard";
import { LanguagesPieChart } from "@/components/shared/LanguagesPieChart";
import { ContributorsStats } from "@/components/shared/ContributorsStats";
import { LastCommits } from "@/components/shared/LastCommits";

function Page() {
  const params = useParams();
  const repoName = params.repoName as string;
  const orgName = params.organizationId as string;

  // Tanstack Query hooks
  const {
    data: repoData,
    isLoading: repoLoading,
    error: repoError,
  } = useRepository(orgName, repoName);

  const { data: languagesData, isLoading: languagesLoading } =
    useRepositoryLanguages(orgName, repoName);

  const { data: activityData, isLoading: activityLoading } =
    useRepositoryCommitActivity(orgName, repoName);

  const { data: commitsData, isLoading: commitsLoading } = useRepositoryCommits(
    orgName,
    repoName
  );

  // Set document title
  useEffect(() => {
    document.title = `Organization | Repository | ${
      repoName.charAt(0).toUpperCase() + repoName.slice(1)
    }`;
  }, [repoName]);

  // Calculate main language
  const mainLanguage = useMemo(() => {
    if (!languagesData || !repoData) return null;

    if (languagesData && typeof languagesData === "object") {
      const languageEntries = Object.entries(languagesData);
      if (languageEntries.length === 0) return null;

      return languageEntries.reduce((a: any, b: any) =>
        a[1] > b[1] ? a : b
      )[0];
    }
    return null;
  }, [languagesData, repoData]);

  // Process chart data
  const chartData = useMemo(() => {
    if (!activityData || !repoData) return [];

    if (Array.isArray(activityData) && activityData.length > 0) {
      const last52Weeks = activityData.slice(-52);

      return last52Weeks.map((item: any) => ({
        date: new Date(item.week * 1000).toISOString().split("T")[0],
        commits: item.total,
      }));
    }

    return [];
  }, [activityData, repoData]);

  // Determine loading state
  const isLoading =
    repoLoading || languagesLoading || activityLoading || commitsLoading;

  // Handle error state
  const error = useMemo(() => {
    if (!repoError) return null;

    const errorResponse = (repoError as any)?.response;
    if (errorResponse?.status === 404) {
      return "Repository not found or you don't have access to it.";
    } else if (errorResponse?.status === 403) {
      return "Access denied. Please check your GitHub permissions.";
    } else if (errorResponse?.status === 401) {
      return "Authentication failed. Please try logging in again.";
    } else {
      return (
        (repoError as any)?.message ||
        "An error occurred while fetching repository data."
      );
    }
  }, [repoError]);

  if (isLoading) {
    return (
      <div>
        <div className="pt-1">
          <Link
            href={`/feed/organization/${orgName}`}
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
        <Skeleton className="w-full h-48 mt-4 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="pt-1">
          <Link
            href={`/feed/organization/${orgName}`}
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
        <div className="w-full h-48 bg-neutral-900 mt-4 rounded-xl flex items-center justify-center">
          <p className="text-[#5BC898]">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-1">
        <Link
          href={`/feed/organization/${orgName}`}
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
        <RepositoryBasicInformation
          name={repoData.name}
          description={repoData.description}
          visibility={repoData.visibility}
          language={mainLanguage}
          stars={repoData.stargazers_count}
          forks={repoData.forks_count}
          watchers={repoData.watchers_count}
          lastUpdate={repoData.updated_at}
          commitGraph={chartData}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4">
        {repoData && (
          <>
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
          </>
        )}
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
          <ContributorsStats owner={orgName} repo={repoName} />
          {languagesData && (
            <div>
              <LanguagesPieChart languages={languagesData || {}} />
            </div>
          )}
        </div>
        {commitsData && (
          <div className="sm:col-span-2">
            <LastCommits
              commits={commitsData}
              owner={orgName}
              repo={repoName}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
