import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios-client";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface CreateCodeData {
  code: string;
  credit: number;
  premium?: boolean;
  premiumDays?: number;
  usageLimit?: number;
}

export const useCreateCode = () => {
  return useMutation({
    mutationFn: async (data: CreateCodeData) => {
      const response = await axios.post("/code/create", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Code created successfully!");
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to create code");
    },
  });
};

export const useGetCodes = () => {
  return useQuery({
    queryKey: ["codes"],
    queryFn: async () => {
      const response = await axios.get("/code/getAll");
      return response.data;
    },
  });
};

export const useDeleteCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/code/delete", { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Code deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["codes"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || "Failed to delete code");
    },
  });
};
