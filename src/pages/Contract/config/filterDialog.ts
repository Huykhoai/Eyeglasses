import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigLimitResponse } from "@/types";
import type { Quotation } from "./types";

export const filterDialog = (quotations: Quotation[], brands: ConfigLimitResponse[]): FilterItem[] => [
    {
        key: 'quotation',
        label: 'Mã báo giá',
        type: 'select',
        options: quotations.map((quotation) => ({
            label: quotation.cid,
            id: quotation.id,
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