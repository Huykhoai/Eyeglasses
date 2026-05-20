import type { NamedEntity } from "@/pages/Product/types/product";

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
    contract: NamedEntity;
    scheduledQty: number;
    receivedQty: number;
    acceptedQty: number;
    deniedQty: number;
    extraQty: number;
    lostQty: number;
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
