import axiosClient from "@/api/axiosClient"
import { cleanParams } from "@/utils/cleanParams"
import { useQuery } from "@tanstack/react-query"
import type { Contract } from "@/pages/Contract/config/types"
import type { PaginatedResponse } from "@/types"

export const useFetchContractBySupplier = (
    supplierId: number | null | undefined, page: number, size: number,
    search: string
) => {
    return useQuery<PaginatedResponse<Contract>>({
        queryKey: ['contracts-by-supplier', supplierId, page, size, search],
        queryFn: async () => {
            const params = cleanParams({ size, search })
            const res = await axiosClient.get(`/api/contract/by-supplier/${supplierId}/${page}`, { params })
            return { items: res.data.data, totalItems: res.data.totalItems }
        },
        enabled: !!supplierId,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}
