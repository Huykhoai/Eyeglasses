import type { ConfigLimitResponse } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useNotification } from "@/components/ui/Notification/NotificationContext"
import axiosClient from "@/api/axiosClient"

const useFetchPosition = (open: boolean) => {
    const { showNotification } = useNotification();

    return useQuery<ConfigLimitResponse[]>({
        queryKey: ['position'],
        queryFn: async () => {
            try {
                const response = await axiosClient.get('/api/position/all');
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Không thể lấy danh sách chức vụ';
                showNotification('error', message, 'Lỗi');
                throw error;
            }
        },
        enabled: !!open,
    })
}

export default useFetchPosition;