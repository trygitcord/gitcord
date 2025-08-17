"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  GitFork,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useUserRepositories } from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import ProjectHealthChart from "@/components/shared/ProjectHealthChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Repository interface based on the usage in the component
interface Repository {
  id: string | number;
  name: string;
  updated_at: string;
  commits_count?: number;
  open_issues_count?: number;
  last_commit_date?: string;
  visibility: "public" | "private";
  description?: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
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

// Sağlık skoru hesaplama fonksiyonu - dengeli puanlama sistemi
function calculateHealthScore(repo: Repository) {
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
  const commitCount = repo.commits_count || 0;
  if (commitCount >= 500) commitScore = 30;
  else if (commitCount >= 200) commitScore = 25;
  else if (commitCount >= 100) commitScore = 20;
  else if (commitCount >= 50) commitScore = 15;
  else if (commitCount >= 20) commitScore = 10;
  else if (commitCount >= 5) commitScore = 5;
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

type SortType = "updated" | "stars" | "forks" | "watchers";

function Repositories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState<SortType>(
    (searchParams.get("sort") as SortType) || "updated"
  );

  // Custom hooks (slice hooks) second
  const { data: profile } = useUserProfile();

  // Get username from profile
  const username = profile?.username;

  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useUserRepositories(username || null);

  useEffect(() => {
    document.title = "Feed | Repositories";
  }, []);

  // Function to update URL with current filters
  const updateURL = useCallback((search: string, sort: SortType) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort !== "updated") params.set("sort", sort);
    
    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newURL, { scroll: false });
  }, [router]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
    updateURL(searchQuery, sortBy);
  }, [searchQuery, sortBy, updateURL]);

  const reposPerPage = 12; // 3x3 grid için

  if (reposLoading || !reposData) {
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

  if (reposError) {
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
            Error loading repositories: {reposError?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Filter and search repositories
  const filteredRepos = reposData
    .filter((repo: Repository) => {
      return repo.visibility === "public";
    })
    .filter((repo: Repository) => {
      if (!searchQuery) return true;
      return (
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description &&
          repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

  // Sort repositories
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    switch (sortBy) {
      case "stars":
        return b.stargazers_count - a.stargazers_count;
      case "forks":
        return b.forks_count - a.forks_count;
      case "watchers":
        return b.watchers_count - a.watchers_count;
      case "updated":
      default:
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }
  });

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
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-medium flex items-center gap-2">
            Repositories
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Explore your public repositories and their activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortType)}
          >
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="forks">Most Forks</SelectItem>
              <SelectItem value="watchers">Most Watchers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {currentRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-neutral-400 dark:text-neutral-500 text-lg mb-2">
              {searchQuery ? "No repositories found" : "No public repositories"}
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              {searchQuery
                ? `Try adjusting your search terms or filter options`
                : "You don't have any public repositories yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRepos.map((repo: Repository) => (
              <Link
                key={repo.id}
                href={`/feed/repositories/${repo.name}`}
                className="group"
              >
                {" "}
                {/* Silinebilir bug olursa -Harun */}
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-40 relative">
                  <span className="absolute top-12 right-4 z-10 ">
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
                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {repo.visibility}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2 mr-16">
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
        )}
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

export default function Page() {
  return (
    <Suspense>
      <Repositories />
    </Suspense>
  );
}
