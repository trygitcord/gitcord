import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axios from "@/lib/axios-client";
import { toast } from "sonner";

export interface FeedbackItem {
  _id: string;
  userId: string;
  username: string;
  message: string;
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    avatar_url: string;
    name: string;
    username: string;
  } | null;
  type?: "bug" | "feature" | "request";
}

interface FeedbackResponse {
  success: boolean;
  data: {
    feedbacks: FeedbackItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface SubmitFeedbackData {
  message: string;
  consentGiven: boolean;
  type?: "bug" | "feature" | "request";
}

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitFeedbackData) => {
      const response = await axios.post("/feedback", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to submit feedback");
    },
  });
};

export const useGetFeedbacks = (
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<FeedbackResponse>({
    queryKey: ["feedbacks", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await axios.get(`/feedback?${params}`);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId: string) => {
      const response = await axios.delete(`/feedback?feedbackId=${feedbackId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Feedback deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to delete feedback");
    },
  });
};