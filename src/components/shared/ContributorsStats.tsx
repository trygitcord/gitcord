import { useEffect } from "react";
import { repoContributorsSlice } from "@/stores/repo/contributorsSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitCommit, Plus, Minus, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ContributorsStatsProps {
  owner: string;
  repo: string;
}

export function ContributorsStats({ owner, repo }: ContributorsStatsProps) {
  const { data, loading, error, fetchData } = repoContributorsSlice();

  useEffect(() => {
    fetchData(owner, repo);
  }, [owner, repo, fetchData]);

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px]">
        <h3 className="text-sm font-medium mb-4">Top Contributors</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex flex-col items-center justify-center gap-2">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-400 text-center">
          Error loading contributors data
        </p>
        <button
          onClick={() => fetchData(owner, repo)}
          className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
        >
          Try again
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
        <button
          onClick={() => fetchData(owner, repo)}
          className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Calculate total additions and deletions for each contributor
  const contributorsWithStats = data.map((contributor: any) => {
    const totalAdditions = contributor.weeks.reduce(
      (sum: number, week: any) => sum + week.a,
      0
    );
    const totalDeletions = contributor.weeks.reduce(
      (sum: number, week: any) => sum + week.d,
      0
    );
    return {
      ...contributor,
      totalAdditions,
      totalDeletions,
    };
  });

  // Sort contributors by total commits
  const sortedContributors = [...contributorsWithStats].sort(
    (a, b) => b.total - a.total
  );
  const maxCommits = sortedContributors[0]?.total || 0;

  return (
    <div className="bg-neutral-900 rounded-xl p-4 h-[230px] overflow-y-auto">
      <h3 className="text-sm font-medium mb-4">Top Contributors</h3>
      <div className="space-y-3">
        {sortedContributors.map((contributor: any) => (
          <div
            key={contributor.author.id}
            className="flex items-start justify-between min-w-0"
          >
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={contributor.author.avatar_url} />
                <AvatarFallback>
                  {contributor.author.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <Link
                  href={`https://github.com/${contributor.author.login}`}
                  target="_blank"
                  className="text-sm font-medium hover:text-[#5BC898] transition-colors cursor-pointer block truncate"
                >
                  {contributor.author.login}
                </Link>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <GitCommit className="w-3 h-3 flex-shrink-0" />
                    <span>{contributor.total} commits</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <div className="flex items-center gap-0.5 text-[#5BC898]">
                      <Plus className="w-3 h-3 flex-shrink-0" />
                      <span>{contributor.totalAdditions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-red-400">
                      <Minus className="w-3 h-3 flex-shrink-0" />
                      <span>{contributor.totalDeletions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <div className="h-2 w-20 bg-neutral-800 rounded-full overflow-hidden">
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
