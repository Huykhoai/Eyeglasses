import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigLimitResponse } from "@/types";
const statusEm = [
    {
        id: 1,
        label: 'Hoạt động',
    },
    {
        id: 2,
        label: 'Nghỉ phép',
    },
    {
        id: 3,
        label: 'Nghỉ ốm',
    },
    {
        id: 4,
        label: 'Ngừng làm việc',
    },
];

export const getFilterEmployee = (departments: ConfigLimitResponse[]): FilterItem[] => {

    return [
        {
            key: 'cid',
            label: 'Mã NV',
            type: 'text',
        },
        {
            key: 'name',
            label: 'Họ và tên',
            type: 'text',
        },
        {
            key: 'email',
            label: 'Email',
            type: 'text',
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            type: 'text',
        },
        {
            key: 'gender',
            label: 'Giới tính',
            type: 'select',
            options: [{ id: 0, label: 'Nam' }, { id: 1, label: 'Nữ' }],
        },
        {
            key: 'address',
            label: 'Địa chỉ',
            type: 'text',
        },
        {
            key: 'departmentId',
            label: 'Phòng ban',
            type: 'select',
            options: departments.map((department) => ({
                id: department.id,
                label: department.name,
            })),
        },
        {
            key: 'statusEmId',
            label: 'Trạng thái',
            type: 'select',
            options: statusEm,
        }
    ];
};