"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

// Type definitions for GitHub events
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
  pullRequests: {
    label: "Pull Requests",
    color: "var(--chart-3)",
  },
  issues: {
    label: "Issues",
    color: "var(--chart-2)",
  },
  commits: {
    label: "Commits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartTooltipDefault({ data }: { data: GitHubEvent[] }) {
  const isMobile = useIsMobile();

  const chartData =
    data && data.length > 0
      ? (() => {
          const processedEvents = data.map((event: GitHubEvent) => {
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

          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
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

          return last7Days;
        })()
      : null;

  return (
    <div className="w-full h-full min-h-[120px] sm:min-h-[160px] lg:min-h-[200px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart
          accessibilityLayer
          data={chartData || []}
          margin={{
            top: 2,
            right: 2,
            left: 2,
            bottom: 35,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            height={30}
            interval={0}
            tickFormatter={(value) => {
              const date = new Date(value);
              return isMobile
                ? date.toLocaleDateString("en-US", { weekday: "narrow" })
                : date.toLocaleDateString("en-US", { weekday: "short" });
            }}
          />
          <Bar
            dataKey="commits"
            stackId="a"
            fill="var(--chart-1)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="issues"
            stackId="a"
            fill="var(--chart-2)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="pullRequests"
            stackId="a"
            fill="var(--chart-3)"
            radius={[4, 4, 0, 0]}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={false}
            defaultIndex={1}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
