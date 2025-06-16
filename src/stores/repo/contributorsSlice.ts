import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface ContributorStats {
  total: number;
  weeks: {
    w: number;
    a: number;
    d: number;
    c: number;
  }[];
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
}

export const repoContributorsSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,

  // query = owner
  // query2 = repo
  fetchData: async (query?: string, query2?: string) => {
    set({ loading: true, error: null });

    const fetchWithRetry = async (retryCount = 0): Promise<ContributorStats[]> => {
      try {
        const response = await githubAxios.get<ContributorStats[]>(
          `/repos/${query}/${query2}/stats/contributors`
        );

        // If we get a 202 Accepted, retry after delay
        if (response.status === 202 && retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(retryCount + 1);
        }

        return response.data;
      } catch (error: any) {
        if (error.response?.status === 202 && retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(retryCount + 1);
        }
        throw error;
      }
    };

    try {
      const data = await fetchWithRetry();
      set({ data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
