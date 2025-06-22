import { API_URL } from "@/lib/config";
import { sliceTypes } from "@/types/sliceTypes";
import { create } from "zustand";
import axios from "axios";

interface LeaderboardUser {
  _id: string;
  username: string;
  name: string;
  avatar_url: string;
  github_profile_url: string;
  weeklyScore: number;
  pushEvents: number;
  pullRequests: number;
  issues: number;
}

interface LeaderboardData {
  success: boolean;
  data: LeaderboardUser[];
  lastUpdated: string;
  period?: {
    days: number;
    from: string;
    to: string;
  };
}

interface LeaderboardState extends sliceTypes {
  data: LeaderboardData | null;
  resetData: () => void;
}

export const useLeaderboard = create<LeaderboardState>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/leaderboard/getLeaderboard`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch leaderboard data', loading: false });
    }
  },

  resetData: () => {
    set({ data: null, loading: true, error: null });
  },
}));
