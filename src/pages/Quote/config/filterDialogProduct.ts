import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";


export const filterDialogProduct: FilterItem[] = [
    {
        key: 'cid',
        label: 'Mã sản phẩm',
        type: 'text',
    },
    {
        key: 'name',
        label: 'Tên sản phẩm',
        type: 'text',
    }
]