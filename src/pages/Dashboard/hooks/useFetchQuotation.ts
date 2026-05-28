import axiosClient from "@/api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type { PendingQuotation } from "../config/types";
import type { PaginatedResponse } from "@/types";

export const useFetchQuotation = (page: number, size: number) => {
    return useQuery<PaginatedResponse<PendingQuotation>>({
        queryKey: ['pending-quotations', page],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/purchase-quotation/pending/page/${page}`, {
                params: { size },
            });
            return { items: res.data.data as PendingQuotation[], totalItems: res.data.totalItems as number };
        },
        retry: false,
    });
}