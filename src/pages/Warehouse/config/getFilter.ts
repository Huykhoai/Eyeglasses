import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigLimitResponse } from "@/types";

export const getFilters = (brands: ConfigLimitResponse[], groups: ConfigLimitResponse[]): FilterItem[] => [
    {
        label: 'Mã sản phẩm',
        key: 'cid',
        type: 'text'
    },
    {
        label: 'Tên sản phẩm',
        key: 'name',
        type: 'text'
    },
    {
        label: 'Thương hiệu',
        key: 'brand',
        type: 'select',
        options: brands.map((brand) => ({ id: brand.id, value: brand.id, label: brand.name }))
    },
    {
        label: 'Nhóm',
        key: 'group',
        type: 'select',
        options: groups.map((group) => ({ id: group.id, value: group.id, label: group.name }))
    },
    {
        label: 'Tồn kho',
        key: 'stock',
        type: 'number'
    },
    {
        label: 'Giá nhập',
        key: 'importPrice',
        type: 'number'
    },
    { label: 'Thời gian', key: 'time', type: 'date' },
];