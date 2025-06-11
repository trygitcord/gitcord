"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

export function ChartTooltipDefault({ data }: { data: any }) {
  const chartData =
    data && data.length > 0
      ? (() => {
          const processedEvents = data.map((event: any) => {
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
            (acc: any, curr: any) => {
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
    <div className="w-full h-full">
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData || []}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => {
              return new Date(value).toLocaleDateString("en-US", {
                weekday: "short",
              });
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
