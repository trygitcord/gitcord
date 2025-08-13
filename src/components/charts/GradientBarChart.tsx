"use client";

import { TrendingUp, GitCommit } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MonthlyData {
  month: string;
  contributions: number;
}

interface Props {
  data: MonthlyData[];
  title?: string;
  description?: string;
  trend?: string;
}

const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "#10B981",
  },
} satisfies ChartConfig;

export function GradientBarChart({ 
  data, 
  title = "Monthly Contributions", 
  description = "Your GitHub activity over the last 12 months",
  trend = "+0%"
}: Props) {
  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
            <GitCommit className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
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
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              shape={<CustomGradientBar />}
              dataKey="contributions"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient
                id="gradient-bar-pattern-contributions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

const CustomGradientBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
  const { x, y, width, height } = props;

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill="url(#gradient-bar-pattern-contributions)"
        rx={4}
        ry={4}
      />
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={3} 
        stroke="none" 
        fill="#10B981" 
        rx={4}
        ry={4}
      />
    </>
  );
};