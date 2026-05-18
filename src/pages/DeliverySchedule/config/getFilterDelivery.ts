import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import type { ConfigLimitResponse } from "@/types";

export const getFilterDelivery = (suppliers: ConfigLimitResponse[]): FilterItem[] => {
    return [
        {
            label: 'Mã hợp đồng',
            key: 'contract_id',
            type: 'text',
        },
        {
            label: 'Nhà cung cấp',
            key: 'supplier',
            type: 'select',
            options: suppliers.map((supplier) => ({
                label: supplier.name,
                id: supplier.id,
            }))
        },
        {
            label: 'Ngày báo giá',
            key: 'purchase_quotation_date',
            type: 'date',
        },
        {
            label: 'Ngày dự kiến giao hàng',
            key: 'expected_delivery_date',
            type: 'date',
        },
        {
            label: 'Trạng thái',
            key: 'status',
            type: 'select',
            options: [
                { label: 'Đang xử lý', id: 'pending' },
                { label: 'Đã duyệt', id: 'approved' },
                { label: 'Đã từ chối', id: 'rejected' },
            ]
        }
    ]
}