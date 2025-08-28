"use client";

import React, { use, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { MapPin, LinkIcon, Calendar, Eye } from "lucide-react";
import GithubAnalyticsWidget from "@/components/shared/GithubAnalyticsWidget";
import Image from "next/image";
import ContributionGraph from "@/components/shared/ContributionGraph";
import { ShareProfileButton } from "@/components/shared/ShareProfileButton";
import { useGitHubUser } from "@/hooks/useGitHubQueries";
import { useProfileByUsername } from "@/hooks/useMyApiQueries";
import { useGithubContributions } from "@/hooks/useGithubContributions";
import Link from "next/link";

interface Props {
  params: Promise<{ username: string }>;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function ensureHttps(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

const ProfilePage = ({ params }: Props) => {
  const { username } = use(params);

  // React Query hooks
  const {
    data: githubUser,
    isLoading: githubLoading,
    error: githubError,
  } = useGitHubUser(username);
  const { data: gitcordUser } = useProfileByUsername(username);
  const { data: contributions } = useGithubContributions(username);

  // Update document title when user data is loaded
  useEffect(() => {
    if (githubUser) {
      document.title = `Gitcord | ${
        githubUser.name || githubUser.login
      }'s profile`;
    } else if (githubError || (!githubLoading && !githubUser)) {
      document.title = `@${username} - Gitcord`;
    } else {
      document.title = `Gitcord | Loading...`;
    }
  }, [githubUser, githubError, githubLoading, username]);

  // Loading state
  if (githubLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950">
        <div className="max-w-[420px] rounded-2xl w-full mx-auto border border-neutral-800 shadow-lg bg-neutral-900 overflow-hidden">
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-neutral-800 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-neutral-800 rounded animate-pulse w-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or user not found
  if (githubError || !githubUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950">
        <div className="max-w-[420px] rounded-2xl w-full mx-auto border border-neutral-800 shadow-lg bg-neutral-900 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative w-full h-24">
            <div
              className="absolute top-0 left-0 w-full h-24 rounded-t-2xl z-0"
              style={{
                background: "linear-gradient(135deg, #2d7d46 0%, #1b1f23 100%)",
                backgroundImage:
                  "radial-gradient(circle at 100% 0%, rgba(45, 125, 70, 0.8) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(27, 31, 35, 0.8) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-100">
                User Not Found
              </h2>
              <p className="text-sm text-neutral-400 max-w-sm">
                The GitHub user &quot;{username}&quot; could not be found.
                Please check the username and try again.
              </p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-xs text-neutral-500">
                Make sure the username is correct and the user exists on GitHub.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950">
      <div className="max-w-[420px] rounded-2xl w-full mx-auto border border-neutral-800 shadow-lg bg-neutral-900 overflow-visible">
        {/* Banner ve Profil Fotoğrafı */}
        <div className="relative w-full h-24">
          <div
            className="absolute top-0 left-0 w-full h-24 rounded-t-2xl z-0"
            style={{
              background: "linear-gradient(135deg, #2d7d46 0%, #1b1f23 100%)",
              backgroundImage:
                "radial-gradient(circle at 100% 0%, rgba(45, 125, 70, 0.8) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(27, 31, 35, 0.8) 0%, transparent 50%)",
            }}
          />
          {/* Share Profile Button */}
          <div className="absolute top-4 left-4 z-10">
            <ShareProfileButton username={username} />
          </div>
          {/* View Count */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-neutral-100">
            <Eye className="w-4 h-4 font-semibold" />
            <span className="text-sm font-semibold">
              {gitcordUser
                ? formatNumber(gitcordUser.stats?.view_count || 0)
                : "~"}
            </span>
          </div>
          {/* Profile Picture */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="rounded-full w-24 h-24 border border-neutral-800 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden bg-neutral-900">
              <Image
                src={githubUser.avatar_url}
                alt={"user avatar"}
                className="w-full h-full object-cover"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
        {/* Kart içeriği */}
        <div className="flex flex-col gap-4 p-4 mt-12">
          {/* Profile info */}
          <div className="grid gap-4 px-4 py-4 rounded-xl bg-neutral-950">
            <div className="flex items-start justify-between">
              <div className="grid gap-1">
                <div className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  {githubUser.name || githubUser.login}
                </div>
                <div className="text-sm">
                  <Link
                    href={`https://github.com/${githubUser.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-neutral-200 hover:underline"
                  >
                    @{githubUser.login}
                  </Link>
                </div>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-100">
                  {githubUser.public_repos}
                </div>
                <div className="text-xs text-neutral-400">Repositories</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-100">
                  {githubUser.followers}
                </div>
                <div className="text-xs text-neutral-400">Followers</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-100">
                  {githubUser.following}
                </div>
                <div className="text-xs text-neutral-400">Following</div>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* Roles */}
            <div className="grid gap-2">
              <div className="text-xs font-bold uppercase text-neutral-100">
                Roles
              </div>
              <div className="flex items-center gap-2 flex-wrap cursor-pointer">
                {(() => {
                  const roles: Array<{
                    label: string;
                    color: string;
                    ring: string;
                    text: string;
                    glow: string;
                    dot: string;
                  }> = [];

                  if (gitcordUser) {
                    roles.push({
                      label: "Gitcord Member",
                      color: "bg-emerald-500/15",
                      ring: "ring-emerald-500/30",
                      text: "text-emerald-300",
                      glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
                      dot: "bg-emerald-400",
                    });
                  }

                  if (gitcordUser?.isModerator) {
                    roles.push({
                      label: "Moderator",
                      color: "bg-red-500/15",
                      ring: "ring-red-500/30",
                      text: "text-red-300",
                      glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
                      dot: "bg-red-400",
                    });
                  }

                  if (
                    githubUser.followers >= 50 ||
                    githubUser.public_repos >= 15
                  ) {
                    roles.push({
                      label: "GitHub Verified",
                      color: "bg-blue-500/15",
                      ring: "ring-blue-500/30",
                      text: "text-blue-300",
                      glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
                      dot: "bg-blue-400",
                    });
                  }

                  if (gitcordUser?.premium?.isPremium) {
                    roles.push({
                      label: "Premium",
                      color: "bg-yellow-500/15",
                      ring: "ring-yellow-500/30",
                      text: "text-yellow-200",
                      glow: "shadow-[0_0_20px_rgba(234,179,8,0.25)]",
                      dot: "bg-yellow-400",
                    });
                  }

                  if (
                    gitcordUser?.stats?.view_count !== undefined &&
                    gitcordUser?.stats?.view_count > 200
                  ) {
                    roles.push({
                      label: "Hype",
                      color: "bg-fuchsia-500/15",
                      ring: "ring-fuchsia-500/30",
                      text: "text-fuchsia-300",
                      glow: "shadow-[0_0_20px_rgba(217,70,239,0.25)]",
                      dot: "bg-fuchsia-400",
                    });
                  }

                  if (roles.length === 0) {
                    return (
                      <span className="text-sm text-neutral-500">No roles</span>
                    );
                  }

                  return roles.map((role) => (
                    <span
                      key={role.label}
                      className={
                        `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ` +
                        `${role.color} ${role.text} ring-1 ${role.ring} backdrop-blur-sm border border-neutral-800/60 ` +
                        `hover:brightness-110 transition shadow-sm ${role.glow}`
                      }
                    >
                      <span className={`h-2 w-2 rounded-full ${role.dot}`} />
                      {role.label}
                    </span>
                  ));
                })()}
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* About */}
            <div className="grid gap-2">
              <div className="text-xs font-bold uppercase text-neutral-100">
                About
              </div>
              <div className="text-sm text-neutral-400">
                {githubUser.bio || "No bio provided."}
              </div>
            </div>

            {/* Details */}
            <div className="grid gap-3">
              {githubUser.location && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin className="w-4 h-4" />
                  {githubUser.location}
                </div>
              )}
              {githubUser.blog && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <LinkIcon className="w-4 h-4" />
                  <Link
                    href={ensureHttps(githubUser.blog)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {githubUser.blog}
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Calendar className="w-4 h-4" />
                Joined {new Date(githubUser.created_at).toLocaleDateString()}
              </div>

              <ContributionGraph contributions={contributions || []} />
            </div>
          </div>

          {/* Contribution Graph */}
        </div>
      </div>
      <GithubAnalyticsWidget />
    </div>
  );
};

export default ProfilePage;
