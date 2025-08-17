"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, GitBranch, Users } from "lucide-react";
import { AnimatedHatchedPatternAreaChart } from "@/components/charts/AnimatedHatchedPatternAreaChart";
import { GlowingLineChart } from "@/components/charts/GlowingLineChart";
import { GradientBarChart } from "@/components/charts/GradientBarChart";
import { ClippedAreaChart } from "@/components/charts/ClippedAreaChart";
import {
  useUserRepositories,
  useUserEvents,
  useUserOrganizations,
} from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";

// Type definitions
interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo?: {
    name: string;
  };
}

interface GitHubRepository {
  id: number;
  name: string;
  language: string | null;
  private: boolean;
  fork: boolean;
  size: number;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
}

interface GitHubOrganization {
  id: number;
  login: string;
  avatar_url: string;
}

interface ActivityData {
  date: string;
  count: number;
}

interface MonthlyData {
  month: string;
  contributions: number;
}

interface RepoStats {
  total: number;
  public: number;
  private: number;
  forked: number;
}

interface TopRepo {
  name: string;
  size: number;
  stars: number;
  forks: number;
}

interface CommitTimeData {
  hour: number;
  commits: number;
}

interface AnalyticsData {
  activityData: ActivityData[];
  monthlyData: MonthlyData[];
  repoStats: RepoStats;
  topReposBySize: TopRepo[];
  commitTimeData: CommitTimeData[];
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  organizations: number;
  activityTrend: string;
  commitTrend: string;
  repoTrend: string;
  monthlyTrend: string;
}

