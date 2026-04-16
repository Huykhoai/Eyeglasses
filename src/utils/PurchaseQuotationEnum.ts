const PurchaseQuotationStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export type PurchaseQuotationEnum = typeof PurchaseQuotationStatus[keyof typeof PurchaseQuotationStatus];

export default PurchaseQuotationStatus;