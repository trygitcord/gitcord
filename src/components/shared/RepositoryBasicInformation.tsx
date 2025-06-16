import { Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

interface RepositoryBasicInformationProps {
  name: string;
  description: string | null;
  visibility: string;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  lastUpdate: string;
  commitGraph: any[];
}

export const RepositoryBasicInformation = ({
  name,
  description,
  visibility,
  language,
  stars,
  forks,
  watchers,
  lastUpdate,
  commitGraph,
}: RepositoryBasicInformationProps) => {
  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-900 mt-4 rounded-xl p-4.5">
      <div className="flex items-center justify-between w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium dark:text-neutral-200 text-neutral-800">
              {name}
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {visibility}
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {description || "No description provided."}
          </p>
          <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-4">
              {language && (
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5BC898]" />
                  <span className="text-xs px-2 py-1 rounded-full text-neutral-600 dark:text-neutral-400">
                    {language}
                  </span>
                </div>
              )}
              <span className="text-xs">Updated {timeAgo(lastUpdate)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Commit Activity
          </span>
          <div className="w-[250px] h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commitGraph}>
                <XAxis dataKey="date" hide={true} />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value: number) => [`${value} commits`, "Commits"]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString()
                  }
                />
                <Line
                  type="monotone"
                  dataKey="commits"
                  stroke="#5BC898"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
