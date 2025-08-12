"use client";

import React, { useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartColumnBig } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserEvents } from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";

interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
  };
}

interface GitHubEvent {
  created_at: string;
  type: string;
  payload?: {
    commits?: GitHubCommit[];
  };
}

interface ProcessedEvent {
  date: string;
  commits: number;
  issues: number;
  pullRequests: number;
}

interface GroupedEvents {
  [date: string]: ProcessedEvent;
}

const chartConfig = {
  commits: {
    label: "Commits",
    color: "var(--chart-1)",
  },
  pullRequests: {
    label: "Pull Requests",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;


function UserActivityChart() {
  const [timeFilter, setTimeFilter] = useState<"7" | "14" | "30">("7");
  const { data: userData, isLoading: userLoading } = useUserProfile();

  const {
    data: userEventsData,
    isLoading: userEventsLoading,
    error: userEventsError,
  } = useUserEvents(userData?.username);

  if (
    userLoading ||
    userEventsLoading ||
    !userData ||
    !userEventsData ||
    userEventsError
  )
    return (
      <div className="w-full h-full">
        <Skeleton className="w-full h-full" />
      </div>
    );

  const chartData =
    userEventsData && userEventsData.length > 0
      ? (() => {
          const processedEvents = userEventsData.map((event: GitHubEvent) => {
            const date = new Date(event.created_at).toDateString();

            return {
              date,
              commits:
                event.type === "PushEvent"
                  ? event?.payload?.commits?.length || 0
                  : 0,
              issues: event.type === "IssuesEvent" ? 1 : 0,
              pullRequests: event.type === "PullRequestEvent" ? 1 : 0,
            };
          });

          const groupedByDate = processedEvents.reduce(
            (acc: GroupedEvents, curr: ProcessedEvent) => {
              if (!acc[curr.date]) {
                acc[curr.date] = {
                  date: curr.date,
                  commits: 0,
                  issues: 0,
                  pullRequests: 0,
                };
              }

              acc[curr.date].commits += curr.commits;
              acc[curr.date].issues += curr.issues;
              acc[curr.date].pullRequests += curr.pullRequests;

              return acc;
            },
            {}
          );

          const days = parseInt(timeFilter);
          const filteredDays = Array.from({ length: days }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateStr = date.toDateString();

            return (
              groupedByDate[dateStr] || {
                date: dateStr,
                commits: 0,
                issues: 0,
                pullRequests: 0,
              }
            );
          });

          return filteredDays;
        })()
      : [];


  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-3 sm:px-6 py-3 sm:py-4 dark:bg-neutral-900">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-neutral-100 rounded-lg p-1.5 sm:p-2 dark:bg-neutral-800">
              <ChartColumnBig className="text-neutral-800 w-4 h-4 sm:w-6 sm:h-6 dark:text-neutral-300" />
            </div>
            <div>
              <h2 className="text-neutral-800 text-base sm:text-xl font-medium dark:text-neutral-200">
                Activity
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Your stats by day
              </p>
            </div>
          </div>
          <Select value={timeFilter} onValueChange={(value: "7" | "14" | "30") => setTimeFilter(value)}>
            <SelectTrigger className="w-[130px] h-8 text-xs cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 flex items-end mt-2 sm:mt-4">
          <ChartContainer config={chartConfig} className="w-full h-[220px] sm:h-[240px]">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { weekday: "short" });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="commits" fill="var(--color-commits)" radius={4} />
              <Bar dataKey="pullRequests" fill="var(--color-pullRequests)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

export default UserActivityChart;
