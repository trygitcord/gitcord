"use client";

import { ArrowLeft, Star, GitFork, GitCommit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import githubAxios from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { repoLanguagesSlice } from "@/stores/repo/languagesSlice";
import { repoActivitySlice } from "@/stores/repo/activitySlice";
import { repoCommitsSlice } from "@/stores/repo/commitsSlice";
import { RepositoryBasicInformation } from "@/components/shared/RepositoryBasicInformation";
import { StatCard } from "@/components/shared/StatCard";
import { LanguagesPieChart } from "@/components/shared/LanguagesPieChart";
import { ContributorsStats } from "@/components/shared/ContributorsStats";
import { LastCommits } from "@/components/shared/LastCommits";

function Page() {
  const params = useParams();
  const repoName = params.repositoryId as string;
  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainLanguage, setMainLanguage] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const { data: languagesData, fetchData: fetchLanguages } =
    repoLanguagesSlice();
  const {
    data: activityData,
    fetchData: fetchActivity,
    resetData: resetActivity,
  } = repoActivitySlice();
  const { data: commitsData, fetchData: fetchCommits } = repoCommitsSlice();

  // Reset states when repository changes
  useEffect(() => {
    const resetStates = () => {
      setRepoData(null);
      setLoading(true);
      setError(null);
      setMainLanguage(null);
      setChartData([]);
      setIsDataLoading(false);
      resetActivity(); // Reset activity data in the store
    };

    resetStates();
  }, [repoName, resetActivity]);

  useEffect(() => {
    document.title = `Feed | Repository | ${
      repoName.charAt(0).toUpperCase() + repoName.slice(1)
    }`;
  }, [repoName]);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("Username not found");
          setLoading(false);
          return;
        }

        setIsDataLoading(true);
        resetActivity(); // Reset activity data before fetching new data

        // First fetch repository data to check if it exists
        const repoResponse = await githubAxios.get(
          `/repos/${username}/${repoName}`
        );
        setRepoData(repoResponse.data);

        // Then fetch other data in parallel
        await Promise.all([
          fetchLanguages(username, repoName),
          fetchActivity(username, repoName).catch((err) => {
            // If activity data fails, set empty chart data
            if (err.response?.status === 404) {
              console.warn(`No commit activity data available for ${repoName}`);
              setChartData([]);
            }
            // Don't throw the error, just log it
            console.error("Error fetching activity:", err);
          }),
          fetchCommits(username, repoName),
        ]);

        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Repository not found or you don't have access to it.");
        } else if (err.response?.status === 403) {
          setError("Access denied. Please check your GitHub permissions.");
        } else if (err.response?.status === 401) {
          setError("Authentication failed. Please try logging in again.");
        } else {
          setError(
            err.message || "An error occurred while fetching repository data."
          );
        }
        setLoading(false);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchRepoData();
  }, [repoName, fetchLanguages, fetchActivity, fetchCommits, resetActivity]);

  useEffect(() => {
    if (languagesData && repoData) {
      // Get languages for this specific repository
      const repoLanguages = languagesData[repoName];

      if (repoLanguages && typeof repoLanguages === "object") {
        // Check if repoLanguages is empty
        if (Object.keys(repoLanguages).length === 0) {
          setMainLanguage(null);
        } else {
          // Find the main language
          const mainLang = Object.entries(repoLanguages).reduce((a, b) =>
            a[1] > b[1] ? a : b
          )[0];
          setMainLanguage(mainLang);
        }
      }
    }
  }, [languagesData, repoData, repoName]);

  useEffect(() => {
    if (activityData && repoData && !isDataLoading) {
      // Get activity for this specific repository
      const repoActivity = activityData[repoName];

      if (Array.isArray(repoActivity) && repoActivity.length > 0) {
        // Get the last 52 weeks of data (GitHub provides up to 52 weeks)
        const last52Weeks = repoActivity.slice(-52);

        // Process activities for the chart
        const processedData = last52Weeks.map((item: any) => ({
          date: new Date(item.week * 1000).toISOString().split("T")[0],
          commits: item.total,
        }));

        setChartData(processedData);
      } else {
        // If no activity data, set empty array
        setChartData([]);
      }
    }
  }, [activityData, repoData, repoName, isDataLoading]);

  if (loading) {
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
        <Skeleton className="w-full h-48 mt-4 rounded-xl" />
      </div>
    );
  }

  if (error) {
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
          <ContributorsStats
            owner={localStorage.getItem("username") || ""}
            repo={repoName}
          />
          {languagesData && (
            <div>
              <LanguagesPieChart languages={languagesData[repoName] || {}} />
            </div>
          )}
        </div>
        {commitsData && (
          <div className="sm:col-span-2">
            <LastCommits
              commits={commitsData}
              owner={localStorage.getItem("username") || ""}
              repo={repoName}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
