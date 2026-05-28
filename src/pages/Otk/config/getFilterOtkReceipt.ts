import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";

export const getFilterOtkReceipt = (): FilterItem[] => {
    return [
        {
            label: 'Mã sản phẩm',
            key: 'cid',
            type: 'text',
        },
        {
            label: 'Tên sản phẩm',
            key: 'name',
            type: 'text',
        },
        {
            label: 'Mã hợp đồng',
            key: 'contract',
            type: 'text',
        }
    ];
}