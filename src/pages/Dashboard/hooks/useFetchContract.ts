import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import type { PendingContract } from "../config/types";
import type { PaginatedResponse } from "@/types";

export const useFetchContract = (page: number, size: number, hasPermission: boolean | undefined) => {
    return useQuery<PaginatedResponse<PendingContract>>({
        queryKey: ['pending-contracts', page, size],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/contract/pending/page/${page}`, {
                params: { size },
            });
            return { items: res.data.data as PendingContract[], totalItems: res.data.totalItems as number };
        },
        enabled: hasPermission,
        retry: false,
    });
}