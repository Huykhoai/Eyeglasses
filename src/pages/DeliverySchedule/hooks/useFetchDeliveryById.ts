import { useQuery } from "@tanstack/react-query";
import type { DeliverySchedule, SimpleDeliveryItem } from "../config/types";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { NamedEntity } from "@/pages/Product/types/product";

export const useFetchDeliveryById = (id: number) => {
    const { showNotification } = useNotification();
    return useQuery<DeliverySchedule>({
        queryKey: ['delivery', 'detail', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/delivery/${id}`);
                const itemsRaw: SimpleDeliveryItem[] = response.data?.items || [];
                const contractsRaw: NamedEntity[] = response.data?.contracts || [];
                return {
                    ...response.data,
                    contracts: new Map<number, NamedEntity>(contractsRaw.map((item: NamedEntity) => [item.id, item])),
                    items: new Map<number, SimpleDeliveryItem>(itemsRaw.map((item: SimpleDeliveryItem) => [item.contractItemId, item])),
                    initialQtyMap: new Map<number, number>(itemsRaw.map((item: SimpleDeliveryItem) => [item.contractItemId, item.scheduledQty])),
                };
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy thông tin lịch giao hàng';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,

    })
}
