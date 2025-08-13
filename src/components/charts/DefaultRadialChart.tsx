"use client";

import { RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Code2 } from "lucide-react";

interface LanguageData {
  name: string;
  value: number;
}

interface Props {
  data: LanguageData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  visitors: {
    label: "Repositories",
  },
  javascript: {
    label: "JavaScript",
    color: "#10B981",
  },
  typescript: {
    label: "TypeScript",
    color: "#8B5CF6",
  },
  python: {
    label: "Python",
    color: "#F59E0B",
  },
  java: {
    label: "Java",
    color: "#EF4444",
  },
  other: {
    label: "Other",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export function DefaultRadialChart({ data, title = "Language Distribution", description = "Most used programming languages" }: Props) {
  const chartData = data.map((item, index) => ({
    browser: item.name.toLowerCase(),
    visitors: item.value,
    fill: ["#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#3B82F6"][index % 5],
  }));

  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
          <Code2 className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
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
      <div className="h-64 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[240px] w-full h-full"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar
              cornerRadius={10}
              dataKey="visitors"
              background
              className="drop-shadow-lg"
            />
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
}