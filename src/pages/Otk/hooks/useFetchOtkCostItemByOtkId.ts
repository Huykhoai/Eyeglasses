import { useQuery } from "@tanstack/react-query"
import type { PaginatedResponse } from "@/types"
import type { OtkCostItemResponse } from "../config/otkTypes"
import { cleanParams } from "@/utils/cleanParams";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchOtkCostItemByOtkId = (otkId: number, page: number, size: number, filter: any) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<OtkCostItemResponse>>({
            queryKey: ['otk-cost-items', otkId, page, size, filter],
            queryFn: async () => {
                try {
                    const params = cleanParams({ ...filter, size });
                    const res = await axiosClient.get(`/api/inventory/items-receipts/${otkId}/page/${page}`, { params });
                    return { items: res.data.data, totalItems: res.data.totalItems };
                } catch (error: any) {
                    const message = error?.response?.data?.message || 'Lỗi hệ thống';
                    showNotification('error', message, 'Lỗi lấy dữ liệu ');
                    throw error;
                }
            },
            enabled: !!otkId,
            retry: false,
        });
}