"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, Activity } from "lucide-react";
import React from "react";

interface ActivityData {
  date: string;
  count: number;
  mobile?: number;
}

interface Props {
  data: ActivityData[];
  title?: string;
  description?: string;
  trend?: string;
}

const chartConfig = {
  count: {
    label: "Activity",
    color: "#10B981",
  },
} satisfies ChartConfig;

type ActiveProperty = keyof typeof chartConfig;

export function AnimatedHatchedPatternAreaChart({ data, title = "GitHub Activity", description = "Your daily activity distribution", trend = "5.2%" }: Props) {
  const [activeProperty, setActiveProperty] =
    React.useState<ActiveProperty | null>(null);

  const chartData = data.map(item => ({
    month: item.date,
    count: item.count,
  }));

  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
            <Activity className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
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
      <div className="h-48">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide={true}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <HatchedBackgroundPattern config={chartConfig} />
              <linearGradient
                id="hatched-background-pattern-grad-count"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#10B981"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="#10B981"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              onMouseEnter={() => setActiveProperty("count")}
              onMouseLeave={() => setActiveProperty(null)}
              dataKey="count"
              type="natural"
              fill={
                activeProperty === "count"
                  ? "url(#hatched-background-pattern-count)"
                  : "url(#hatched-background-pattern-grad-count)"
              }
              fillOpacity={0.4}
              stroke="#10B981"
              strokeWidth={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}

const HatchedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color])
  );
  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`hatched-background-pattern-${key}`}
          x="0"
          y="0"
          width="6.81"
          height="6.81"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
          overflow="visible"
        >
          <g overflow="visible" className="will-change-transform">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="6 0"
              dur="1s"
              repeatCount="indefinite"
            />
            <rect width="10" height="10" opacity={0.05} fill={value} />
            <rect width="1" height="10" fill={value} />
          </g>
        </pattern>
      ))}
    </>
  );
};