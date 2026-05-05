import { useQuery } from "@tanstack/react-query"
import type { ApprovalType } from "../config/types"
import axiosClient from "@/api/axiosClient"
import { cleanParams } from "@/utils/cleanParams"
import type { PaginatedResponse } from "@/types"
import { useNotification } from "@/components/ui/Notification/NotificationContext"

export const useFetchData = (page: number, size: number, type: string, filter: Record<string, string>) => {
    const { showNotification } = useNotification()
    return useQuery<PaginatedResponse<ApprovalType>>({
        queryKey: ["approvals", "list", page, size, type, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ size, ...filter })
                const response = await axiosClient.get(`/api/approvals/${type}/${page}`, { params })
                return { items: response.data?.data || [], totalItems: response.data?.totalItems || 0 };
            } catch (error: any) {
                const message = error?.response?.data?.message || "Lỗi không xác định"
                showNotification('error', message, 'Lỗi lấy dữ liệu')
                throw error;
            }
        },
        enabled: !!type,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}