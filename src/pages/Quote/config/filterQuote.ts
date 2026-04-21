import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigItem, ConfigLimitResponse } from "@/types";
import PurchaseQuotationStatus, { PurchaseQuotationStatusLabel } from "@/utils/PurchaseQuotationEnum";

export const getFilterQuote = (suppliers: ConfigLimitResponse[], currencies: ConfigItem[]): FilterItem[] => [
    {
        key: 'cid',
        label: 'Mã báo giá',
        type: 'text',
    },
    {
        key: 'name',
        label: 'Tên báo giá',
        type: 'text',
    },
    {
        key: 'supplier',
        label: 'Nhà cung cấp',
        type: 'select',
        options: suppliers?.map((supplier) => ({
            id: supplier.id,
            label: supplier.name,
        }))
    },
    {
        key: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: Object.entries(PurchaseQuotationStatus).map(([_, value]) => ({
            id: value,
            label: PurchaseQuotationStatusLabel[value],
        }))
    },
    {
        key: 'startDate',
        label: 'Từ ngày',
        type: 'date',
    },
    {
        key: 'endDate',
        label: 'Đến ngày',
        type: 'date',
    },
    {
        key: 'currency',
        label: 'Loại tiền',
        type: 'select',
        options: currencies?.map((currency) => ({
            id: currency.id,
            label: currency.name,
        }))
    }

]