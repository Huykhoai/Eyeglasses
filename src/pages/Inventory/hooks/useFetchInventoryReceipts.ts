import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/types";
import { cleanParams } from "@/utils/cleanParams";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { InventoryReceiptResponse } from "../config/types";

export const useFetchInventoryReceipts = (page: number, size: number, filter: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<InventoryReceiptResponse>>({
        queryKey: ['inventory-receipts', page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const res = await axiosClient.get(`/api/inventory/receipts/page/${page}`, { params });
                return { items: res.data.data, totalItems: res.data.totalItems };
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Lỗi hệ thống', 'Lỗi');
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}