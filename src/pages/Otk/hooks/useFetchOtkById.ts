import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { OtkResponse } from "../config/otkTypes";

export const useFetchOtkById = (otkId: number | null, open: boolean) => {
    const { showNotification } = useNotification();
    return useQuery<OtkResponse>({
        queryKey: ['otk', 'detail', otkId],
        queryFn: async () => {
            try {
                const res = await axiosClient.get(`/api/otk/${otkId}`);
                const items = new Map(res.data.items.map((item: any) => [item.deliveryItemId, { ...item }]));
                const initialQty = new Map(res.data.items.map((item: any) => [item.deliveryItemId, item.otkQty]));
                return { ...res.data, items, initialQty };
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Lỗi khi tải chi tiết OTK';
                showNotification('error', errorMessage, 'Lỗi tải dữ liệu');
                throw error;
            }
        },
        enabled: !!otkId && open,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}