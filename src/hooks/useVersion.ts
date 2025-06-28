import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";
import { apiFetcher } from "@/lib/fetcher";

interface VersionData {
    version: string;
    totalCommits: number;
    lastUpdated: string;
    error?: string;
}

export const useVersion = () => {
    return useQuery({
        queryKey: ["version"],
        queryFn: () => apiFetcher(`${API_URL}/api/version/getVersion`) as Promise<VersionData>,
        staleTime: 60 * 60 * 1000, // 1 hour
        refetchInterval: 60 * 60 * 1000, // Refetch every hour
    });
}; 