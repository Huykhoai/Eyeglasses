import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import { useSupplier } from "@/hooks/UseAllData";
import type { ConfigLimitResponse } from "@/types";

export const getFilters = (type: string): FilterItem[] => {
    const { data: suppliers } = useSupplier();
    switch (type) {
        case "purchase-quotations":
            return [
                {
                    key: 'cid',
                    label: 'Mã yêu cầu báo giá',
                    type: 'text',
                },
                {
                    key: 'supplier',
                    label: 'Nhà cung cấp',
                    type: 'select',
                    options: suppliers?.map((supplier: ConfigLimitResponse) => ({
                        label: supplier.name,
                        id: supplier.id,
                    })),
                },
                {
                    label: "Trạng thái",
                    key: "status",
                    type: "select",
                    options: [
                        { label: "Tất cả", id: "all" },
                        { label: "Chờ phê duyệt", id: "pending" },
                        { label: "Đã phê duyệt", id: "approved" },
                        { label: "Từ chối", id: "rejected" },
                    ],
                },
            ];
        default:
            return [];
    }
};