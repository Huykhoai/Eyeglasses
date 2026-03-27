import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { EmployeeType } from "../../config/type";

export const useFetchEmployee = (id: number) => {
    const { showNotification } = useNotification();
    return useQuery<EmployeeType>({
        queryKey: ['employee', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/employee/${id}`);
                return response.data;
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra';
                showNotification('error', errorMessage, 'Thất bại');
                throw error;
            }
        },
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}