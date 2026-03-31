import type { NamedEntity } from "@/pages/Product/types/product";
import { Roles } from "@/utils/roles";

export interface EmployeeType {
    id: number | null;
    cid: string;
    email: string;
    name: string;
    hasAccount: boolean;
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

export const roleLabels: Record<string, string> = {
    [Roles.ADMIN]: 'Quản trị viên',
    [Roles.MANAGER]: 'Quản lý',
    [Roles.XNK]: 'Xuất nhập khẩu',
    [Roles.OTK]: 'Kiểm soát chất lượng (OTK)',
    [Roles.KE_TOAN]: 'Kế toán'
};