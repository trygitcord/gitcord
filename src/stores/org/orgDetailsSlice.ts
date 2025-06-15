import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface OrgDetailsState extends Omit<sliceTypes, 'data'> {
  data: { [key: string]: any } | null;
}

export const orgDetailsSlice = create<OrgDetailsState>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async (query?: string) => {
    if (!query) return;

    set((state) => ({
      loading: true,
      error: null,
      data: { ...state.data }
    }));

    try {
      const [orgResponse, reposResponse, membersResponse] = await Promise.all([
        githubAxios.get(`/orgs/${query}`),
        githubAxios.get(`/orgs/${query}/repos`),
        githubAxios.get(`/orgs/${query}/members`)
      ]);

      set((state) => ({
        data: {
          ...state.data,
          [query]: {
            ...orgResponse.data,
            repos_count: reposResponse.data.length,
            members: membersResponse.data
          }
        },
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
