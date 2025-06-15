import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

export const repoIssuesSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,

  // query = owner
  // query2 = repo
  fetchData: async (query?: string, query2?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await githubAxios.get(`/repos/${query}/${query2}/issues`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
