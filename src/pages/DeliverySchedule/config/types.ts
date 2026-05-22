import type { NamedEntity } from "@/pages/Product/types/product";
import type { DeliveryEnumType } from "@/utils/DeliveryEnum";

export interface DeliverySchedule {
    id?: number;
    cid: string;
    name: string;
    createdAt?: string;
    modifiedAt?: string;
    note?: string;
    status: DeliveryEnumType;
    billOfLadingNumber: string;
    declarationNumber: string;
    feeEnvironment: number;
    feeInsurance: number;
    feeDelivery: number;
    feeDeliverySea: number;
    feeOther: number;
    taxImport: number;
    isImportTaxPercentage: boolean;
    taxVat: number;
    isVatPercentage: boolean;
    taxOther: number;
    isOtherTaxPercentage: boolean;
    declarationDate: string;
    deliveryDate: string;
    totalAmountForeign: number;
    totalAmountVnd: number;
    supplier: NamedEntity | null;
    requestBy?: NamedEntity | null;
    items: Map<number, SimpleDeliveryItem>;
    initialQtyMap?: Map<number, number>;
    contracts: Map<number, NamedEntity>;
}

export interface SimpleDeliveryItem {
    id?: number;
    contractItemId: number;
    contractId: number;
    allowedQty: number;
    scheduledQty: number;
}

export interface DeliveryItem {
    id?: number;
    contractId: number;
    contractItemId: number;
    cid: string;
    name: string;
    unitPrice: number;
    scheduledQty: number;
    lineTotal: number;
}

