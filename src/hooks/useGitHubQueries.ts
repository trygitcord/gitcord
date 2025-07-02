import { useQuery } from "@tanstack/react-query";
import { githubFetcher } from "@/lib/fetcher";

// User Repositories Query
export const useUserRepositories = (username: string | null) => {
  return useQuery({
    queryKey: ["user-repos", username],
    queryFn: async () =>
      githubFetcher(`/users/${username}/repos?per_page=100&sort=updated`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!username,
  });
};

// User Organizations Query
export const useUserOrganizations = (username: string | null) => {
  return useQuery({
    queryKey: ["user-orgs", username],
    queryFn: async () => githubFetcher(`/users/${username}/orgs`),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!username,
  });
};

// User Events Query
export const useUserEvents = (username: string | null) => {
  return useQuery({
    queryKey: ["user-events", username],
    queryFn: async () =>
      githubFetcher(`/users/${username}/events?per_page=100`),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!username,
  });
};

// Repository Query
export const useRepository = (owner: string | null, repo: string | null) => {
  return useQuery({
    queryKey: ["repository", owner, repo],
    queryFn: async () => githubFetcher(`/repos/${owner}/${repo}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(owner && repo),
  });
};

// Repository Languages Query
export const useRepositoryLanguages = (
  owner: string | null,
  repo: string | null
) => {
  return useQuery({
    queryKey: ["repo-languages", owner, repo],
    queryFn: async () => githubFetcher(`/repos/${owner}/${repo}/languages`),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!(owner && repo),
  });
};

// Repository Commits Query
export const useRepositoryCommits = (
  owner: string | null,
  repo: string | null
) => {
  return useQuery({
    queryKey: ["repo-commits", owner, repo],
    queryFn: async () => {
      let allCommits: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && allCommits.length < 1000) {
        // Limit to prevent infinite requests
        const commits = await githubFetcher(
          `/repos/${owner}/${repo}/commits?per_page=100&page=${page}`
        );

        allCommits = [...allCommits, ...commits];

        if (commits.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      return allCommits;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!(owner && repo),
  });
};

// Repository Commit Activity Query
export const useRepositoryCommitActivity = (
  owner: string | null,
  repo: string | null
) => {
  return useQuery({
    queryKey: ["repo-commit-activity", owner, repo],
    queryFn: async () => {
      const response = await githubFetcher(
        `/repos/${owner}/${repo}/stats/commit_activity`
      );

      // GitHub stats API returns 202 when computing, empty array when no data
      if (Array.isArray(response) && response.length === 0) {
        console.log("Commit Activity: Empty array received - likely computing");
        throw new Error("Commit activity data is still being computed");
      }

      // GitHub stats döndürdüğü response tipini kontrol et
      if (
        !response ||
        (typeof response === "object" &&
          !Array.isArray(response) &&
          Object.keys(response).length === 0)
      ) {
        console.log(
          "Commit Activity: Empty object received - likely computing"
        );
        throw new Error("Commit activity data is still being computed");
      }

      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (reduced from 1 hour)
    enabled: !!(owner && repo),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 202) {
        return failureCount < 8; // Increased from 5
      }

      if (error?.message?.includes("computed")) {
        return failureCount < 5; // Increased from 3
      }
      return failureCount < 3; // Increased from 2
    },
    retryDelay: (attemptIndex) => {
      if (attemptIndex < 2) {
        return 2000; // Increased from 1000ms
      }
      return Math.min(4000 * attemptIndex, 20000); // 4s, 8s, 12s... max 20s
    },
    gcTime: 30 * 60 * 1000, // 30 minutes cache (reduced from 1 hour)
    networkMode: "online",
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Changed from false to true!
    refetchOnReconnect: true,
  });
};

// Repository Contributors Query
export const useRepositoryContributors = (
  owner: string | null,
  repo: string | null
) => {
  return useQuery({
    queryKey: ["repo-contributors", owner, repo],
    queryFn: async () => {
      const response = await githubFetcher(
        `/repos/${owner}/${repo}/stats/contributors`
      );

      // GitHub API döndürdüğü response tipini kontrol et
      if (
        !response ||
        (typeof response === "object" &&
          !Array.isArray(response) &&
          Object.keys(response).length === 0)
      ) {
        console.log("Contributors: Empty object received - likely computing");
        throw new Error("Contributors data is still being computed");
      }

      // GitHub stats API returns 202 when computing, empty array when no data
      if (Array.isArray(response) && response.length === 0) {
        // This might be legitimate "no contributors" rather than "still computing"
        // Let's return the empty array and let the component handle it
        console.log("Contributors: Empty array received");
        return response;
      }

      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (reduced from 15)
    enabled: !!(owner && repo),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 202) {
        return failureCount < 8; // Increased from 5
      }

      if (error?.message?.includes("computed")) {
        return failureCount < 5; // Increased from 3
      }
      return failureCount < 3; // Increased from 2
    },
    retryDelay: (attemptIndex) => {
      if (attemptIndex < 2) {
        return 2000; // Increased from 1000ms
      }
      return Math.min(4000 * attemptIndex, 20000); // 4s, 8s, 12s... max 20s
    },
    gcTime: 30 * 60 * 1000, // 30 minutes cache (reduced from 1 hour)
    networkMode: "online",
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Changed from false to true!
    refetchOnReconnect: true,
  });
};

// Repository Issues Query
export const useRepositoryIssues = (
  owner: string | null,
  repo: string | null
) => {
  return useQuery({
    queryKey: ["repo-issues", owner, repo],
    queryFn: async () =>
      githubFetcher(`/repos/${owner}/${repo}/issues?state=all&per_page=100`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(owner && repo),
  });
};

// Repository Pull Requests Query
export const useRepositoryPulls = (
  owner: string | null,
  repo: string | null
) => {
  return useQuery({
    queryKey: ["repo-pulls", owner, repo],
    queryFn: async () =>
      githubFetcher(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(owner && repo),
  });
};

// Organization Query
export const useOrganization = (org: string | null) => {
  return useQuery({
    queryKey: ["organization", org],
    queryFn: async () => {
      try {
        return await githubFetcher(`/orgs/${org}`);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          throw new Error(`Organization ${org} not found`);
        }
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!org,
  });
};

// Organization Repositories Query
export const useOrganizationRepositories = (org: string | null) => {
  return useQuery({
    queryKey: ["org-repos", org],
    queryFn: async () =>
      githubFetcher(`/orgs/${org}/repos?per_page=100&type=all`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!org,
  });
};

// Organization Members Query
export const useOrganizationMembers = (org: string | null) => {
  return useQuery({
    queryKey: ["org-members", org],
    queryFn: async () => githubFetcher(`/orgs/${org}/members?per_page=100`),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!org,
  });
};

// Organization Activity Query
export const useOrganizationActivity = (org: string | null) => {
  return useQuery({
    queryKey: ["org-activity", org],
    queryFn: async () => {
      // Get all repositories for the organization
      const repos = await githubFetcher(
        `/orgs/${org}/repos?per_page=100&type=all`
      );

      // Fetch commit activity for each repository
      const activityPromises = repos.map(async (repo: any) => {
        try {
          const response = await githubFetcher(
            `/repos/${org}/${repo.name}/stats/commit_activity`
          );
          return response;
        } catch (error) {
          console.warn(`Could not fetch activity for ${repo.name}:`, error);
          return [];
        }
      });

      const activitiesResults = await Promise.all(activityPromises);

      // Combine activities from all repositories
      const combinedActivities = activitiesResults.reduce(
        (acc: any[], curr: any[]) => {
          if (!Array.isArray(curr)) return acc;

          curr.forEach((week: any) => {
            const existingWeek = acc.find((w) => w.week === week.week);
            if (existingWeek) {
              existingWeek.total += week.total;
              existingWeek.days = existingWeek.days.map(
                (day: number, idx: number) => day + (week.days[idx] || 0)
              );
            } else {
              acc.push({ ...week });
            }
          });

          return acc;
        },
        []
      );

      // Sort by week
      return combinedActivities.sort((a: any, b: any) => a.week - b.week);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!org,
    retry: (failureCount, error: any) => {
      // GitHub stats endpoints can return 202 while computing
      if (error?.response?.status === 202) {
        return failureCount < 5;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Organization Languages Query
export const useOrganizationLanguages = (org: string | null) => {
  return useQuery({
    queryKey: ["org-languages", org],
    queryFn: async () => {
      // Get all repositories for the organization
      const repos = await githubFetcher(
        `/orgs/${org}/repos?per_page=100&type=all`
      );

      // Fetch languages for each repository
      const languagesPromises = repos.map(async (repo: any) => {
        try {
          const languages = await githubFetcher(
            `/repos/${org}/${repo.name}/languages`
          );
          return languages;
        } catch (error) {
          console.warn(`Could not fetch languages for ${repo.name}:`, error);
          return {};
        }
      });

      const languagesResults = await Promise.all(languagesPromises);

      // Combine languages from all repositories
      const combinedLanguages = languagesResults.reduce(
        (acc: { [key: string]: number }, curr: { [key: string]: number }) => {
          Object.entries(curr).forEach(([lang, bytes]) => {
            acc[lang] = (acc[lang] || 0) + bytes;
          });
          return acc;
        },
        {}
      );

      // Sort languages by total bytes and return as array
      return Object.entries(combinedLanguages)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .reduce((acc: { [key: string]: number }, [lang, bytes]) => {
          acc[lang] = bytes as number;
          return acc;
        }, {});
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!org,
  });
};

// Private Repositories Query
export const usePrivateRepositories = () => {
  return useQuery({
    queryKey: ["private-repos"],
    queryFn: async () =>
      githubFetcher(`/user/repos?visibility=all&per_page=100`),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// GitHub User Query
export const useGitHubUser = (username: string | null) => {
  return useQuery({
    queryKey: ["github-user", username],
    queryFn: async () => {
      try {
        return await githubFetcher(`/users/${username}`);
      } catch (error: any) {
        // Check if it's a 404 error (user not found on GitHub)
        if (error.response?.status === 404) {
          console.log(`GitHub user ${username} not found`);
          return null;
        }
        // Log other errors
        console.error("Error fetching GitHub user:", error.message || error);
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!username,
    retry: (failureCount, error: any) => {
      // Don't retry 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
