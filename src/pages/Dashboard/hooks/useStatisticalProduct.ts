import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import type { MonthlyImportData } from "../config/types";

export const useStatisticalProduct = (date: Date) => {
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    return useQuery<MonthlyImportData[]>({
        queryKey: ['monthly-import-summary', date],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/inventory/dashboard/monthly-import`, {
                params: { date: formatDate(date) }
            });

            return res.data;
        },
        enabled: !!date,
        retry: false,
    });
}
