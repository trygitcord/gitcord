"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  GitBranch,
  GitCommit,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
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

interface ContributionData {
  subject: string;
  A: number;
  fullMark: number;
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
  contributionData: ContributionData[];
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
    useUserRepositories(username);
  const { data: events, isLoading: eventsLoading } = useUserEvents(username);
  const { data: orgs, isLoading: orgsLoading } = useUserOrganizations(username);

  // Check if all data is loading
  const dataLoading =
    reposLoading || eventsLoading || orgsLoading;


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

    // Monthly contributions (last 12 months)
    const monthlyData: MonthlyData[] = events && events.length > 0
      ? (() => {
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const now = new Date();
          const monthlyContributions: { [key: string]: number } = {};
          
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = months[date.getMonth()];
            monthlyContributions[monthKey] = 0;
          }
          
          (events as GitHubEvent[]).forEach((event: GitHubEvent) => {
            const eventDate = new Date(event.created_at);
            const monthKey = months[eventDate.getMonth()];
            if (monthlyContributions.hasOwnProperty(monthKey)) {
              monthlyContributions[monthKey]++;
            }
          });
          
          return Object.entries(monthlyContributions).map(([month, contributions]) => ({
            month,
            contributions
          }));
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

    // Contribution stats
    const contributionData: ContributionData[] = [
      {
        subject: "Push Events",
        A:
          (events as GitHubEvent[])?.filter(
            (e: GitHubEvent) => e.type === "PushEvent"
          ).length || 0,
        fullMark: 100,
      },
      {
        subject: "Pull Requests",
        A:
          (events as GitHubEvent[])?.filter(
            (e: GitHubEvent) => e.type === "PullRequestEvent"
          ).length || 0,
        fullMark: 100,
      },
      {
        subject: "Issues",
        A:
          (events as GitHubEvent[])?.filter(
            (e: GitHubEvent) => e.type === "IssuesEvent"
          ).length || 0,
        fullMark: 100,
      },
      {
        subject: "Reviews",
        A:
          (events as GitHubEvent[])?.filter(
            (e: GitHubEvent) => e.type === "PullRequestReviewEvent"
          ).length || 0,
        fullMark: 100,
      },
      {
        subject: "Comments",
        A:
          (events as GitHubEvent[])?.filter((e: GitHubEvent) =>
            e.type.includes("CommentEvent")
          ).length || 0,
        fullMark: 100,
      },
    ];

    // Top repositories by size
    const topReposBySize: TopRepo[] =
      reposData && reposData.length > 0
        ? reposData
            .sort((a: GitHubRepository, b: GitHubRepository) => b.size - a.size)
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
          if (event.type === 'PushEvent') {
            const eventDate = new Date(event.created_at);
            const hour = eventDate.getHours();
            hourlyCommits[hour]++;
          }
        });
      }
      
      return Object.entries(hourlyCommits).map(([hour, commits]) => ({
        hour: parseInt(hour),
        commits
      }));
    })();

    // Calculate trends
    const activityTrend = activityData.length > 7 
      ? (() => {
          const recent = activityData.slice(-7).reduce((sum, item) => sum + item.count, 0);
          const previous = activityData.slice(-14, -7).reduce((sum, item) => sum + item.count, 0);
          if (previous === 0) return "+0%";
          const change = ((recent - previous) / previous) * 100;
          return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        })()
      : "+0%";
    
    const commitTrend = commitTimeData.length > 0
      ? (() => {
          const totalCommits = commitTimeData.reduce((sum, item) => sum + item.commits, 0);
          const peakHourCommits = Math.max(...commitTimeData.map(item => item.commits));
          const avgCommits = totalCommits / 24;
          const change = avgCommits > 0 ? ((peakHourCommits - avgCommits) / avgCommits) * 100 : 0;
          return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        })()
      : "+0%";
    
    const repoTrend = topReposBySize.length > 2
      ? (() => {
          const avgSize = topReposBySize.reduce((sum, repo) => sum + repo.size, 0) / topReposBySize.length;
          const recentAvg = topReposBySize.slice(0, 2).reduce((sum, repo) => sum + repo.size, 0) / 2;
          const change = avgSize > 0 ? ((recentAvg - avgSize) / avgSize) * 100 : 0;
          return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        })()
      : "+0%";

    const monthlyTrend = monthlyData.length > 6
      ? (() => {
          const recent = monthlyData.slice(-3).reduce((sum, item) => sum + item.contributions, 0);
          const previous = monthlyData.slice(-6, -3).reduce((sum, item) => sum + item.contributions, 0);
          if (previous === 0) return "+0%";
          const change = ((recent - previous) / previous) * 100;
          return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        })()
      : "+0%";

    setAnalyticsData({
      activityData,
      monthlyData,
      repoStats,
      contributionData,
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
    if (
      !dataLoading &&
      repos &&
      events &&
      orgs
    ) {
      processAnalyticsData();
    }
  }, [
    repos,
    events,
    orgs,
    dataLoading,
    processAnalyticsData,
  ]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed analysis and insights of your GitHub activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repos</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.repoStats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.repoStats.public} public,{" "}
              {analyticsData?.repoStats.private} private
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.totalStars}
            </div>
            <p className="text-xs text-muted-foreground">
              From all repositories
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.totalForks}
            </div>
            <p className="text-xs text-muted-foreground">Contributors</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.organizations}
            </div>
            <p className="text-xs text-muted-foreground">Member of</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <AnimatedHatchedPatternAreaChart 
            data={analyticsData?.activityData || []}
            title="Last 30 Days Activity"
            description="Your daily activity distribution on GitHub"
            trend={analyticsData?.activityTrend || "+0%"}
          />
        </div>

        {/* Monthly Contributions */}
        <GradientBarChart 
          data={analyticsData?.monthlyData || []}
          title="Monthly Contributions"
          description="Your GitHub activity over the last 12 months"
          trend={analyticsData?.monthlyTrend || "+0%"}
        />

        {/* Commit Time Distribution */}
        <GlowingLineChart 
          data={analyticsData?.commitTimeData || []}
          title="Commit Time Distribution"
          description="Your most active hours"
          trend={analyticsData?.commitTrend || "+0%"}
        />

        {/* Repository Size Analysis */}
        <ClippedAreaChart 
          data={analyticsData?.topReposBySize || []}
          title="Repository Analysis"
          description="Repository size distribution"
          trend={analyticsData?.repoTrend || "-2.4%"}
          isPositive={false}
        />

        {/* Contribution Radar */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Contribution Analysis
            </CardTitle>
            <CardDescription>
              Your contributions in different activity types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analyticsData?.contributionData || []}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Activity"
                    dataKey="A"
                    stroke="#5BC898"
                    fill="#5BC898"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}