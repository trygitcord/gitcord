import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface ActivityState {
  data: { [key: string]: any[] };
  loading: boolean;
  error: string | null;
  fetchData: (username: string, repoName: string) => Promise<void>;
  resetData: () => void;
}

export const repoActivitySlice = create<ActivityState>((set) => ({
  data: {},
  loading: false,
  error: null,
  fetchData: async (username: string, repoName: string) => {
    try {
      set({ loading: true, error: null });
      const response = await githubAxios.get(`/repos/${username}/${repoName}/stats/commit_activity`);
      set((state) => ({
        data: { ...state.data, [repoName]: response.data },
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  resetData: () => {
    set({ data: {}, loading: false, error: null });
  },
}));
