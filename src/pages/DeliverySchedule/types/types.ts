import type { NamedEntity } from "@/pages/Product/types/product";

export interface DeliverySchedule {
    id: number;
    cid: string;
    name: string;
    createdAt: string;
    modifiedAt: string;
    billOfLadingNumber: string;
    declarationNumber: string;
    feeEnvironment: number;
    feeInsurance: number;
    note: string;
    declarationDate: string;
    deliveryDate: string;
    status: string;
    supplier: NamedEntity;
    items: SimpleDeliveryItem[];
}

export interface SimpleDeliveryItem {
    id: number;
    contractItemId: number;
    contractId: number;
    allowedQty: number;
    scheduledQty: number;
}
