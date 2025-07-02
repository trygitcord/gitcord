import { RefreshCw } from "lucide-react";
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

interface CommitData {
  date: string;
  commits: number;
}

interface RepositoryBasicInformationProps {
  name: string;
  description: string | null;
  visibility: string;
  language: string | null;
  lastUpdate: string;
  commitGraph: CommitData[];
  isLoadingCommitActivity?: boolean;
  isFetchingCommitActivity?: boolean;
  activityError?: Error | null;
  refetchActivity?: () => void;
}

export const RepositoryBasicInformation = ({
  name,
  description,
  visibility,
  language,
  lastUpdate,
  commitGraph,
  isLoadingCommitActivity = false,
  isFetchingCommitActivity = false,
  activityError,
  refetchActivity,
}: RepositoryBasicInformationProps) => {
  // Check if activity data is computing
  const isActivityComputing =
    activityError &&
    (activityError.message?.includes("computed") ||
      (activityError as { response?: { status?: number } }).response?.status ===
        202);

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
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Commit Activity
            </span>
            {isFetchingCommitActivity && (
              <RefreshCw className="w-3 h-3 text-neutral-400 animate-spin" />
            )}
          </div>
          <div className="w-[250px] h-[80px]">
            {isLoadingCommitActivity ||
            (isFetchingCommitActivity && !commitGraph?.length) ? (
              <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 p-2 flex items-end justify-between gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-300 dark:bg-neutral-600 rounded-sm animate-pulse"
                    style={{
                      width: "8px",
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 50}ms`,
                      animationDuration: "1.5s",
                    }}
                  />
                ))}
              </div>
            ) : isActivityComputing ? (
              <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-1">
                <RefreshCw className="w-4 h-4 text-neutral-500 animate-spin" />
                <p className="text-xs text-neutral-500 font-medium">
                  Computing
                </p>
                {refetchActivity && (
                  <button
                    onClick={refetchActivity}
                    className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded text-neutral-600 dark:text-neutral-400 transition-colors"
                    disabled={isFetchingCommitActivity}
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
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
                    formatter={(value: number) => [
                      `${value} commits`,
                      "Commits",
                    ]}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
