import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigLimitResponse } from "@/types";

export const getFilters = (employees: ConfigLimitResponse[] = []): FilterItem[] => [
    { label: 'Mã phiếu', key: 'cid', type: 'text' },
    { label: 'Mã OTK', key: 'otkCid', type: 'text' },
    {
        label: 'Trạng thái', key: 'status', type: 'select', options: [
            { label: 'Bản nháp', id: 'DRAFT' },
            { label: 'Đã nhập kho', id: 'IMPORTED' },
        ]
    },
    {
        label: 'Từ ngày',
        key: 'startDate',
        type: 'date',
    },
    {
        label: 'Đến ngày',
        key: 'endDate',
        type: 'date',
    },
    {
        label: 'Nhân viên',
        key: 'employeeId',
        type: 'select',
        options: employees?.map((employee) => ({
            label: employee.name,
            id: employee.id
        })) || []
    }
];