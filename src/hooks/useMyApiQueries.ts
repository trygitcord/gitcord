import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";
import { apiFetcher } from "@/lib/fetcher";
import axios from "@/lib/axios";
import { UserProfile } from "@/types/userTypes";

export const useUserProfile = () =>
  useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: () => apiFetcher(`${API_URL}/api/user/getUserProfile`),
  });

export const useProfileByUsername = (username: string) =>
  useQuery<UserProfile>({
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

export const useUpdatePrivacy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (isPrivate: boolean) => {
      const response = await axios.post(`${API_URL}/api/user/updatePrivacy`, { isPrivate });
      return response.data;
    },
    onSuccess: (data: { isPrivate: boolean }) => {
      // Update user profile cache
      queryClient.setQueryData<UserProfile>(["user-profile"], (oldData) => {
        if (oldData) {
          return { ...oldData, isPrivate: data.isPrivate };
        }
        return oldData;
      });
      
      // Invalidate leaderboard to reflect privacy changes
      queryClient.invalidateQueries({ queryKey: ["activity-leaderboard"] });
    },
    onError: (error) => {
      console.error("Privacy update failed:", error);
    }
  });
};
