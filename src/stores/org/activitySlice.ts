import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface ActivityWeek {
  week: number;
  total: number;
  days: number[];
}

interface ActivityState {
  data: { [key: string]: ActivityWeek[] };
  loading: boolean;
  error: string | null;
  fetchData: (username: string, orgName: string) => Promise<void>;
  resetData: () => void;
}

export const orgActivitySlice = create<ActivityState>((set) => ({
  data: {},
  loading: false,
  error: null,
  fetchData: async (username: string, orgName: string) => {
    try {
      set({ loading: true, error: null });

      // First check if we have access to the organization
      try {
        await githubAxios.get(`https://api.github.com/orgs/${orgName}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Organization ${orgName} not found`);
        } else if (error.response?.status === 403) {
          throw new Error(`Access denied to organization ${orgName}`);
        }
        throw error;
      }

      // Get all repositories for the organization
      const reposResponse = await githubAxios.get(
        `https://api.github.com/users/${orgName}/repos?per_page=100&sort=updated`
      );

      // Fetch commit activity for each repository
      const activityPromises = reposResponse.data.map(async (repo: any) => {
        try {
          const response = await githubAxios.get(
            `https://api.github.com/repos/${orgName}/${repo.name}/stats/commit_activity`
          );
          return response.data;
        } catch (error) {
          console.warn(`Could not fetch activity for ${repo.name}:`, error);
          return [];
        }
      });

      const activitiesResults = await Promise.all(activityPromises);

      // Combine activities from all repositories
      const combinedActivities = activitiesResults.reduce((acc: ActivityWeek[], curr: ActivityWeek[]) => {
        if (!Array.isArray(curr)) return acc;

        curr.forEach((week: ActivityWeek) => {
          const existingWeek = acc.find(w => w.week === week.week);
          if (existingWeek) {
            existingWeek.total += week.total;
          } else {
            acc.push({ ...week });
          }
        });

        return acc;
      }, []);

      // Sort by week
      combinedActivities.sort((a: ActivityWeek, b: ActivityWeek) => a.week - b.week);

      set((state) => ({
        data: { ...state.data, [orgName]: combinedActivities },
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch organization activity",
        loading: false,
      });
      throw error;
    }
  },
  resetData: () => set({ data: {}, loading: false, error: null }),
}));
