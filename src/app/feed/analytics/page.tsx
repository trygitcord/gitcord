"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
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
  Activity,
  GitBranch,
  GitCommit,
  Users,
  Code2,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
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

interface LanguageData {
  name: string;
  value: number;
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
  languageData: LanguageData[];
  repoStats: RepoStats;
  contributionData: ContributionData[];
  topReposBySize: TopRepo[];
  commitTimeData: CommitTimeData[];
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  organizations: number;
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

const COLORS = [
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#EC4899",
];

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    document.title = `Feed |Analytics`;
  }, []);

  // Get user profile
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Get username from profile
  const username = profile?.username || session?.user?.name;

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

    // Language distribution
    const languageData: LanguageData[] =
      reposData && reposData.length > 0
        ? reposData
            .reduce((acc: LanguageData[], repo: GitHubRepository) => {
              if (repo.language) {
                const existing = acc.find(
                  (item) => item.name === repo.language
                );
                if (existing) {
                  existing.value += 1;
                } else {
                  acc.push({ name: repo.language, value: 1 });
                }
              }
              return acc;
            }, [])
            .sort((a: LanguageData, b: LanguageData) => b.value - a.value)
            .slice(0, 6)
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

    // Commit time distribution (simulated)
    const commitTimeData: CommitTimeData[] = Array.from(
      { length: 24 },
      (_, i) => ({
        hour: i,
        commits: Math.floor(Math.random() * 20) + 1,
      })
    );

    setAnalyticsData({
      activityData,
      languageData,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card className="col-span-1 md:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Last 30 Days Activity
            </CardTitle>
            <CardDescription>
              Your daily activity distribution on GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData?.activityData || []}>
                  <defs>
                    <linearGradient
                      id="colorActivity"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorActivity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Language Distribution
            </CardTitle>
            <CardDescription>Most used programming languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {analyticsData?.languageData &&
              analyticsData.languageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.languageData.map(
                        (_: LanguageData, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">No language data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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

        {/* Top Repositories */}
        <Card className="col-span-1 md:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Repositories
            </CardTitle>
            <CardDescription>By size, stars and forks count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {analyticsData?.topReposBySize &&
              analyticsData.topReposBySize.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.topReposBySize}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(8, 19, 5, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="size" fill="#5BC898" name="Size (KB)" />
                    <Bar dataKey="stars" fill="#5BC898" name="Stars" />
                    <Bar dataKey="forks" fill="#5BC898" name="Forks" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">No repository data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Commit Time Heatmap */}
        <Card className="col-span-1 md:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Commit Time Distribution
            </CardTitle>
            <CardDescription>
              Your most active hours (simulated data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.commitTimeData || []}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#5BC898"
                    strokeWidth={2}
                    dot={{ fill: "#5BC898", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
