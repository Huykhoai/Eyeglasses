import type { NamedEntity } from "@/pages/Product/types/product";
import type { DeliveryEnumType } from "@/utils/DeliveryEnum";

export interface OtkResponse {
    id: number;
    cid: string;
    deliverySchedule: NamedEntity;
    employee: NamedEntity;
    inspectionDate: string;
    status: string;
    note?: string;
    totalScheduledQty: number;
    totalAcceptedQty: number;
    totalDeniedQty: number;
    totalExtraQty: number;
    totalLostQty: number;
    createdAt?: string;
    modifiedAt?: string;
    items?: Map<number, any>;
    initialQty?: Map<number, number>;
}

export interface OtkItemResponse {
    id: number;
    deliveryItemId: number;
    cid: string;
    name: string;
    contractId: number;
    contractCid: string;
    status: DeliveryEnumType;
    scheduledQty: number;
    otkQty: number;
    receivedQty: number;
    acceptedQty: number;
    deniedQty: number;
    extraQty: number;
    lostQty: number;
    unitPrice: number;
    lineTotalVnd: number;
    note?: string;
}

export interface DeliveryItemDetail {
    id: number;
    cid: string;
    name: string;
    contract: NamedEntity;
    receivedQty: number;
    allowedQty: number;
    scheduleQty: number;
}
