import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";

export const getFilterDeliveryItem: FilterItem[] = [
    {
        key: 'type',
        label: 'Mã hợp đồng',
        type: 'text'
    },
    {
        key: 'cid',
        label: 'Mã sản phẩm',
        type: 'text',
    },
    {
        key: 'name',
        label: 'Tên sản phẩm',
        type: 'text',
    },
    {
        key: 'quantity',
        label: 'Đã phân bổ',
        type: 'number',
    }
    
]