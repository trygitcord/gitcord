import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";
import { apiFetcher } from "@/lib/fetcher";

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
