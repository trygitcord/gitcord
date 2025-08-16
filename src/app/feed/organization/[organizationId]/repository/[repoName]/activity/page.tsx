"use client";

import { LastCommits } from "@/components/shared/LastCommits";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRepositoryCommits } from "@/hooks/useGitHubQueries";
import { ArrowLeft, AlertCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

function Page() {
  const params = useParams();
  const repoName = params.repoName as string;
  const orgName = params.organizationId as string;
  const [selectedUser, setSelectedUser] = useState<string>("all");

  const {
    data: commitsData,
    isLoading: commitsLoading,
    error: commitsError,
  } = useRepositoryCommits(orgName, repoName);

  // Extract unique users from commits
  const uniqueUsers = useMemo(() => {
    if (!commitsData) return [];

    const users = new Map<string, { login: string; avatar_url: string }>();

    commitsData.forEach((commit) => {
      if (commit.author) {
        users.set(commit.author.login, {
          login: commit.author.login,
          avatar_url: commit.author.avatar_url,
        });
      }
    });

    return Array.from(users.values()).sort((a, b) =>
      a.login.localeCompare(b.login)
    );
  }, [commitsData]);

  // Filter commits based on selected user
  const filteredCommits = useMemo(() => {
    if (!commitsData) return [];

    if (selectedUser === "all") {
      return commitsData;
    }

    return commitsData.filter(
      (commit) => commit.author?.login === selectedUser
    );
  }, [commitsData, selectedUser]);

  const isLoading = commitsLoading;

  // Error state
  if (commitsError) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-shrink-0">
          <div className="pt-1">
            <Link
              href={`/feed/organization/${orgName}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
          <div className="pt-2">
            <h1 className="text-lg font-medium">Activity</h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Latest activity in this repository.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
            We couldn&apos;t load the repository activity. This might be due to
            network issues or the repository being private.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-shrink-0">
          <div className="pt-1">
            <Link
              href={`/feed/organization/${orgName}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
          <div className="pt-2">
            <h1 className="text-lg font-medium">Activity</h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Latest activity in this repository.
            </p>
          </div>
        </div>

        <div className="flex-1 mt-6 space-y-4 overflow-hidden">
          {/* Repository info skeleton */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Commits skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-900 p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-shrink-0">
        <div className="pt-1">
          <Link
            href={`/feed/organization/${orgName}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
        <div className="pt-2 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Activity</h1>
            <p className="text-neutral-500 text-sm dark:text-neutral-400">
              Latest activity in this repository.
            </p>
          </div>

          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user.login} value={user.login}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.avatar_url}
                      alt={user.login}
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{user.login}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 mt-4 overflow-hidden mb-8">
        <LastCommits
          commits={filteredCommits}
          owner={orgName}
          repo={repoName}
          slice={1000}
        />
      </div>
    </div>
  );
}

export default Page;