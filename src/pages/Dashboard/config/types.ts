export interface PendingQuotation {
    id: number;
    cid: string;
    name: string;
    requestDate: string;
    totalAmount: number;
}

export interface PendingContract {
    id: number;
    cid: string;
    name: string;
    signDate: string;
    totalAmount: number;
}

export interface PendingOtk {
    id: number;
    cid: string;
    inspectionDate: string;
    totalScheduledQty: number;
    employeeName: string;
}

export interface TopProduct {
    name: string;
    quantity: number;
}

export interface MonthlyImportData {
    month: string;
    totalImported: number;
    topProducts: TopProduct[];
}