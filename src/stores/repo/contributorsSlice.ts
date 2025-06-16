import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const repoContributorsSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,

  // query = owner
  // query2 = repo
  fetchData: async (query?: string, query2?: string) => {
    set({ loading: true, error: null });

    const fetchWithRetry = async (retryCount = 0): Promise<any> => {
      try {
        const response = await githubAxios.get(
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
