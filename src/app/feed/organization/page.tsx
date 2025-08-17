"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useOrganization,
  useOrganizationMembers,
  useOrganizationRepositories,
  useUserOrganizations,
} from "@/hooks/useGitHubQueries";
import { useUserProfile } from "@/hooks/useMyApiQueries";

interface Organization {
  id: number;
  login: string;
  avatar_url: string;
  description?: string;
}

interface OrganizationMember {
  id: number;
  login: string;
  avatar_url: string;
}

function Organizations() {
  const { data: userData, isLoading: userLoading } = useUserProfile();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Feed | Organizations";
  }, []);

  const {
    data: orgsData,
    isLoading: orgsLoading,
    error: orgsError,
  } = useUserOrganizations(userData?.username || null);

  if (userLoading || orgsLoading) {
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

  if (orgsError) {
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
            Error loading organizations: {orgsError.message}
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
        {orgsData?.map((org: Organization) => (
          <OrganizationCard
            key={org.id}
            org={org}
            hoveredMember={hoveredMember}
            setHoveredMember={setHoveredMember}
          />
        ))}
      </div>
    </div>
  );
}

// Separate component for each organization card
function OrganizationCard({
  org,
  hoveredMember,
  setHoveredMember,
}: {
  org: Organization;
  hoveredMember: string | null;
  setHoveredMember: (member: string | null) => void;
}) {
  // Individual queries for each organization
  const { data: orgDetails } = useOrganization(org.login);
  const { data: orgMembers } = useOrganizationMembers(org.login);
  const { data: orgRepos } = useOrganizationRepositories(org.login);

  return (
    <Link href={`/feed/organization/${org.login}`} className="group">
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
            {orgDetails?.description ||
              org.description ||
              "No description provided."}
          </p>
          <div className="mt-auto">
            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{orgRepos?.length || 0} Repositories</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <div className="flex -space-x-2">
                  {orgMembers?.slice(0, 3).map((member: OrganizationMember) => (
                    <div
                      key={member.id}
                      className="relative w-6 h-6 rounded-full overflow-hidden hover:z-10"
                      onMouseEnter={() => setHoveredMember(member.login)}
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
                  {orgMembers && orgMembers.length > 3 && (
                    <div className="relative w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">
                      +{orgMembers.length - 3}
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
}

export default Organizations;
