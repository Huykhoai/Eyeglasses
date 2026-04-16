import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { cleanParams } from "@/utils/cleanParams";
import type { PaginatedResponse } from "@/types";
import type { PurchaseQuotationType } from "../config/types";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchPurchaseQuotation = (page: number, size: number, filters: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<PurchaseQuotationType>>({
        queryKey: ['purchase-quotation', page, size, filters],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filters, size });
                const response = await axiosClient.get(`/api/purchase-quotation/page/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems } as PaginatedResponse<PurchaseQuotationType>;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi tải danh sách báo giá';
                showNotification('error', message, "Lỗi tải dữ liệu");
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
