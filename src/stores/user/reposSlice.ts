import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface UserReposState extends sliceTypes {
  resetData: () => void;
}

export const userReposSlice = create<UserReposState>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async (query?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await githubAxios.get(`/users/${query}/repos`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  resetData: () => {
    set({ data: null, loading: true, error: null });
  },
}));
