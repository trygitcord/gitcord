import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

export const orgReposSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,

  // query = org name
  fetchData: async (query?: string) => {
    if (!query) return;

    set({ loading: true, error: null });
    try {
      // First check if the organization exists
      try {
        await githubAxios.get(`/orgs/${query}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Organization ${query} not found`);
        } else if (error.response?.status === 403) {
          throw new Error(`Access denied to organization ${query}`);
        }
        throw error;
      }

      const response = await githubAxios.get(`/orgs/${query}/repos?per_page=100&type=all`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
