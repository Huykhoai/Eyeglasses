import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";

export const getFilterQuote = (): FilterItem[] => [
    {
        key: 'code',
        label: 'Mã báo giá',
        type: 'text',
    },
    {
        key: 'name',
        label: 'Tên báo giá',
        type: 'text',
    },
    {
        key: 'phone',
        label: 'Số điện thoại',
        type: 'text',
    },
    {
        key: 'email',
        label: 'Email',
        type: 'text',
    },
    {
        key: 'address',
        label: 'Địa chỉ',
        type: 'text',
    },
]