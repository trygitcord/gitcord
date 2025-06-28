"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  GitFork,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePrivateRepositories } from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import ProjectHealthChart from "@/components/shared/ProjectHealthChart";

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

// Sağlık skoru hesaplama fonksiyonu - dengeli puanlama sistemi
function calculateHealthScore(repo: any) {
  // Son güncellenme skoru (0-35 puan)
  const daysSinceUpdate =
    (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  let updateScore = 0;
  if (daysSinceUpdate < 1) updateScore = 35;
  else if (daysSinceUpdate < 3) updateScore = 30;
  else if (daysSinceUpdate < 7) updateScore = 25;
  else if (daysSinceUpdate < 30) updateScore = 15;
  else if (daysSinceUpdate < 90) updateScore = 5;
  else if (daysSinceUpdate < 180) updateScore = 2;
  // 180+ gün = 0 puan

  // Commit sayısı skoru (0-30 puan)
  let commitScore = 0;
  if (repo.commits_count >= 500) commitScore = 30;
  else if (repo.commits_count >= 200) commitScore = 25;
  else if (repo.commits_count >= 100) commitScore = 20;
  else if (repo.commits_count >= 50) commitScore = 15;
  else if (repo.commits_count >= 20) commitScore = 10;
  else if (repo.commits_count >= 5) commitScore = 5;
  // 5'den az commit = 0 puan

  // Açık issue yönetimi skoru (0-15 puan)
  const openIssues = repo.open_issues_count || 0;
  let issueScore = 0;
  if (openIssues === 0) issueScore = 15; // Hiç açık issue yok
  else if (openIssues <= 3) issueScore = 12; // Az sayıda issue
  else if (openIssues <= 10) issueScore = 8; // Orta seviye
  else if (openIssues <= 20) issueScore = 4; // Çok issue
  // 20+ issue = 0 puan

  // Aktiflik bonusu (0-20 puan)
  let activityScore = 0;
  if (repo.last_commit_date) {
    const daysSinceCommit =
      (Date.now() - new Date(repo.last_commit_date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysSinceCommit < 1) activityScore = 20; // Bugün commit
    else if (daysSinceCommit < 7) activityScore = 15; // Bu hafta commit
    else if (daysSinceCommit < 30) activityScore = 10; // Bu ay commit
    else if (daysSinceCommit < 90) activityScore = 5; // Son 3 ay
    // 90+ gün = 0 puan
  }

  // Toplam skor hesaplama (0-100)
  const totalScore = updateScore + commitScore + issueScore + activityScore;
  return Math.max(0, Math.min(100, totalScore));
}

function Repositories() {
  // All useState hooks first
  const [currentPage, setCurrentPage] = useState(1);

  // Custom hooks (slice hooks) second
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = usePrivateRepositories();

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUserProfile();

  useEffect(() => {
    document.title = "Feed | Repositories";
  }, []);

  const reposPerPage = 12; // 3x3 grid için

  if (reposLoading || userLoading || !reposData || !userData) {
    return (
      <div className="w-full h-full">
        <div className="mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2">
            Repositories
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Explore all repositories and their activities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (reposError || userError) {
    return (
      <div className="w-full h-full">
        <div className="mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2">
            Repositories
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Explore all repositories and their activities.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            Error loading repositories:{" "}
            {reposError?.message || userError?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Filter repositories based on user premium status
  const isPremium = userData.premium?.isPremium || false;

  const filteredRepos = reposData.filter((repo: any) => {
    // Public repositories are always visible
    if (repo.visibility === "public") {
      return true;
    }
    // Private repositories are only visible to premium users
    if (repo.visibility === "private") {
      return isPremium;
    }
    return false;
  });

  // Sort repositories by updated_at time
  const sortedRepos = [...filteredRepos].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-lg font-medium flex items-center gap-2">
          Repositories
        </h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Explore all repositories and their activities.
          {!isPremium && (
            <span className="block mt-1 text-xs text-[#5BC898] dark:text-[#5BC898]">
              Upgrade to Premium to view private repositories
            </span>
          )}
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-4 gap-4 h-full">
          {currentRepos.map((repo: any) => (
            <Link
              key={repo.id}
              href={`/feed/repositories/${repo.name}`}
              className="group h-full"
            >
              {" "}
              {/* Silinebilir bug olursa -Harun */}
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-full relative">
                <span className="absolute top-15 right-4 z-10 ">
                  <ProjectHealthChart
                    score={calculateHealthScore(repo)}
                    size={40}
                  />
                </span>
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-neutral-800 dark:text-neutral-200 font-medium group-hover:text-[#5BC898] transition-colors">
                      {repo.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {repo.visibility === "private" && isPremium && (
                        <Crown className="w-4 h-4 text-[#5BC898]" />
                      )}
                      <span className="text-xs px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {repo.visibility}
                      </span>
                    </div>
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
    </div>
  );
}

export default Repositories;
