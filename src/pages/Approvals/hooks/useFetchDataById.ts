import axiosClient from "@/api/axiosClient"
import { useNotification } from "@/components/ui/Notification/NotificationContext"
import { useQuery } from "@tanstack/react-query"

export const useFetchDataById = (id: number, url: string) => {
    const { showNotification } = useNotification()
    return useQuery({
        queryKey: ['approvals', 'detail', url, id],
        queryFn: async () => {
            try {
                const res = await axiosClient.get(`api/${url}/${id}`)
                return res.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || "Lỗi không xác định"
                showNotification('error', message, 'Lỗi lấy dữ liệu')
                throw error;
            }
        },
        enabled: !!id && !!url,
        retry: false
    })
}