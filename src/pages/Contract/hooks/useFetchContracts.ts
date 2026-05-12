import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { PaginatedResponse } from "@/types";
import { cleanParams } from "@/utils/cleanParams";
import { useQuery } from "@tanstack/react-query";
import type { Contract } from "../config/types";

export const useFetchContract = (page: number, size: number, filter: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<Contract>>({
        queryKey: ['contracts', 'list', page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const response = await axiosClient.get(`/api/contract/page/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems };
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách hợp đồng';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!page,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}