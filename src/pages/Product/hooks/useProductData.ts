import axiosClient from '@/api/axiosClient';
import { cleanParams } from '@/utils/cleanParams';
import type { Product, ProductType } from '../types/product';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import type { PaginatedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';


export const useProductData = (productType: ProductType, page: number, size: number, filters: Record<string, any>) => {
    const { showNotification } = useNotification();

    return useQuery<PaginatedResponse<Product>>({
        queryKey: ['product', "type", 'page', page, productType, size, filters],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filters, type: productType, size });
                const response = await axiosClient.get(`/api/product/page/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems } as PaginatedResponse<Product>;
            } catch (error: any) {
                const message = error?.response?.data?.message || error.message || "Đã có lỗi xảy ra";
                showNotification('error', message, 'Lỗi hệ thống');
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};
