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
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import githubAxios from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { RepositoryBasicInformation } from "@/components/shared/RepositoryBasicInformation";
import { orgReposSlice } from "@/stores/org/reposSlice";
import { orgLanguagesSlice } from "@/stores/org/languagesSlice";
import { orgActivitySlice } from "@/stores/org/activitySlice";

interface OrganizationData {
  name: string;
  login: string;
  description: string | null;
  type: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
}

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

function Page() {
  const params = useParams();
  const orgName = params.organizationId as string;
  const [orgData, setOrgData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainLanguage, setMainLanguage] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 9; // 3x4 grid için

  const { data: languagesData, fetchData: fetchLanguages } =
    orgLanguagesSlice();
  const {
    data: activityData,
    fetchData: fetchActivity,
    resetData: resetActivity,
  } = orgActivitySlice();
  const { data: reposData, fetchData: fetchRepos } = orgReposSlice();

  // Reset states when organization changes
  useEffect(() => {
    const resetStates = () => {
      setOrgData(null);
      setLoading(true);
      setError(null);
      setMainLanguage(null);
      setChartData([]);
      setIsDataLoading(false);
      setCurrentPage(1);
      resetActivity(); // Reset activity data in the store
    };

    resetStates();
  }, [orgName, resetActivity]);

  useEffect(() => {
    document.title = `Feed | Organization | ${
      orgName.charAt(0).toUpperCase() + orgName.slice(1)
    }`;
  }, [orgName]);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("Username not found");
          setLoading(false);
          return;
        }

        setIsDataLoading(true);
        resetActivity(); // Reset activity data before fetching new data

        // First fetch organization data to check if it exists
        try {
          const orgResponse = await githubAxios.get(`/orgs/${orgName}`);
          setOrgData(orgResponse.data);
        } catch (error: any) {
          if (error.response?.status === 404) {
            throw new Error(`Organization ${orgName} not found`);
          } else if (error.response?.status === 403) {
            throw new Error(`Access denied to organization ${orgName}`);
          }
          throw error;
        }

        // Then fetch other data in parallel
        await Promise.all([
          fetchLanguages(username, orgName),
          fetchActivity(username, orgName).catch((err: Error) => {
            // If activity data fails, set empty chart data
            if (
              err instanceof Error &&
              "response" in err &&
              (err as any).response?.status === 404
            ) {
              console.warn(`No commit activity data available for ${orgName}`);
              setChartData([]);
            }
            // Don't throw the error, just log it
            console.error("Error fetching activity:", err);
          }),
          fetchRepos(orgName),
        ]);

        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Organization not found or you don't have access to it.");
        } else if (err.response?.status === 403) {
          setError("Access denied. Please check your GitHub permissions.");
        } else if (err.response?.status === 401) {
          setError("Authentication failed. Please try logging in again.");
        } else {
          setError(
            err.message || "An error occurred while fetching organization data."
          );
        }
        setLoading(false);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchOrgData();
  }, [orgName, fetchLanguages, fetchActivity, fetchRepos, resetActivity]);

  useEffect(() => {
    if (activityData && orgData && !isDataLoading) {
      // Get activity for this specific organization
      const orgActivity = activityData[orgName];

      if (Array.isArray(orgActivity) && orgActivity.length > 0) {
        // Get the last 52 weeks of data (GitHub provides up to 52 weeks)
        const last52Weeks = orgActivity.slice(-52);

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
  }, [activityData, orgData, orgName, isDataLoading]);

  useEffect(() => {
    if (languagesData && orgData) {
      // Get languages for this specific organization
      const orgLanguages = languagesData[orgName];

      if (orgLanguages && typeof orgLanguages === "object") {
        // Find the main language (the one with the most bytes)
        const mainLang = Object.entries(orgLanguages).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];
        setMainLanguage(mainLang);
      }
    }
  }, [languagesData, orgData, orgName]);

  // Sort repositories by updated_at time
  const sortedRepos = reposData
    ? [...reposData].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    : [];

  // Pagination logic
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = sortedRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil((sortedRepos?.length || 0) / reposPerPage);

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

      {loading ? (
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
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="w-full h-48" />
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">
                  Error loading repositories: {error}
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
                      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-full">
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
