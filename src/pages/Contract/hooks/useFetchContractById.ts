import { useQuery } from "@tanstack/react-query";
import type { Quotation, SimpleContractItem } from "../config/types";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export const useFetchContractById = (id: number) => {
    const { showNotification } = useNotification();
    return useQuery({
        queryKey: ['contract', 'detail', id],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/contract/${id}`);
                const itemsRaw: SimpleContractItem[] = response.data?.items || [];
                return {
                    ...response.data,
                    items: itemsRaw.reduce((acc: any, item: SimpleContractItem) => {
                        acc[item.quotationItemId] = item;
                        return acc;
                    }, {} as Record<number, SimpleContractItem>),
                    initialQtyMap: itemsRaw.reduce((acc: any, item: SimpleContractItem) => {
                        acc[item.quotationItemId] = item.contractQty;
                        return acc;
                    }, {} as Record<number, number>),
                    quotations: response.data?.quotations?.reduce((acc: any, item: Quotation) => {
                        acc[item.id] = item;
                        return acc;
                    }, {} as Record<number, Quotation>) || {},
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