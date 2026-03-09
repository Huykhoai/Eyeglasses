import axiosClient from "@/api/axiosClient";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useFetchAll = <T>(
    queryKey: string[], 
    url: string, 
    options?: Partial<UseQueryOptions<T>>) => {
        return useQuery<T>({
            queryKey,
            queryFn: async () => {
                const response = await axiosClient.get(url);
                return response.data;
            },
            staleTime: 60 * 60 * 1000,
            gcTime: 24 * 60 * 60 * 1000,
            ...options
        })
    }