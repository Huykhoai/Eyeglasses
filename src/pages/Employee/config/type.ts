import type { NamedEntity } from "@/pages/Product/types/product";

export interface EmployeeType {
    id: number | null;
    cid: string;
    email: string;
    name: string;
    statusEm: NamedEntity | null;
    department: NamedEntity | null;
    numberOfDependents: number;
    employeeInformation?: EmployeeInformationType;
}

export interface EmployeeInformationType {
    email: string;
    imageUrl: string;
    phone: string;
    address: string;
    gender: boolean;
    dateOfBirth: string;
    citizenIdentificationNumber: string;
    accountNo: string;
    bankName: string;
}

export interface EmployeeLogResponse {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    employee: NamedEntity;
    employeeModify: NamedEntity;
    statusEm: NamedEntity;
}