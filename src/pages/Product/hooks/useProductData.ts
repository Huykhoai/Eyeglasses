import { useState, useCallback } from 'react';
import axiosClient from '@/api/axiosClient';
import { cleanParams } from '@/utils/cleanParams';
import type { ProductType, Product } from '../types/product';

interface UseProductDataReturn {
    products: Product[];
    totalItems: number;
    isLoading: boolean;
    fetchProducts: (
        type: ProductType,
        page: number,
        size: number,
        filters?: Record<string, any>
    ) => Promise<void>;
}

export const useProductData = (): UseProductDataReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = useCallback(async (
        type: ProductType,
        page: number,
        size: number,
        filters: Record<string, any> = {}
    ) => {
        try {
            setIsLoading(true);
            const params = cleanParams({ ...filters, size, type: type.toLowerCase() });
            const res = await axiosClient.get(`/api/product/page/${page}`, { params });

            const data = (res as any).data || [];
            const total = (res as any).totalItems || 0;

            setProducts(data);
            setTotalItems(total);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { products, totalItems, isLoading, fetchProducts };
};
