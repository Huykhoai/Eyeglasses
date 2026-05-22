import { useQuery } from "@tanstack/react-query";
import { cleanParams } from "@/utils/cleanParams";
import type { PaginatedResponse } from "@/types";
import type { OtkResponse } from "@/pages/Otk/config/otkTypes";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchOtk = (page: number, size: number, filter: Record<string, any>) => {
    const { showNotification } = useNotification();
    return useQuery<PaginatedResponse<OtkResponse>>({
        queryKey: ['otk', 'list', page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const res = await axiosClient.get(`/api/otk/page/${page}`, { params });
                return { items: res.data.data, totalItems: res.data.totalItems };
            } catch (error: any) {
                const msg = error?.response?.data?.message || 'Lỗi khi lấy danh sách OTK';
                showNotification('error', msg, 'Thất bại');
                throw error;
            }
        }
    });
}