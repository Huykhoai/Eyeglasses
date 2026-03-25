import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";

export const getFilterDepartment = (): FilterItem[] => [
    {
        key: 'cid',
        label: 'Mã phòng ban',
        type: 'text',
    },
    {
        key: 'name',
        label: 'Tên phòng ban',
        type: 'text',
    },
    {
        key: 'location',
        label: 'Địa điểm',
        type: 'text',
    },
];