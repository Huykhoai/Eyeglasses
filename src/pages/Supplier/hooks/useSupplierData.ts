import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { cleanParams } from "@/utils/cleanParams";
import type { NamedEntity } from "@/pages/Product/types/product";
import type { PaginatedResponse } from "@/types";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

export interface Supplier {
    id: number;
    cid: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    contact: string;
    fax: string;
    validFrom: string;
    validTo: string;
    advisingBank: string;
    branchCode: string;
    bankAddress: string;
    accountNo: string;
    swiftCode: string;
    taxCode: string;
    supplierId: number;
    countryDto: NamedEntity;
}

export const useSupplierData = (page: number, size: number, filters: Record<string, any>) => {
    const { showNotification } = useNotification();

    const query = useQuery<PaginatedResponse<Supplier>>({
        queryKey: ['supplier', 'page', page, size, filters],
        queryFn: async () => {
            const params = cleanParams({ ...filters, size });
            const response = await axiosClient.get(`/api/supplier/page/${page}`, { params });

            return { items: response.data.data, totalItems: response.data.totalItems } as PaginatedResponse<Supplier>;
        },
        retry: false,
    });

    useEffect(() => {
        if (query.error) {
            const message = (query.error as any)?.response?.data?.message || query.error.message || "Đã có lỗi xảy ra";
            showNotification('error', message, 'Lỗi hệ thống');
        }
    }, [query.error, showNotification]);

    return query;
};

export const useSupplierHistory = (supplierId: number | null) => {
    return useQuery<Supplier[]>({
        queryKey: ['supplier-history', supplierId],
        queryFn: async () => {
            if (!supplierId) return [];
            const response = await axiosClient.get(`/api/supplier/histories/${supplierId}`);
            return response.data;
        },
        enabled: !!supplierId,
    });
};
