"use client";

import * as React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function PieChart({ data }: PieChartProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-[160px] h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={45}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={false}
              activeIndex={-1}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ pointerEvents: "none" }}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 max-w-[200px]">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-neutral-400 truncate">
              {entry.name}
            </span>
            <span className="text-sm text-neutral-500 flex-shrink-0">
              ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
