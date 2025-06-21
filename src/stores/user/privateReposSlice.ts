import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface PrivateReposState extends sliceTypes {
  resetData: () => void;
}

export const privateReposSlice = create<PrivateReposState>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await githubAxios.get(`/user/repos`, {
        params: {
          visibility: 'all'
        }
      });
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  resetData: () => {
    set({ data: null, loading: true, error: null });
  },
}));
