import type { EntityType } from "@/pages/Employee/config/type";

export interface PurchaseQuotationType {
    id: number;
    cid: string;
    name: string;
    note: string;
    requestDate: string;
    status: string;
    totalAmount: number;
    supplier: EntityType;
    currency: EntityType;
}
export interface SelectedProduct {
    id: number;
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
}
