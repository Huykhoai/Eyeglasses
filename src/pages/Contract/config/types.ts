import type { NamedEntity } from "@/pages/Product/types/product";
import type { PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";

export interface Quotation {
    id: number;
    cid: string;
    name: string;
    createdAt: string;
}

export interface QuotationItem {
    id: number;
    cid: string;
    name: string;
    brand: string;
    quoQty: number;
    allocatedQty: number;
    quoPrice: number;
    quotationId: number;
    contractQty: number;
    allowedQty: number;
}
export interface Contract {
    id?: number;
    cid: string;
    name: string;
    createdAt?: string;
    modifiedAt?: string;
    note: string;
    status: PurchaseQuotationEnum;
    contractCurrencyValue: number;
    signDate: string;
    expectedDeliveryDate: string;
    totalAmountForeign: number;
    totalAmountVnd: number;
    supplier: NamedEntity | null;
    currency: NamedEntity | null;
    requestedBy: NamedEntity | null;
    approvedBy: NamedEntity | null;
    approvedDate: string | null;
    quotations: Map<number, Quotation>;
    items: Map<number, SimpleContractItem>;
    initialQtyMap?: Map<number, number>;
}
export interface SimpleContractItem {
    id?: number;
    quotationItemId: number;
    quotationId: number;
    allowedQty: number;
    contractQty: number;
}

export interface ContractItem {
    id: number;
    quotationItemId: number;
    quotationId: number;
    cid: string;
    name: string;
    quoPrice: number;
    contractQty: number;
    lineTotal: number;
    allocatedQty?: number;
    allowedQty?: number;
    contractId?: number;
}

export interface AttachmentDto {
    id?: number;
    name: string;
    description?: string;
    url?: string;
    contractId: number;
    createdAt?: string;
}

export interface TableContractLogResponse {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    employee: NamedEntity;
}