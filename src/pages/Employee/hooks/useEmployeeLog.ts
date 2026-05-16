import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import type { EmployeeLogResponse } from "../config/type";
import type { PaginatedResponse } from "@/types";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { cleanParams } from "@/utils/cleanParams";

export const useEmployeeLog = (employeeId: number | null, page: number, size: number, filters: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<EmployeeLogResponse>>({
        queryKey: ['employee', 'log', employeeId, page, size, filters],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filters, employeeId, page, size });
                const response = await axiosClient.get(`/api/employee/log`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems };
            } catch (error: any) {
                const message = error.response.data.message || 'Lỗi khi tải lịch sử thay đổi';
                showNotification('error', message, 'Lỗi tải lịch sử thay đổi');
                throw error;
            }
        },
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
    });
};
