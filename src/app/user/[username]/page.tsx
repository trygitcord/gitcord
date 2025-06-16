import React from "react";
import { Separator } from "@/components/ui/separator";
import { MapPin, LinkIcon, Calendar, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import GithubAnalyticsWidget from "@/components/shared/GithubAnalyticsWidget";
import Image from "next/image";
import { Metadata } from "next";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: `Gitcord | ${params.username}'s Profile`,
    description: `View ${params.username}'s profile`,
    icons: {
      icon: "/logo.svg",
    },
  };
}

async function getGithubUser(username: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_API_URL}/users/${username}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
}

async function getGitcordUser(username: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/getProfileByUsername`,
      {
        params: { username },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching Gitcord user:", error);
    return null;
  }
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }
  return num.toString();
}

const ProfilePage = async ({ params }: Props) => {
  const { username } = await params;
  const [githubUser, gitcordUser] = await Promise.all([
    getGithubUser(username),
    getGitcordUser(username),
  ]);

  if (!githubUser) {
    return (
      <div className="text-center mt-20 text-red-500">
        Github user not found.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="max-w-[420px] rounded-2xl w-full mx-auto border border-gray-200 shadow-lg bg-white overflow-visible">
        {/* Banner ve Profil Fotoğrafı */}
        <div className="relative w-full h-24">
          <div
            className="absolute top-0 left-0 w-full h-24 rounded-t-2xl z-0"
            style={{
              background: "linear-gradient(90deg, #3a9d5a 0%, #2d7d46 100%)",
            }}
          />
          {/* View Count */}
          {gitcordUser && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-white">
              <Eye className="w-4 h-4 font-semibold" />
              <span className="text-sm font-semibold">
                {formatNumber(gitcordUser.stats?.view_count || 0)}
              </span>
            </div>
          )}
          {/* Profile Picture */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="rounded-full w-24 h-24 border border-gray-200 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden bg-white">
              <img
                src={githubUser.avatar_url}
                alt={githubUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        {/* Kart içeriği */}
        <div className="flex flex-col gap-4 p-4 mt-12">
          {/* Profile info */}
          <div className="grid gap-4 px-4 py-4 rounded-xl bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="grid gap-1">
                <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {githubUser.name || githubUser.login}
                </div>
                <div className="text-sm text-gray-500">@{githubUser.login}</div>
              </div>
              {gitcordUser && (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="p-0.5 rounded-full text-neutral-950 transition-colors">
                          <Image
                            src="/member-card.png"
                            alt="Gitcord Logo"
                            width={20}
                            height={20}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gitcord Member</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {gitcordUser.isModerator && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-0.5 rounded-full text-[#ED4245] transition-colors">
                            <Image
                              src="/banner.png"
                              alt="Moderator"
                              width={20}
                              height={20}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Moderator</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {gitcordUser.premium?.isPremium && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-0.5 rounded-full text-[#FEE75C] transition-colors">
                            <Image
                              src="/premium.png"
                              alt="Premium"
                              width={20}
                              height={20}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Premium</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {gitcordUser.stats?.view_count > 1000 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-0.5 rounded-full transition-colors">
                            <Image
                              src="/fire.png"
                              alt="Popular"
                              width={20}
                              height={20}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hype!!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900">
                  {githubUser.public_repos}
                </div>
                <div className="text-xs text-gray-500">Repositories</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900">
                  {githubUser.followers}
                </div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900">
                  {githubUser.following}
                </div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* About */}
            <div className="grid gap-2">
              <div className="text-xs font-bold uppercase text-gray-900">
                About
              </div>
              <div className="text-sm text-gray-600">
                {githubUser.bio || "No bio provided."}
              </div>
            </div>

            {/* Details */}
            <div className="grid gap-3">
              {githubUser.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {githubUser.location}
                </div>
              )}
              {githubUser.blog && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={githubUser.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {githubUser.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Joined {new Date(githubUser.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <GithubAnalyticsWidget />
    </div>
  );
};

export default ProfilePage;
