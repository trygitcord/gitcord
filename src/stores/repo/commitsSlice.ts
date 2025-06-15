import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import githubAxios from "@/lib/axios";

export const repoCommitsSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,

  // query = owner
  // query2 = repo
  fetchData: async (query?: string, query2?: string) => {
    set({ loading: true, error: null });
    try {
      let allCommits: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await githubAxios.get(
          `/repos/${query}/${query2}/commits?per_page=100&page=${page}`
        );

        const commits = response.data;
        allCommits = [...allCommits, ...commits];

        // If we got less than 100 commits, we've reached the end
        if (commits.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      set({ data: allCommits, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
