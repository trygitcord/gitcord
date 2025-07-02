import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axios from "@/lib/axios-client";
import { toast } from "sonner";

// Types
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  isModerator: boolean;
}

interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    allUsersOption?: {
      id: string;
      name: string;
      username: string;
      avatar_url: string | null;
      userCount: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

interface SendMessageData {
  recipientId: string;
  subject: string;
  content: string;
}

interface BroadcastMessageData {
  subject: string;
  content: string;
}

// Get users for dropdown
export const useGetUsers = (search?: string, includeAll: boolean = true) => {
  return useQuery<UserListResponse>({
    queryKey: ["message-users", search, includeAll],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("includeAll", includeAll.toString());
      params.append("limit", "100"); // Get more users for dropdown

      const response = await axios.get(`/message/get-users?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user details
export const useGetUserDetails = (userId: string | null) => {
  return useQuery({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axios.get(
        `/message/get-user-details?userId=${userId}`
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

// Send message to single user
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      const response = await axios.post("/message/send-to-user", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-messages"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to send message");
    },
  });
};

// Send broadcast message
export const useBroadcastMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BroadcastMessageData) => {
      const response = await axios.post("/message/send-to-all", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Message sent to ${data.data.totalRecipients} users!`);
      queryClient.invalidateQueries({ queryKey: ["user-messages"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to send broadcast");
    },
  });
};

// Get user messages (for inbox)
export const useGetUserMessages = (
  page: number = 1,
  limit: number = 10,
  filter?: string
) => {
  return useQuery({
    queryKey: ["user-messages", page, limit, filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (filter) params.append("filter", filter);

      const response = await axios.get(`/message/get-messages?${params}`);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Mark message as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await axios.patch("/message/mark-as-read", {
        messageId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-messages"] });
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await axios.delete(
        `/message/delete-message?messageId=${messageId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({ queryKey: ["user-messages"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to delete message");
    },
  });
};

// Get message statistics (for moderators)
export const useGetMessageStats = () => {
  return useQuery({
    queryKey: ["message-stats"],
    queryFn: async () => {
      const response = await axios.get("/message/get-stats");
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};
