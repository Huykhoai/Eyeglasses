export interface InventoryReceiptResponse {
    id: number;
    cid: string;
    otkCid: string;
    otkId: number;
    employeeName: string;
    receiptDate: string;
    status: string;
    note?: string;
    createdAt?: string;
}

export interface ReceiptInfo {
    id: number;
    cid: string;
    otkCid: string;
    otkId: number;
    employeeName: string;
    receiptDate: string;
    status: string;
    note?: string;
}