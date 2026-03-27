import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { type EmployeeType } from "@/pages/Employee/config/type";
import type { PaginatedResponse } from "@/types";
import { cleanParams } from "@/utils/cleanParams";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useEmployeeData = (page: number, size: number, filter: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<EmployeeType>>({
        queryKey: ['employee', page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const response = await axiosClient.get(`api/employee/page/${page}`, { params });

                return { items: response.data.data, totalItems: response.data.totalItems };
            } catch (error: any) {
                const message = error.response?.data?.message || error.message;
                showNotification('error', message, "Lỗi lấy dữ liệu");
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};