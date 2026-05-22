import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";

export const getFilterOtk = (): FilterItem[] => {
    return [
        {
            key: 'cid',
            label: 'Mã OTK',
            type: 'text',
        },
        {
            key: 'deliverySchedule',
            label: 'Mã lịch giao hàng',
            type: 'text',
        },
    ];
}