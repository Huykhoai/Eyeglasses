import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { cleanParams } from "@/utils/cleanParams";
import type { PaginatedResponse } from "@/types";
import type { DeliveryItemDetail } from "../../Otk/config/otkTypes";

export const useFetchDeliveryItem = (deliveryScheduleId: number | null, page: number, size: number, filter: Record<string, string>, open: boolean) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<DeliveryItemDetail>>({
        queryKey: ['delivery-items-for-otk', deliveryScheduleId, page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ size, ...filter })
                const res = await axiosClient.get(
                    `/api/delivery/items-detail/${deliveryScheduleId}/${page}`,
                    { params: params }
                );
                return { items: res.data.data, totalItems: res.data.totalItems };
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Lỗi khi tải danh sách sản phẩm';
                showNotification('error', errorMessage, 'Lỗi tải dữ liệu');
                throw error;
            }
        },
        enabled: !!deliveryScheduleId && !!open,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}