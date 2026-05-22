import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigLimitResponse } from "@/types";
import type { Contract } from "@/pages/Contract/config/types";

export const filterDialog = (contracts: Contract[], brands: ConfigLimitResponse[]): FilterItem[] => [
    {
        key: 'contract',
        label: 'Mã hợp đồng',
        type: 'select',
        options: contracts.map((contract) => ({
            label: contract.cid,
            id: contract.id!,
        }))
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
        key: 'brand',
        label: 'Thương hiệu',
        type: 'select',
        options: brands.map((brand) => ({
            label: brand.name,
            id: brand.id,
        }))
    },
    {
        key: 'quantity',
        label: 'Đã phân bổ',
        type: 'number',
    }
] 