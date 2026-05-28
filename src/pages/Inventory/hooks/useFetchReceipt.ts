import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { cleanParams } from "@/utils/cleanParams";
import type { ReceiptInfo } from "../config/types";
import type { PaginatedResponse } from "@/types";
import type { OtkCostItemResponse } from "@/pages/Otk/config/otkTypes";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchReceipt = (receiptId: number) => {
    return useQuery<ReceiptInfo>({
        queryKey: ['receipt-info', receiptId],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/inventory/receipt/${receiptId}`);
            return res.data || null;
        },
        enabled: !!receiptId,
        retry: false
    });
}
export const useFetchReceiptItems = (otkId: number, page: number, size: number, filter: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<OtkCostItemResponse>>({
        queryKey: ['receipt-items', otkId, page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const res = await axiosClient.get(`/api/inventory/items-receipts/${otkId}/page/${page}`, { params });
                return { items: res.data.data, totalItems: res.data.totalItems };
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Lỗi hệ thống', 'Lỗi');
                throw error;
            }
        },
        enabled: !!otkId,
        retry: false,
    });
}