import type { EntityType } from "@/pages/Employee/config/type";
import type { PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";

export interface PurchaseQuotationType {
    id: number;
    cid: string;
    name: string;
    note: string;
    status: PurchaseQuotationEnum;
    totalAmount: number;
    supplier: EntityType;
    currency: EntityType;
    currencyValue: number;
    requestedBy: EntityType;
    approvedBy: EntityType;
    requestDate: string;
    expectedDate: string;
    modifiedAt: string;
    approvedDate: string;
}
export interface SelectedProduct {
    id: number;
    quotationId: number;
    productId: number;
    cid: string;
    name: string;
    unit: string;
    tax: number;
    originalPrice: number;
    lastPurchasePrice: number;
    requestQty: number;
    expectedPrice: number;
    quotedQty: number;
    quotedPrice: number;
    lineTotal?: number;
}
