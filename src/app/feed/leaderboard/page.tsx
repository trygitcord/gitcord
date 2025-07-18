"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useActivityLeaderboard } from "@/hooks/useMyApiQueries";
import { LeaderboardUser } from "@/types/userTypes";

const ITEMS_PER_PAGE = 8;

export default function LeaderboardPage() {
  const { data, isLoading, error } = useActivityLeaderboard();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = `Feed | Leaderboard`;
  }, []);

  if (isLoading || !data || error) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-semibold">An error occurred</p>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const leaderboardData = data?.data || [];
  const totalPages = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = leaderboardData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2">
            Leaderboard
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Ranking based on GitHub activities from the last 7 days
          </p>
        </div>
        {/* Last updated */}
        {data?.lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {new Date(data.lastUpdated).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Scoring Info - More minimal */}
      <div className="grid grid-cols-3 gap-4 md:flex md:gap-8">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-muted-foreground">Push</span>
          <span className="font-medium">2 pts</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span className="text-muted-foreground">PR</span>
          <span className="font-medium">4 pts</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-muted-foreground">Issue</span>
          <span className="font-medium">3 pts</span>
        </div>
      </div>

      {/* Leaderboard List - Modern card based approach */}
      {currentData.length > 0 ? (
        <div className="space-y-2">
          {currentData.map((user: LeaderboardUser, index: number) => {
            const rank = startIndex + index + 1;
            const isTopThree = rank <= 3;

            return (
              <div
                key={user._id}
                className={`group relative bg-card rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  isTopThree ? "ring-1 ring-border/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Rank and User */}
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                        rank === 1
                          ? "bg-[#5BC898] dark:bg-[#5BC898]/10 text-white dark:text-white"
                          : rank === 2
                          ? "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                          : rank === 3
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rank}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback className="bg-muted">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          target="_blank"
                          href={`/user/${user.username}`}
                          className="font-medium hover:underline underline-offset-4"
                        >
                          {user.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Stats and Score */}
                  <div className="flex items-center gap-4">
                    {/* Activity Stats - Desktop only */}
                    <div className="hidden md:flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-muted/50 rounded-lg border">
                        <p className="text-lg font-semibold">
                          {user.pushEvents}
                        </p>
                        <p className="text-xs text-muted-foreground">pushes</p>
                      </div>
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-muted/50 rounded-lg border">
                        <p className="text-lg font-semibold">
                          {user.pullRequests}
                        </p>
                        <p className="text-xs text-muted-foreground">PRs</p>
                      </div>
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-muted/50 rounded-lg border">
                        <p className="text-lg font-semibold">{user.issues}</p>
                        <p className="text-xs text-muted-foreground">issues</p>
                      </div>
                    </div>

                    {/* Total Score */}
                    <div className="flex flex-col items-center justify-center w-20 h-16 bg-gradient-to-br from-[#5BC898]/10 to-[#5BC898]/5 rounded-lg border border-[#5BC898]/20">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-[#5BC898]" />
                        <span className="text-lg font-bold text-[#5BC898]">
                          {user.weeklyScore}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        points
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats - Show on small screens */}
                <div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <span>{user.pushEvents} pushes</span>
                  <span>•</span>
                  <span>{user.pullRequests} PRs</span>
                  <span>•</span>
                  <span>{user.issues} issues</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No data yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Calculating weekly activities...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination - More minimal */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {leaderboardData.length} participants
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-1 text-muted-foreground">
                        ·
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Scoring Info Skeleton */}
      <div className="flex gap-8">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <Skeleton className="h-16 w-16 rounded-lg" />
                </div>
                <Skeleton className="h-16 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
