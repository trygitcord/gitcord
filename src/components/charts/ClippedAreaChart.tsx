"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";

interface TopRepo {
  name: string;
  size: number;
  stars: number;
  forks: number;
}

interface Props {
  data: TopRepo[];
  title?: string;
  description?: string;
  trend?: string;
  isPositive?: boolean;
}

const chartConfig = {
  size: {
    label: "Size",
    color: "#FCA070",
  },
} satisfies ChartConfig;

export function ClippedAreaChart({ 
  data, 
  title = "Repository Sizes", 
  description = "Total repository sizes", 
  trend = "-5.2%",
  isPositive = false 
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState(0);
  const [currentValue, setCurrentValue] = useState(data[data.length - 1]?.size || 0);

  const chartData = data.map(item => ({
    month: item.name.substring(0, 8),
    mobile: item.size,
  }));

  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl px-4 sm:px-6 py-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
            {isPositive ? <TrendingUp className="h-5 w-5 text-neutral-800 dark:text-neutral-300" /> : <TrendingDown className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />}
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
        <div className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1">
          <span className="text-sm font-medium">{Math.floor(currentValue).toLocaleString()}</span>
          <span className="text-sm">{trend}</span>
        </div>
      </div>
      <div className="h-64">
        <ChartContainer
          ref={chartRef}
          className="h-full w-full"
          config={chartConfig}
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue = state.activePayload?.[0]?.value;
              if (x && dataValue !== undefined) {
                setAxis(x);
                setCurrentValue(dataValue);
              }
            }}
            onMouseLeave={() => {
              setAxis(chartRef.current?.getBoundingClientRect().width || 0);
              setCurrentValue(chartData[chartData.length - 1]?.mobile || 0);
            }}
            margin={{
              right: 0,
              left: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              horizontalCoordinatesGenerator={(props) => {
                const { height } = props;
                return [0, height - 30];
              }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#gradient-cliped-area-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-size)"
              clipPath={`inset(0 ${
                Number(chartRef.current?.getBoundingClientRect().width) - axis
              } 0 0)`}
            />
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2={"85%"}
              stroke="var(--color-size)"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.2}
            />
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="var(--color-size)"
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="var(--primary-foreground)"
            >
              {Math.floor(currentValue).toLocaleString()}
            </text>
            <Area
              dataKey="mobile"
              type="monotone"
              fill="none"
              stroke="var(--color-size)"
              strokeOpacity={0.1}
            />
            <defs>
              <linearGradient
                id="gradient-cliped-area-mobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-size)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-size)"
                  stopOpacity={0}
                />
                <mask id="mask-cliped-area-chart">
                  <rect
                    x={0}
                    y={0}
                    width={"50%"}
                    height={"100%"}
                    fill="white"
                  />
                </mask>
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}