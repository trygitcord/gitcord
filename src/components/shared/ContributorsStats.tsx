import { useRepositoryContributors } from "@/hooks/useGitHubQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitCommit, Plus, Minus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ContributorsStatsProps {
  owner: string;
  repo: string;
}

interface ContributorWeek {
  w: number; // week timestamp
  a: number; // additions
  d: number; // deletions
  c: number; // commits
}

interface ContributorAuthor {
  id: number;
  login: string;
  avatar_url: string;
}

interface GitHubContributor {
  total: number;
  weeks: ContributorWeek[];
  author: ContributorAuthor;
}

interface ContributorWithStats extends GitHubContributor {
  totalAdditions: number;
  totalDeletions: number;
}

interface GitHubError {
  response?: {
    status: number;
  };
  message?: string;
}

export function ContributorsStats({ owner, repo }: ContributorsStatsProps) {
  const { data, isLoading, error, isFetching, isError, refetch } =
    useRepositoryContributors(owner, repo);

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="bg-gradient-to-br from-neutral-500/10 to-neutral-500/10 rounded-xl p-6 h-[230px]">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-4 h-4 text-neutral-400 animate-spin" />
          <h3 className="text-sm font-medium text-neutral-400">
            Loading Contributors
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i: number) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full bg-neutral-500/20" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-32 h-4 bg-neutral-500/20" />
                <Skeleton className="w-20 h-3 bg-neutral-500/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Cast error to the proper type
  const githubError = error as GitHubError | null;

  // GitHub stats hesaplama durumu - boş object da computing anlamına gelebilir
  if (
    (githubError &&
      (githubError.message?.includes("computed") ||
        githubError.response?.status === 202)) ||
    (data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0)
  ) {
    return (
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 h-[230px] border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-neutral-500 animate-spin" />
          <div>
            <p className="text-neutral-600 dark:text-neutral-400 font-semibold">
              Computing Stats
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-xs">
              Please wait...
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 flex items-center gap-2"
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Try Again
            </>
          )}
        </button>
      </div>
    );
  }

  // Diğer hatalar için
  if (isError && githubError && !githubError.message?.includes("computed")) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex flex-col items-center justify-center gap-2">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-400 text-center font-medium">
          Failed to Load Contributors
        </p>
        <p className="text-xs text-neutral-500 text-center mt-1">
          {githubError.message || "An error occurred while fetching data."}
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
    data?.map((contributor: GitHubContributor) => {
      const totalAdditions =
        contributor?.weeks?.reduce(
          (sum: number, week: ContributorWeek) => sum + (week?.a || 0),
          0
        ) || 0;
      const totalDeletions =
        contributor?.weeks?.reduce(
          (sum: number, week: ContributorWeek) => sum + (week?.d || 0),
          0
        ) || 0;
      return {
        ...contributor,
        totalAdditions,
        totalDeletions,
      };
    }) || [];

  // Sort contributors by total commits
  const sortedContributors: ContributorWithStats[] = [
    ...contributorsWithStats,
  ].sort((a, b) => b.total - a.total);
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
          .map((contributor: ContributorWithStats, index: number) => (
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
