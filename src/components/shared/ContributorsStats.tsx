import { useEffect } from "react";
import { repoContributorsSlice } from "@/stores/repo/contributorsSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitCommit, Plus, Minus } from "lucide-react";
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
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex items-center justify-center">
        <p className="text-[#5BC898]">Error loading contributors data</p>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4 h-[230px] flex items-center justify-center">
        <p className="text-neutral-400">No contributor data available</p>
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
