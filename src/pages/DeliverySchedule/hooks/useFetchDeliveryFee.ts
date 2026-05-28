import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import type { DeliveryFee } from "../config/types";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchDeliveryFee = (dsId: number) => {
    const { showNotification } = useNotification();
    return useQuery<DeliveryFee>({
        queryKey: ['delivery', 'cost', dsId],
        queryFn: async () => {
            try {
                const res = await axiosClient.get(`/api/delivery/fee/${dsId}`);
                return res.data;
            } catch (err: any) {
                const message = err?.response?.data?.message || 'Lỗi khi lấy thông tin chi phí';
                showNotification('error', message, 'Thất bại');
                throw err;
            }
        },
        enabled: !!dsId,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
}