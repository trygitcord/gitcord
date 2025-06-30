import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios-client";
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
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create code");
        },
    });
}; 