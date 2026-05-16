import { useQuery } from "@tanstack/react-query"
import axiosClient from "@/api/axiosClient"
import { useNotification } from "@/components/ui/Notification/NotificationContext"
import type { ConfigLimitResponse } from "@/types"
interface PositionRole {
    positions: ConfigLimitResponse[],
    roles: ConfigLimitResponse[]
}
const useFetchAccountRoleById = (id: number | null, open: boolean) => {
    const { showNotification } = useNotification();
    return useQuery<PositionRole>({
        queryKey: ['employee', 'account-role', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/employee/roles`, {
                    params: { employeeId: id }
                });
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin tài khoản';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!open || !!id,
        retry: false
    })
}

export default useFetchAccountRoleById