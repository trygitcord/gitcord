"use client";

import {
  ArrowLeft,
  Star,
  GitFork,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { RepositoryBasicInformation } from "@/components/shared/RepositoryBasicInformation";
import {
  useOrganization,
  useOrganizationRepositories,
  useOrganizationLanguages,
  useOrganizationActivity,
} from "@/hooks/useGitHubQueries";
import ProjectHealthChart from '@/components/shared/ProjectHealthChart';

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

function calculateHealthScore(repo: any) {
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  let updateScore = 0;
  if (daysSinceUpdate < 1) updateScore = 40;
  else if (daysSinceUpdate < 7) updateScore = 35;
  else if (daysSinceUpdate < 30) updateScore = 25;
  else if (daysSinceUpdate < 90) updateScore = 10;
  let commitScore = 0;
  if (repo.commits_count >= 100) commitScore = 30;
  else if (repo.commits_count >= 50) commitScore = 20;
  else if (repo.commits_count >= 10) commitScore = 10;
  let issueScore = 15;
  if ((repo.open_issues_count || 0) > 20) issueScore = 0;
  else if ((repo.open_issues_count || 0) > 10) issueScore = 5;
  else if ((repo.open_issues_count || 0) > 3) issueScore = 10;
  let activityScore = 0;
  if (repo.last_commit_date) {
    const daysSinceCommit = (Date.now() - new Date(repo.last_commit_date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCommit < 30) activityScore = 15;
  }
  return Math.min(100, updateScore + commitScore + issueScore + activityScore);
}

function Page() {
  const params = useParams();
  const orgName = params.organizationId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 9; // 3x4 grid için

  // Tanstack Query hooks
  const {
    data: orgData,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganization(orgName);
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useOrganizationRepositories(orgName);
  const {
    data: languagesData,
    isLoading: languagesLoading,
    error: languagesError,
  } = useOrganizationLanguages(orgName);
  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
  } = useOrganizationActivity(orgName);

  useEffect(() => {
    document.title = `Feed | Organization | ${
      orgName.charAt(0).toUpperCase() + orgName.slice(1)
    }`;
  }, [orgName]);

  // Calculate main language
  const mainLanguage = useMemo(() => {
    if (!languagesData || typeof languagesData !== "object") return null;

    const languages = Object.entries(languagesData);
    if (languages.length === 0) return null;

    return languages.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }, [languagesData]);

  // Process chart data from activity
  const chartData = useMemo(() => {
    if (!activityData || !Array.isArray(activityData)) return [];

    // Get the last 52 weeks of data
    const last52Weeks = activityData.slice(-52);

    return last52Weeks.map((item: any) => ({
      date: new Date(item.week * 1000).toISOString().split("T")[0],
      commits: item.total,
    }));
  }, [activityData]);

  // Sort repositories by updated_at time
  const sortedRepos = useMemo(() => {
    if (!reposData) return [];
    return [...reposData].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [reposData]);

  // Pagination logic
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = sortedRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(sortedRepos.length / reposPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading state
  const isLoading =
    orgLoading || reposLoading || languagesLoading || activityLoading;

  // Error state - prioritize org error since it's most critical
  const error =
    orgError?.message ||
    reposError?.message ||
    languagesError?.message ||
    activityError?.message;

  return (
    <div>
      <div className="pt-1">
        <Link
          href="/feed/organization"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>
      <div className="pt-2">
        <h1 className="text-lg font-medium">Organization</h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Explore the latest activity in this organization.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <div className="w-full h-48 bg-neutral-900 mt-4 rounded-xl flex items-center justify-center">
          <p className="text-[#5BC898]">Error: {error}</p>
        </div>
      ) : orgData ? (
        <div className="space-y-8">
          <RepositoryBasicInformation
            name={orgData.name || orgData.login}
            description={orgData.description}
            visibility={orgData.type}
            language={mainLanguage}
            stars={orgData.stargazers_count}
            forks={orgData.forks_count}
            watchers={orgData.watchers_count}
            lastUpdate={orgData.updated_at}
            commitGraph={chartData}
          />
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Repositories</h2>
            {reposLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="w-full h-48" />
                ))}
              </div>
            ) : reposError ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">
                  Error loading repositories: {reposError.message}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentRepos.map((repo: any) => (
                    <Link
                      key={repo.id}
                      href={`/feed/organization/${orgData.login}/repository/${repo.name}`}
                      className="group h-full"
                    >
                      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-full relative">
                        <span className="absolute top-15 right-4 z-10"><ProjectHealthChart score={calculateHealthScore(repo)} size={40} /></span>
                        <div className="flex flex-col h-full">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-neutral-800 dark:text-neutral-200 font-medium group-hover:text-[#5BC898] transition-colors">
                              {repo.name}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {repo.visibility}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">
                            {repo.description || "No description provided."}
                          </p>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  <span>{repo.stargazers_count}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <GitFork className="w-4 h-4" />
                                  <span>{repo.forks_count}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{repo.watchers_count}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                                <Clock className="w-3 h-3" />
                                <span>Updated {timeAgo(repo.updated_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4 mt-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Page;
