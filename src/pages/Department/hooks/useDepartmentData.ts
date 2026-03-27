import { useQuery } from "@tanstack/react-query"
import axiosClient from "@/api/axiosClient"
import { cleanParams } from "@/utils/cleanParams"
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { type PaginatedResponse } from "@/types";
import type { DepartmentType } from "../config/type";

const useDepartmentData = (page: number, size: number, filters: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<DepartmentType>>({
        queryKey: ['department', 'page', page, size, filters],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filters, size });
                const response = await axiosClient.get(`/api/department/page/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems } as PaginatedResponse<DepartmentType>;
            } catch (error: any) {
                const message = error?.response?.data?.message || error.message || "Đã có lỗi xảy ra";
                showNotification('error', message, 'Lỗi hệ thống');
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

export default useDepartmentData;