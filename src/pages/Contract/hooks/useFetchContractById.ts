import { useQuery } from "@tanstack/react-query";
import type { Contract, Quotation, SimpleContractItem } from "../config/types";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchContractById = (id: number) => {
    const { showNotification } = useNotification();
    return useQuery<Contract>({
        queryKey: ['contracts', 'detail', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/contract/${id}`);
                const itemsRaw: SimpleContractItem[] = response.data?.items || [];
                return {
                    ...response.data,
                    items: new Map<number, SimpleContractItem>(itemsRaw.map((item: SimpleContractItem) => [item.quotationItemId, item])),
                    initialQtyMap: new Map<number, number>(itemsRaw.map((item: SimpleContractItem) => [item.quotationItemId, item.contractQty])),
                    quotations: new Map<number, Quotation>(response.data?.quotations?.map((item: Quotation) => [item.id, item])),
                };
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy thông tin hợp đồng';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,

    })
}