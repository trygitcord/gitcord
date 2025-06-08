import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import axios from "axios";

export const repoCommitStatsSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,

  // query = owner
  // query2 = repo
  fetchData: async (query?: string, query2?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${GITHUB_API_URL}/repos/${query}/${query2}/stats/commit_activity`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
