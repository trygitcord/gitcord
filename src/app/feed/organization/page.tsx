"use client";

import React, { useEffect, useState } from "react";
import { userOrgsSlice } from "@/stores/user/orgsSlice";
import { orgDetailsSlice } from "@/stores/org/orgDetailsSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function Organizations() {
  const {
    data: orgsData,
    loading: orgsLoading,
    error: orgsError,
    fetchData: fetchOrgs,
  } = userOrgsSlice();

  const {
    data: orgDetails,
    loading: detailsLoading,
    error: detailsError,
    fetchData: fetchOrgDetails,
  } = orgDetailsSlice();

  const [mounted, setMounted] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const username = localStorage.getItem("username");
    if (username) {
      fetchOrgs(username);
    }
  }, []);

  useEffect(() => {
    if (orgsData) {
      orgsData.forEach((org: any) => {
        fetchOrgDetails(org.login);
      });
    }
  }, [orgsData]);

  const isLoading = !mounted || orgsLoading || detailsLoading || !orgsData;
  const error = orgsError || detailsError;

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <div className="mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2">
            Organizations
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Explore all organizations you are a member of.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full">
        <div className="mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2">
            Organizations
          </h1>
          <p className="text-neutral-500 text-sm dark:text-neutral-400">
            Explore all organizations you are a member of.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-400 dark:text-neutral-500">
            Error loading organizations: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-lg font-medium flex items-center gap-2">
          Organizations
        </h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Explore all organizations you are a member of.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgsData.map((org: any) => {
          const orgDetail = orgDetails?.[org.login];
          return (
            <Link
              key={org.id}
              href={`/feed/organization/${org.login}`}
              className="group"
            >
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={org.avatar_url}
                        alt={`${org.login}'s avatar`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-neutral-800 dark:text-neutral-200 font-medium group-hover:text-[#5BC898] transition-colors">
                      {org.login}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">
                    {org.description || "No description provided."}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{orgDetail?.repos_count || 0} Repositories</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <div className="flex -space-x-2">
                          {orgDetail?.members
                            ?.slice(0, 3)
                            .map((member: any) => (
                              <div
                                key={member.id}
                                className="relative w-6 h-6 rounded-full overflow-hidden hover:z-10"
                                onMouseEnter={() =>
                                  setHoveredMember(member.login)
                                }
                                onMouseLeave={() => setHoveredMember(null)}
                              >
                                <Image
                                  src={member.avatar_url}
                                  alt={member.login}
                                  fill
                                  className="object-cover"
                                />
                                {hoveredMember === member.login && (
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded whitespace-nowrap z-50">
                                    {member.login}
                                  </div>
                                )}
                              </div>
                            ))}
                          {orgDetail?.members?.length > 3 && (
                            <div className="relative w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">
                              +{orgDetail.members.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Organizations;
