import { useEffect, useState } from "react";
import { useRepositoryContributors } from "@/hooks/useGitHubQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitCommit, Plus, Minus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ContributorsStatsProps {
  owner: string;
  repo: string;
}

export function ContributorsStats({ owner, repo }: ContributorsStatsProps) {
  const [attemptCount, setAttemptCount] = useState(0);
  const { data, isLoading, error, isFetching, isError, refetch } =
    useRepositoryContributors(owner, repo);

  // GitHub stats API'si veriyi hesaplamaya başladığında retry yapmak için
  useEffect(() => {
    if (error && error.message?.includes("computed") && attemptCount < 10) {
      const timer = setTimeout(() => {
        setAttemptCount((prev) => prev + 1);
        refetch();
      }, (attemptCount + 1) * 3000); // 3s, 6s, 9s, 12s... artan intervals

      return () => clearTimeout(timer);
    }
  }, [error, attemptCount, refetch]);

  // Reset attempt count when component unmounts or props change
  useEffect(() => {
    setAttemptCount(0);
  }, [owner, repo]);

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px]">
        <h3 className="text-sm font-medium mb-4">
          Top Contributors
          {isFetching && !isLoading && (
            <span className="ml-2 text-xs text-neutral-400">(Updating...)</span>
          )}
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i: number) => (
            <div key={i} className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-3" />
                </div>
              </div>
              <Skeleton className="w-20 h-2" />
            </div>
          ))}
        </div>
        <div className="text-xs text-neutral-500 text-center mt-4">
          {isLoading
            ? "Loading contributors data... This might take a few moments."
            : isFetching
            ? "Refreshing data..."
            : null}
        </div>
      </div>
    );
  }

  // GitHub stats hesaplama durumu - daha kullanıcı dostu mesajlar
  if (
    error &&
    (error.message?.includes("computed") || error.response?.status === 202)
  ) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <p className="text-blue-400 text-center font-medium">
            Computing Contributors Data
          </p>
        </div>
        <p className="text-xs text-neutral-400 text-center leading-relaxed">
          GitHub is calculating contributor statistics for this repository.
          <br />
          This process can take 1-2 minutes for large repositories.
        </p>
        <div className="text-xs text-neutral-500 text-center">
          Attempt {attemptCount + 1} of 10
        </div>
        <button
          onClick={() => {
            setAttemptCount(0);
            refetch();
          }}
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3" />
              Check Again
            </>
          )}
        </button>
      </div>
    );
  }

  // Diğer hatalar için
  if (isError && error && !error.message?.includes("computed")) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex flex-col items-center justify-center gap-2">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-400 text-center font-medium">
          Failed to Load Contributors
        </p>
        <p className="text-xs text-neutral-500 text-center mt-1">
          {error.message || "An error occurred while fetching data."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs transition-colors"
          disabled={isFetching}
        >
          {isFetching ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex flex-col items-center justify-center gap-2">
        <p className="text-neutral-400 text-center">
          No contributor data available
        </p>
        <p className="text-xs text-neutral-500 text-center">
          This repository might be private or have no commits.
        </p>
      </div>
    );
  }

  // Calculate total additions and deletions for each contributor
  const contributorsWithStats =
    data?.map((contributor: any) => {
      const totalAdditions =
        contributor?.weeks?.reduce(
          (sum: number, week: any) => sum + (week?.a || 0),
          0
        ) || 0;
      const totalDeletions =
        contributor?.weeks?.reduce(
          (sum: number, week: any) => sum + (week?.d || 0),
          0
        ) || 0;
      return {
        ...contributor,
        totalAdditions,
        totalDeletions,
      };
    }) || [];

  // Sort contributors by total commits
  const sortedContributors = [...contributorsWithStats].sort(
    (a, b) => b.total - a.total
  );
  const maxCommits = sortedContributors[0]?.total || 0;

  return (
    <div className="dark:bg-neutral-900 rounded-xl p-4 h-[230px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Top Contributors</h3>
        {isFetching && (
          <RefreshCw className="w-3 h-3 text-neutral-400 animate-spin" />
        )}
      </div>
      <div className="space-y-3">
        {sortedContributors
          .slice(0, 5)
          .map((contributor: any, index: number) => (
            <div
              key={`${contributor?.author?.id || index}`}
              className="flex items-start justify-between min-w-0"
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={contributor?.author?.avatar_url} />
                  <AvatarFallback>
                    {contributor?.author?.login?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`https://github.com/${contributor?.author?.login}`}
                    target="_blank"
                    className="text-sm font-medium hover:text-[#5BC898] transition-colors cursor-pointer block truncate"
                  >
                    {contributor?.author?.login}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      <GitCommit className="w-3 h-3 flex-shrink-0" />
                      <span>{contributor.total} commits</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <div className="flex items-center gap-0.5 text-[#5BC898]">
                        <Plus className="w-3 h-3 flex-shrink-0" />
                        <span>
                          {contributor?.totalAdditions?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-red-400">
                        <Minus className="w-3 h-3 flex-shrink-0" />
                        <span>
                          {contributor?.totalDeletions?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <div className="h-2 w-20 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5BC898] rounded-full"
                    style={{
                      width: `${(contributor.total / maxCommits) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
