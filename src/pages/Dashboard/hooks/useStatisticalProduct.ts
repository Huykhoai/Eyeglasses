import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import type { MonthlyImportData } from "../config/types";

export const useStatisticalProduct = (preMonth: string, nextMonth: string) => {
   
    return useQuery<MonthlyImportData[]>({
        queryKey: ['monthly-import-summary', preMonth, nextMonth],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/inventory/dashboard/monthly-import`, {
                params: {preMonth, nextMonth }
            });

            return res.data;
        },
        enabled: !!preMonth && !!nextMonth,
        retry: false,
    });
}
