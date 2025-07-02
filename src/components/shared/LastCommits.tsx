import { GitCommit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  } | null;
}

interface LastCommitsProps {
  commits: Commit[];
  owner: string;
  repo: string;
  slice?: number;
  isMain?: boolean;
}

export function LastCommits({
  commits,
  owner,
  repo,
  slice = 7,
  isMain = false,
}: LastCommitsProps) {
  // Ana ekran için kompakt görünüm
  if (isMain) {
    return (
      <div className="bg-neutral-50 rounded-xl h-full p-4 dark:bg-neutral-900">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between pl-2 pt-2 pb-3">
            <h2 className="text-sm font-medium">Last Commits</h2>
            <Link
              href={`/feed/repositories/${repo}/activity`}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-[#5BC898] dark:hover:text-[#5BC898] hover:cursor-pointer"
            >
              More Details
            </Link>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pt-2">
            {commits.slice(0, slice).map((commit) => (
              <div
                key={commit.sha}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors shrink-0"
                    >
                      #{commit.sha.slice(0, 7)}
                    </Link>
                    <div className="flex items-center gap-2 min-w-0">
                      {commit.author ? (
                        <>
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
                        </>
                      ) : (
                        <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                          Unknown Author
                        </span>
                      )}
                      <span className="text-neutral-500 dark:text-neutral-400 text-sm truncate">
                        {commit.commit.message.slice(0, 100)}...
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

  // Detay sayfası için genişletilmiş görünüm - tüm commitler scroll ile görüntülenir
  return (
    <div className="space-y-3 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {commits.map((commit) => (
        <div
          key={commit.sha}
          className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 hover:shadow-sm transition-shadow"
        >
          <div className="flex gap-3">
            {commit.author ? (
              <Image
                src={commit.author.avatar_url}
                alt={commit.author.login}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 ring-1 ring-neutral-300 dark:ring-neutral-600"></div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-tight">
                    {commit.commit.message.split("\n")[0]}
                  </h3>
                  {commit.commit.message.split("\n").length > 1 && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      {commit.commit.message
                        .split("\n")
                        .slice(1)
                        .join("\n")
                        .trim()}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0">
                  {timeAgo(commit.commit.author.date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {commit.author?.login || "Unknown Author"}
                </span>
                <span className="text-xs text-neutral-300 dark:text-neutral-600">
                  •
                </span>
                <Link
                  href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono cursor-pointer bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  #{commit.sha.slice(0, 7)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {commits.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
            <GitCommit className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
          </div>
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            No commits yet
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Commits will appear here once they&apos;re made to this repository.
          </p>
        </div>
      )}
    </div>
  );
}
