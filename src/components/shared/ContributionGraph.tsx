import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContributionDay {
  date: string;
  count: number;
  level?: number;
}

interface ContributionGraphProps {
  contributions?: ContributionDay[];
}

// Define types for the grid structure
interface GridDay {
  date: string;
  count: number;
  level: number;
  dayOfWeek: number;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  contributions = [],
}) => {
  // Generate the grid for exactly 53 weeks (371 days max to cover a full year)
  const generateDateGrid = (): (GridDay | null)[][] => {
    const weeks: (GridDay | null)[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the start date (90 days ago)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 180);
    // Adjust to the previous Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Create a map for quick lookup
    const contributionMap = new Map(contributions.map((c) => [c.date, c]));

    // Calculate number of weeks to show
    const daysToShow = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weeksToShow = Math.ceil(daysToShow / 7);

    for (let week = 0; week < weeksToShow; week++) {
      const days: (GridDay | null)[] = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        if (currentDate <= today) {
          const dateStr = currentDate.toISOString().split("T")[0];
          const contribution = contributionMap.get(dateStr);
          days.push({
            date: dateStr,
            count: contribution?.count || 0,
            level: contribution?.level || 0,
            dayOfWeek: day,
          });
        } else {
          // Future dates - add empty placeholder
          days.push(null);
        }
      }
      weeks.push(days);
    }
    return weeks;
  };

  const getContributionColor = (level: number) => {
    // GitHub's exact color scheme
    switch (level) {
      case 0:
        return "#161b22"; // No contributions (dark gray)
      case 1:
        return "#0e4429"; // Light green
      case 2:
        return "#006d32"; // Medium green
      case 3:
        return "#26a641"; // Bright green
      case 4:
        return "#39d353"; // Brightest green
      default:
        return "#161b22";
    }
  };

  const weeks = generateDateGrid();

  // Calculate total contributions for the displayed period (last 180 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 180);

  const totalContributions = contributions
    .filter((day) => {
      const dayDate = new Date(day.date);
      return dayDate >= startDate && dayDate <= today;
    })
    .reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="w-full">
      <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-1.5">
        <div className="w-full">
          {/* SVG Container with viewBox for responsive rendering */}
          <svg
            viewBox="0 0 360 112"
            className="w-full h-auto"
            style={{ maxWidth: "100%" }}
          >
            <g transform="translate(10, 10)">
              {/* Contribution grid */}
              <g transform="translate(0, 0)">
                {weeks.map((week, weekIndex) => (
                  <g
                    key={weekIndex}
                    transform={`translate(${weekIndex * 13}, 0)`}
                  >
                    {week.map((day, dayIndex) =>
                      day ? (
                        <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <rect
                                x={0}
                                y={dayIndex * 13}
                                width={11}
                                height={11}
                                rx={2}
                                ry={2}
                                fill={getContributionColor(day.level || 0)}
                                className="cursor-pointer outline-offset-2 hover:outline hover:outline-neutral-600"
                                style={{
                                  transition: "outline 0.1s ease-in-out",
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-neutral-800 border-neutral-700">
                              <p className="text-xs">
                                <span className="font-semibold">
                                  {day.count} contributions
                                </span>
                                <br />
                                {new Date(day.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <rect
                          key={`empty-${weekIndex}-${dayIndex}`}
                          x={0}
                          y={dayIndex * 13}
                          width={11}
                          height={11}
                          fill="transparent"
                        />
                      )
                    )}
                  </g>
                ))}
              </g>
            </g>
          </svg>
        </div>
        <div className="text-xs text-neutral-400 text-end p-0.5">
          {totalContributions.toLocaleString()} contributions in the last 180
          days
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
