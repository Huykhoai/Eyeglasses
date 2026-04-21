import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchPurchaseQuotationById = (id: number) => {
    const { showNotification } = useNotification();
    return useQuery({
        queryKey: ['purchase-quotation', 'detail', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/purchase-quotation/${id}`);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy thông tin báo giá';
                showNotification('error', message, 'Thất bại');
                return error;
            }
        },
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};