import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { PaginatedResponse } from "@/types";
import { cleanParams } from "@/utils/cleanParams";
import { useQuery } from "@tanstack/react-query";
import type { DeliverySchedule } from "../config/types";

export const useFetchDelivery = (page: number, size: number, filter: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<DeliverySchedule>>({
        queryKey: ['delivery', 'list', page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const response = await axiosClient.get(`/api/delivery/page/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems };
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách lịch giao hàng';
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
