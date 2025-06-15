import { GitCommit } from "lucide-react";
import Image from "next/image";

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
}

interface LastCommitsProps {
  commits: Commit[];
}

export function LastCommits({ commits }: LastCommitsProps) {
  return (
    <div className="bg-neutral-50 rounded-xl h-full p-4 dark:bg-neutral-900">
      <div className="h-full flex flex-col">
        <h2 className="text-sm font-medium mb-4">Last Commits</h2>
        <div className="space-y-4 flex-1 overflow-y-auto">
          {commits.slice(0, 7).map((commit) => (
            <div
              key={commit.sha}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <a
                    href={`https://github.com/${commit.sha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors shrink-0"
                  >
                    #{commit.sha.slice(0, 7)}
                  </a>
                  <div className="flex items-center gap-2 min-w-0">
                    <Image
                      src={commit.author.avatar_url}
                      alt={commit.author.login}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full shrink-0"
                    />
                    <span className="text-neutral-600 dark:text-neutral-300 text-sm truncate">
                      {commit.author.login}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm truncate">
                      {commit.commit.message}
                    </span>
                  </div>
                </div>
                <span className="text-neutral-400 text-xs shrink-0">
                  {timeAgo(commit.commit.author.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
