import { GITHUB_API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import axios from "axios";

export const orgReposSlice = create<sliceTypes>((set) => ({
  data: null,
  loading: true,
  error: null,


  fetchData: async (query?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${GITHUB_API_URL}/orgs/${query}/repos`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
