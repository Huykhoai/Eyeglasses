const PurchaseQuotationStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
} as const;

export const PurchaseQuotationStatusLabel = {
    DRAFT: 'Bản nháp',
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Đã từ chối',
    CANCELLED: 'Đã hủy',
} as const;

export type PurchaseQuotationEnum = typeof PurchaseQuotationStatus[keyof typeof PurchaseQuotationStatus];

export default PurchaseQuotationStatus;