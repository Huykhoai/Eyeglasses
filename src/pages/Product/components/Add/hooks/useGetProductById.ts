import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Product } from "../../../types/product";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

const useGetProductById = (id: number): UseQueryResult<Partial<Product>> => {
    const { showNotification } = useNotification();

    return useQuery<Partial<Product>>({
        queryKey: ['product', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/product/${id}`);
                return response.data as Partial<Product>;
            } catch (error: any) {
                const message = error?.response?.data?.message || error.message || "Đã có lỗi xảy ra";
                showNotification('error', 'Lỗi', message);
                throw error;
            }
        },
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
};
export default useGetProductById;