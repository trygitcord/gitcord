"use client";

import React, { useEffect, useState } from "react";
import { userReposSlice } from "@/stores/user/reposSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, GitFork, Eye, Clock } from "lucide-react";
import Link from "next/link";

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

function Repositories() {
  useEffect(() => {
    document.title = "Feed | Repositories";
  }, []);

  const {
    data: reposData,
    loading,
    error,
    fetchData: fetchRepos,
  } = userReposSlice();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const username = localStorage.getItem("username");
    if (username) {
      fetchRepos(username);
    }
  }, []);

  if (!mounted || loading || !reposData) {
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

  if (error) {
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
          <p className="text-red-500">Error loading repositories: {error}</p>
        </div>
      </div>
    );
  }

  // Sort repositories by updated_at time
  const sortedRepos = [...reposData].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

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
        {sortedRepos.map((repo: any) => (
          <Link
            key={repo.id}
            href={`/feed/repositories/${repo.name}`}
            className="group"
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
    </div>
  );
}

export default Repositories;
