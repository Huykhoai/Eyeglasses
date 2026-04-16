import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";


export const filterDialogProduct: FilterItem[] = [
    {
        key: 'category',
        label: 'Danh mục',
        type: 'select',
        options: [
            { label: 'Tất cả', id: 0 },
            { label: 'Danh mục 1', id: 1 },
            { label: 'Danh mục 2', id: 2 },
        ]
    }
]