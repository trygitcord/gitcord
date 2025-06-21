import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface LanguagesState {
  data: { [key: string]: { [key: string]: number } };
  loading: boolean;
  error: string | null;
  fetchData: (username: string, repoName: string) => Promise<void>;
  resetData: () => void;
}

export const repoLanguagesSlice = create<LanguagesState>((set) => ({
  data: {},
  loading: false,
  error: null,
  fetchData: async (username: string, repoName: string) => {
    try {
      set({ loading: true, error: null });
      const response = await githubAxios.get(`/repos/${username}/${repoName}/languages`);
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
