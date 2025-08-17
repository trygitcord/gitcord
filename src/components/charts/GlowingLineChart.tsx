"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, Clock } from "lucide-react";

interface CommitTimeData {
  hour: number;
  commits: number;
}

interface Props {
  data: CommitTimeData[];
  title?: string;
  description?: string;
  trend?: string;
}

const chartConfig = {
  commits: {
    label: "Commits",
    color: "#10B981",
  },
} satisfies ChartConfig;

export function GlowingLineChart({ data, title = "Commit Time Distribution", description = "Your most active hours", trend = "5.2%" }: Props) {
  const chartData = data.map(item => ({
    hour: `${item.hour}:00`,
    commits: item.commits,
  }));

  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
            <Clock className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
          </div>
          <div>
            <h3 className="text-neutral-800 text-base font-medium dark:text-neutral-200">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          </div>
        </div>
        <div className="text-green-500 bg-green-500/10 px-2 py-1 rounded-md flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">{trend}</span>
        </div>
      </div>
      <div className="h-64">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="commits"
              type="bump"
              stroke="#10B981"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}