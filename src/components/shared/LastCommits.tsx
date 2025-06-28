import { GitCommit, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const commitsPerPage = 8;

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
                    <a
                      href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded hover:underline hover:text-[#5BC898] transition-colors shrink-0"
                    >
                      #{commit.sha.slice(0, 7)}
                    </a>
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

  // Detay sayfası için genişletilmiş görünüm
  // Pagination hesaplamaları
  const totalPages = Math.ceil(commits.length / commitsPerPage);
  const startIndex = (currentPage - 1) * commitsPerPage;
  const endIndex = startIndex + commitsPerPage;
  const currentCommits = commits.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6">
      <div className="space-y-8">
        {currentCommits.map((commit, index) => (
          <div key={commit.sha} className="relative">
            {/* Timeline line */}
            {index !== currentCommits.length - 1 && (
              <div className="absolute left-4 top-10 w-px h-4 bg-neutral-300 dark:bg-neutral-700"></div>
            )}

            <div className="flex gap-3">
              {commit.author ? (
                <Image
                  src={commit.author.avatar_url}
                  alt={commit.author.login}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700"
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
                  <a
                    href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono cursor-pointer bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded hover:bg-[#5BC898] hover:text-white transition-colors"
                  >
                    #{commit.sha.slice(0, 7)}
                  </a>
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
              Commits will appear here once they're made to this repository.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {commits.length > commitsPerPage && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {/* Show first page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(1)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    1
                  </Button>
                  {currentPage > 4 && (
                    <span className="text-neutral-400 px-1">...</span>
                  )}
                </>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum < 1 || pageNum > totalPages) return null;
                if (currentPage > 3 && pageNum === 1) return null;
                if (currentPage < totalPages - 2 && pageNum === totalPages)
                  return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Show last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="text-neutral-400 px-1">...</span>
                  )}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
