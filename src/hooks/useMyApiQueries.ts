import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";
import { apiFetcher } from "@/lib/fetcher";
import axios from "@/lib/axios";

export const useUserProfile = () =>
  useQuery({
    queryKey: ["user-profile"],
    queryFn: () => apiFetcher(`${API_URL}/api/user/getUserProfile`),
  });

export const useProfileByUsername = (username: string) =>
  useQuery({
    queryKey: ["profile-by-username", username],
    queryFn: () => apiFetcher(`${API_URL}/api/user/getProfileByUsername?username=${username}`),
    enabled: !!username,
  });

export const useActivityLeaderboard = () =>
  useQuery({
    queryKey: ["activity-leaderboard"],
    queryFn: () => apiFetcher(`${API_URL}/api/leaderboard/getLeaderboard`),
  });

export const useRedeemCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await axios.post(`${API_URL}/api/code/redeem`, { code });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
