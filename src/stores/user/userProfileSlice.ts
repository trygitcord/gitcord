import { API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import axios from "axios";

interface UserProfileState extends sliceTypes {
  resetData: () => void;
}

export const getUserProfile = create<UserProfileState>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async (query?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/user/getUserProfile${query || ''}`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  resetData: () => {
    set({ data: null, loading: true, error: null });
  },
}));
