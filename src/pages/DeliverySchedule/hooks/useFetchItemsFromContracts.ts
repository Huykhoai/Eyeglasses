import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { PaginatedResponse } from "@/types";
import { cleanParams } from "@/utils/cleanParams";
import { useQueries } from "@tanstack/react-query";
import type { ContractItem } from "@/pages/Contract/config/types";

export const useFetchItemsFromContracts = (
    contractIds: number[],
    page: number,
    size: number,
    filters: Record<string, any>
) => {
    const { showNotification } = useNotification();
    const results = useQueries({
        queries: contractIds.map((id) => ({
            queryKey: ['delivery', 'contract-items', id, page, size, filters],
            queryFn: async (): Promise<PaginatedResponse<ContractItem>> => {
                try {
                    const params = cleanParams({ ...filters, size });
                    const response = await axiosClient.get(`/api/contract/items-detail/${id}/${page}`, {
                        params: params
                    });
                    return { items: response.data.data, totalItems: response.data.totalItems };
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
                    showNotification('error', message, 'Lỗi lấy dữ liệu');
                    throw error;
                }
            },
            enabled: !!id,
            retry: false,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        })),
    });
    const contractItems = results.flatMap((result) => result.data?.items || []);
    const isLoading = results.some(result => result.isLoading);
    const totalItems = results.length > 0
        ? Math.max(...results.map(r => r.data?.totalItems || 0))
        : 0;
    return { contractItems, isLoading, totalItems };
};
