"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  GitBranch,
  GitCommit,
  Users,
  Code2,
  Clock,
  Sparkles,
  Lock,
  Crown,
  AlertCircle,
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
  RadarProps,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  useUserRepositories,
  usePrivateRepositories,
  useUserEvents,
  useUserOrganizations,
} from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";

// Time formatting functions
function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

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
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

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
  const { data: privateRepos, isLoading: privateReposLoading } =
    usePrivateRepositories();
  const { data: events, isLoading: eventsLoading } = useUserEvents(username);
  const { data: orgs, isLoading: orgsLoading } = useUserOrganizations(username);

  // Check if all data is loading
  const dataLoading =
    reposLoading || privateReposLoading || eventsLoading || orgsLoading;

  // Watch for profile changes to update premium status
  useEffect(() => {
    if (profile && !profileLoading) {
      const userIsPremium = profile.premium?.isPremium || false;
      setIsPremium(userIsPremium);
      setIsLoading(false);
    }
  }, [profile, profileLoading]);

  // Process analytics data when store data changes
  useEffect(() => {
    if (
      isPremium &&
      !dataLoading &&
      (privateRepos || repos) &&
      events &&
      orgs
    ) {
      processAnalyticsData();
    }
  }, [privateRepos, repos, events, orgs, isPremium, dataLoading]);

  const processAnalyticsData = () => {
    // Use privateRepos if available (for premium users), otherwise use public repos
    const reposData = privateRepos || repos;

    // Activity over time
    const activityData =
      events && events.length > 0
        ? events
            .slice(0, 30)
            .reduce((acc: any[], event: any) => {
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
    const languageData =
      reposData && reposData.length > 0
        ? reposData
            .reduce((acc: any[], repo: any) => {
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
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 6)
        : [];

    // Repository stats
    const repoStats = {
      total: reposData?.length || 0,
      public: reposData?.filter((r: any) => !r.private).length || 0,
      private: reposData?.filter((r: any) => r.private).length || 0,
      forked: reposData?.filter((r: any) => r.fork).length || 0,
    };

    // Contribution stats
    const contributionData = [
      {
        subject: "Push Events",
        A: events?.filter((e: any) => e.type === "PushEvent").length || 0,
        fullMark: 100,
      },
      {
        subject: "Pull Requests",
        A:
          events?.filter((e: any) => e.type === "PullRequestEvent").length || 0,
        fullMark: 100,
      },
      {
        subject: "Issues",
        A: events?.filter((e: any) => e.type === "IssuesEvent").length || 0,
        fullMark: 100,
      },
      {
        subject: "Reviews",
        A:
          events?.filter((e: any) => e.type === "PullRequestReviewEvent")
            .length || 0,
        fullMark: 100,
      },
      {
        subject: "Comments",
        A:
          events?.filter((e: any) => e.type.includes("CommentEvent")).length ||
          0,
        fullMark: 100,
      },
    ];

    // Top repositories by size
    const topReposBySize =
      reposData && reposData.length > 0
        ? reposData
            .sort((a: any, b: any) => b.size - a.size)
            .slice(0, 5)
            .map((repo: any) => ({
              name: repo.name,
              size: repo.size,
              stars: repo.stargazers_count || 0,
              forks: repo.forks_count || 0,
            }))
        : [];

    // Commit time distribution (simulated)
    const commitTimeData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      commits: Math.floor(Math.random() * 20) + 1,
    }));

    setAnalyticsData({
      activityData,
      languageData,
      repoStats,
      contributionData,
      topReposBySize,
      commitTimeData,
      totalStars:
        reposData?.reduce(
          (sum: number, repo: any) => sum + repo.stargazers_count,
          0
        ) || 0,
      totalForks:
        reposData?.reduce(
          (sum: number, repo: any) => sum + repo.forks_count,
          0
        ) || 0,
      totalWatchers:
        reposData?.reduce(
          (sum: number, repo: any) => sum + repo.watchers_count,
          0
        ) || 0,
      organizations: orgs?.length || 0,
    });
  };

  if (isLoading) {
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

  if (!isPremium) {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Content Container */}
        <div className="relative z-10 max-w-md mx-auto p-8 space-y-6">
          {/* Premium Badge */}
          <div className="absolute -top-4 -right-4 px-4 py-1 bg-gradient-to-r from-[#5BC898] to-[#4BA882] text-white text-xs font-medium rounded-lg">
            PREMIUM
          </div>
          {/* Icon and Title */}
          <div className="space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              {/* Animated Ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5BC898] to-[#4BA882] rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-white dark:bg-neutral-900 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || profile.username || "User"}
                    className="w-20 h-20 rounded-full border-2 border-white dark:border-neutral-900"
                  />
                ) : (
                  <LineChart className="w-12 h-12 text-[#5BC898]" />
                )}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#5BC898] to-[#4BA882] bg-clip-text text-transparent">
                Premium Analytics
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Unlock powerful insights and advanced visualizations
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-all backdrop-blur-sm">
              <div className="p-2 bg-[#5BC898]/10 rounded-lg group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-[#5BC898]" />
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  Real-time Activity Tracking
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Monitor your GitHub activities as they happen
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-all backdrop-blur-sm">
              <div className="p-2 bg-[#5BC898]/10 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-[#5BC898]" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Advanced Metrics</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Deep dive into your coding patterns and productivity
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-all backdrop-blur-sm">
              <div className="p-2 bg-[#5BC898]/10 rounded-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#5BC898]" />
              </div>
              <div>
                <h4 className="font-medium text-sm">AI-Powered Insights</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Get personalized recommendations to improve
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full h-12 hover:cursor-pointer bg-gradient-to-r from-[#5BC898] to-[#4BA882] hover:from-[#4BA882] hover:to-[#3A9872] text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            onClick={() => router.push("/feed/dashboard")}
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>

          {/* Bottom Text */}
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            Join thousands of developers using Premium Analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Analytics
          <Crown className="w-5 h-5 text-[#5BC898]" />
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
                        (entry: any, index: number) => (
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

      {/* Info Banner */}
      <Card className="border-0 bg-gradient-to-r from-[#5BC898]/10 to-[#5BC898]/10">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="h-5 w-5 text-[#5BC898] mt-0.5" />
          <div className="text-sm text-[#5BC898] dark:text-neutral-200">
            <p className="font-medium mb-1">Premium Analytics Features</p>
            <p className="text-[#5BC898] dark:text-neutral-400">
              The data on this page is fetched in real-time from the GitHub API,
              including your private repositories. To avoid exceeding API limits
              for more detailed analysis and historical data access, some data
              has been cached.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