// Time formatting functions
function formatMonthDay(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  return `${month} ${day}`;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    document.title = `Feed |Analytics`;
  }, []);

  // Get user profile
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Get username from profile
  const username = profile?.username;

  // Load data with new hooks
  const { data: repos, isLoading: reposLoading } =
    useUserRepositories(username || null);
  const { data: events, isLoading: eventsLoading } = useUserEvents(username || null);
  const { data: orgs, isLoading: orgsLoading } = useUserOrganizations(username || null);

  // Check if all data is loading
  const dataLoading = reposLoading || eventsLoading || orgsLoading;

  const processAnalyticsData = useCallback(() => {
    // Use public repos data for all users
    const reposData = repos as GitHubRepository[];

    // Activity over time
    const activityData: ActivityData[] =
      events && events.length > 0
        ? (events as GitHubEvent[])
            .slice(0, 30)
            .reduce((acc: ActivityData[], event: GitHubEvent) => {
              const date = formatMonthDay(new Date(event.created_at));
              const existing = acc.find((item) => item.date === date);
              if (existing) {
                existing.count += 1;
              } else {
                acc.push({ date, count: 1 });
              }
              return acc;
            }, [])
            .reverse()
        : [];

    // Monthly contributions (last 6 months)
    const monthlyData: MonthlyData[] =
      events && events.length > 0
        ? (() => {
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            const now = new Date();
            const monthlyContributions: { [key: string]: number } = {};

            // Initialize last 6 months including current month
            for (let i = 5; i >= 0; i--) {
              const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const monthKey = months[date.getMonth()];
              monthlyContributions[monthKey] = 0;
            }

            // Count events by month (only for the last 6 months)
            (events as GitHubEvent[]).forEach((event: GitHubEvent) => {
              const eventDate = new Date(event.created_at);
              // Check if event is within the last 6 months
              const monthDiff =
                (now.getFullYear() - eventDate.getFullYear()) * 12 +
                (now.getMonth() - eventDate.getMonth());
              if (monthDiff >= 0 && monthDiff < 6) {
                const monthKey = months[eventDate.getMonth()];
                monthlyContributions[monthKey]++;
              }
            });

            // Convert to array and sort by month order
            return Object.entries(monthlyContributions).map(
              ([month, contributions]) => ({
                month,
                contributions,
              })
            );
          })()
        : [];

    // Repository stats
    const repoStats: RepoStats = {
      total: reposData?.length || 0,
      public:
        reposData?.filter((r: GitHubRepository) => !r.private).length || 0,
      private:
        reposData?.filter((r: GitHubRepository) => r.private).length || 0,
      forked: reposData?.filter((r: GitHubRepository) => r.fork).length || 0,
    };

    // Top repositories by stars, then by last update for repos with 0 stars
    const topReposBySize: TopRepo[] =
      reposData && reposData.length > 0
        ? reposData
            .sort((a: GitHubRepository, b: GitHubRepository) => {
              // First sort by stars
              if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
              }
              // For repos with same stars (including 0), sort by last update
              return (
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
              );
            })
            .slice(0, 5)
            .map((repo: GitHubRepository) => ({
              name: repo.name,
              size: repo.size,
              stars: repo.stargazers_count || 0,
              forks: repo.forks_count || 0,
            }))
        : [];

    // Commit time distribution (from real GitHub events)
    const commitTimeData: CommitTimeData[] = (() => {
      const hourlyCommits: { [key: number]: number } = {};

      // Initialize all hours
      for (let i = 0; i < 24; i++) {
        hourlyCommits[i] = 0;
      }

      // Count commits by hour from push events
      if (events && events.length > 0) {
        (events as GitHubEvent[]).forEach((event: GitHubEvent) => {
          if (event.type === "PushEvent") {
            const eventDate = new Date(event.created_at);
            const hour = eventDate.getHours();
            hourlyCommits[hour]++;
          }
        });
      }

      return Object.entries(hourlyCommits).map(([hour, commits]) => ({
        hour: parseInt(hour),
        commits,
      }));
    })();

    // Calculate trends - compare recent vs earlier activity
    const activityTrend =
      activityData.length > 0
        ? (() => {
            const totalActivity = activityData.reduce(
              (sum, item) => sum + item.count,
              0
            );

            if (totalActivity === 0) {
              return "+0%";
            }

            // If we have less than 2 weeks of data, compare first half vs second half
            if (activityData.length < 14) {
              const midPoint = Math.floor(activityData.length / 2);
              const firstHalf = activityData
                .slice(0, midPoint)
                .reduce((sum, item) => sum + item.count, 0);
              const secondHalf = activityData
                .slice(midPoint)
                .reduce((sum, item) => sum + item.count, 0);

              if (firstHalf === 0) {
                return secondHalf > 0 ? "+100%" : "+0%";
              }

              const change = ((secondHalf - firstHalf) / firstHalf) * 100;
              return change > 0
                ? `+${change.toFixed(1)}%`
                : `${change.toFixed(1)}%`;
            }

            // For 2+ weeks of data, compare last 7 days vs previous 7 days
            const recent = activityData
              .slice(-7)
              .reduce((sum, item) => sum + item.count, 0);
            const previous = activityData
              .slice(-14, -7)
              .reduce((sum, item) => sum + item.count, 0);

            if (previous === 0) {
              return recent > 0 ? "+100%" : "+0%";
            }

            const change = ((recent - previous) / previous) * 100;
            return change > 0
              ? `+${change.toFixed(1)}%`
              : `${change.toFixed(1)}%`;
          })()
        : "+0%";

    const commitTrend =
      commitTimeData.length > 0
        ? (() => {
            const totalCommits = commitTimeData.reduce(
              (sum, item) => sum + item.commits,
              0
            );
            const peakHourCommits = Math.max(
              ...commitTimeData.map((item) => item.commits)
            );
            const avgCommits = totalCommits / 24;
            const change =
              avgCommits > 0
                ? ((peakHourCommits - avgCommits) / avgCommits) * 100
                : 0;
            return change > 0
              ? `+${change.toFixed(1)}%`
              : `${change.toFixed(1)}%`;
          })()
        : "+0%";

    const repoTrend =
      topReposBySize.length > 2
        ? (() => {
            const avgSize =
              topReposBySize.reduce((sum, repo) => sum + repo.size, 0) /
              topReposBySize.length;
            const recentAvg =
              topReposBySize
                .slice(0, 2)
                .reduce((sum, repo) => sum + repo.size, 0) / 2;
            const change =
              avgSize > 0 ? ((recentAvg - avgSize) / avgSize) * 100 : 0;
            return change > 0
              ? `+${change.toFixed(1)}%`
              : `${change.toFixed(1)}%`;
          })()
        : "+0%";

    const monthlyTrend =
      monthlyData.length >= 6
        ? (() => {
            // Calculate average of last 3 months vs previous 3 months
            const recentMonths = monthlyData.slice(-3);
            const previousMonths = monthlyData.slice(-6, -3);

            const recentAvg =
              recentMonths.reduce((sum, item) => sum + item.contributions, 0) /
              3;
            const previousAvg =
              previousMonths.reduce(
                (sum, item) => sum + item.contributions,
                0
              ) / 3;

            // Handle case where previous average is 0
            if (previousAvg === 0) {
              if (recentAvg === 0) {
                return "+0%";
              } else {
                // If previous was 0 and now we have activity, show a large positive increase
                // but cap it at a reasonable percentage
                return "+100%";
              }
            }

            const change = ((recentAvg - previousAvg) / previousAvg) * 100;
            return change > 0
              ? `+${change.toFixed(1)}%`
              : `${change.toFixed(1)}%`;
          })()
        : "+0%";

    setAnalyticsData({
      activityData,
      monthlyData,
      repoStats,
      topReposBySize,
      commitTimeData,
      totalStars:
        reposData?.reduce(
          (sum: number, repo: GitHubRepository) => sum + repo.stargazers_count,
          0
        ) || 0,
      totalForks:
        reposData?.reduce(
          (sum: number, repo: GitHubRepository) => sum + repo.forks_count,
          0
        ) || 0,
      totalWatchers:
        reposData?.reduce(
          (sum: number, repo: GitHubRepository) => sum + repo.watchers_count,
          0
        ) || 0,
      organizations: (orgs as GitHubOrganization[])?.length || 0,
      activityTrend,
      commitTrend,
      repoTrend,
      monthlyTrend,
    });
  }, [repos, events, orgs]);

  // Process analytics data when store data changes
  useEffect(() => {
    if (!dataLoading && repos && events && orgs) {
      processAnalyticsData();
    }
  }, [repos, events, orgs, dataLoading, processAnalyticsData]);

  if (dataLoading || profileLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-3" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 space-y-2 pb-4">
        <h1 className="text-lg font-medium flex items-center gap-2">
          Analytics
        </h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Detailed analysis and insights of your GitHub activities
        </p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Stats Cards - First Row */}
        <div
          className="col-span-1 md:col-span-3 lg:col-span-3 min-h-0 overflow-hidden"
          style={{ minHeight: "100px" }}
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Public Repos
              </CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {analyticsData?.repoStats.public}
              </div>
              <p className="text-xs text-muted-foreground">
                Total repositories
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className="col-span-1 md:col-span-3 lg:col-span-3 min-h-0 overflow-hidden"
          style={{ minHeight: "100px" }}
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {analyticsData?.totalStars}
              </div>
              <p className="text-xs text-muted-foreground">
                From all repositories
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className="col-span-1 md:col-span-3 lg:col-span-3 min-h-0 overflow-hidden"
          style={{ minHeight: "100px" }}
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {analyticsData?.totalForks}
              </div>
              <p className="text-xs text-muted-foreground">Contributors</p>
            </CardContent>
          </Card>
        </div>

        <div
          className="col-span-1 md:col-span-3 lg:col-span-3 min-h-0 overflow-hidden"
          style={{ minHeight: "100px" }}
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Organizations
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {analyticsData?.organizations}
              </div>
              <p className="text-xs text-muted-foreground">Member of</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div
          className="col-span-1 md:col-span-12 lg:col-span-12 min-h-0 overflow-hidden"
          style={{ minHeight: "250px" }}
        >
          <AnimatedHatchedPatternAreaChart
            data={analyticsData?.activityData || []}
            title="Last 30 Days Activity"
            description="Your daily activity distribution on GitHub"
            trend={analyticsData?.activityTrend || "+0%"}
          />
        </div>

        <div
          className="col-span-1 md:col-span-4 lg:col-span-4 min-h-0 overflow-hidden"
          style={{ minHeight: "320px" }}
        >
          <GlowingLineChart
            data={analyticsData?.commitTimeData || []}
            title="Commit Time Distribution"
            description="Your most active hours"
            trend={analyticsData?.commitTrend || "+0%"}
          />
        </div>

        <div
          className="col-span-1 md:col-span-4 lg:col-span-4 min-h-0 overflow-hidden"
          style={{ minHeight: "320px" }}
        >
          <GradientBarChart
            data={analyticsData?.monthlyData || []}
            title="Recent Activity"
            description="Last 6 months of GitHub activity"
            trend={analyticsData?.monthlyTrend || "+0%"}
          />
        </div>

        <div
          className="col-span-1 md:col-span-4 lg:col-span-4 min-h-0 overflow-hidden"
          style={{ minHeight: "320px" }}
        >
          <ClippedAreaChart
            data={analyticsData?.topReposBySize || []}
            title="Top Repositories"
            description="Sorted by stars and recent activity"
            trend={
              analyticsData?.repoTrend?.startsWith("+") ||
              analyticsData?.repoTrend?.startsWith("-")
                ? `${analyticsData?.repoTrend}`
                : "+0%"
            }
            isPositive={analyticsData?.repoTrend?.startsWith("+") || false}
          />
        </div>
      </div>
    </div>
  );
}
