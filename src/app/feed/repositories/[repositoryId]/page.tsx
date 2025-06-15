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

  const { data: languagesData, fetchData: fetchLanguages } =
    repoLanguagesSlice();
  const { data: activityData, fetchData: fetchActivity } = repoActivitySlice();
  const { data: commitsData, fetchData: fetchCommits } = repoCommitsSlice();

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

        const [repoResponse] = await Promise.all([
          githubAxios.get(`/repos/${username}/${repoName}`),
          fetchLanguages(username, repoName),
          fetchActivity(username, repoName),
          fetchCommits(username, repoName),
        ]);

        setRepoData(repoResponse.data);
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
      }
    };

    fetchRepoData();
  }, [repoName, fetchLanguages, fetchActivity, fetchCommits]);

  useEffect(() => {
    if (languagesData) {
      const languages = languagesData as { [key: string]: number };
      if (Object.keys(languages).length > 0) {
        const mainLang = Object.entries(languages).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];
        setMainLanguage(mainLang);
      }
    }
  }, [languagesData]);

  useEffect(() => {
    if (activityData) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split("T")[0],
          commits: 0,
        };
      }).reverse();

      const processedData = activityData.map((item: any) => ({
        date: new Date(item.timestamp).toISOString().split("T")[0],
        commits: 1,
      }));

      const finalData = last7Days.map((day) => {
        const commits = processedData
          .filter(
            (item: { date: string; commits: number }) => item.date === day.date
          )
          .reduce(
            (sum: number, item: { date: string; commits: number }) =>
              sum + item.commits,
            0
          );
        return {
          ...day,
          commits,
        };
      });

      setChartData(finalData);
    }
  }, [activityData]);

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
        repoData={repoData}
        mainLanguage={mainLanguage}
        chartData={chartData}
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
              <LanguagesPieChart languages={languagesData} />
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
