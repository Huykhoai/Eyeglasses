import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";

export const getFilterSupplier = (countries: any[] = []): FilterItem[] => [
    {
        key: 'cid',
        label: 'Mã nhà cung cấp',
        type: 'text',
    },
    {
        key: 'name',
        label: 'Tên nhà cung cấp',
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
    {
        key: 'countryId',
        label: 'Quốc gia',
        type: 'select',
        options: countries?.map(e => ({ id: e.id, label: e.name }))
    }
];