import axiosClient from "@/api/axiosClient"
import { cleanParams } from "@/utils/cleanParams"
import { useQuery } from "@tanstack/react-query"
import type { Quotation } from "../config/types"
import type { PaginatedResponse } from "@/types"

export const useFetchQuotationBySupplier = (
    supplierId: number, page: number, size: number,
    type: boolean, search: string
) => {
    return useQuery<PaginatedResponse<Quotation>>({
        queryKey: ['quotations-by-supplier', supplierId, page, size, search, type],
        queryFn: async () => {
            const params = cleanParams({ size, search, imported: type })
            const res = await axiosClient.get(`/api/purchase-quotation/by-supplier/${supplierId}/${page}`, { params })
            return { items: res.data.data, totalItems: res.data.totalItems }
        },
        enabled: !!supplierId,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}