import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import type { MonthlyImportData } from "../config/types";

export const useStatisticalProduct = () => {
    return useQuery<MonthlyImportData[]>({
        queryKey: ['monthly-import-summary'],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/inventory/dashboard/monthly-import`, {
                params: { months: 6 }
            });

            return res.data;
        },
        retry: false,
    });
}
