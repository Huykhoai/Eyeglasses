import type { NamedEntity } from "@/pages/Product/types/product";

export interface Supplier {
    id: number;
    cid: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    contact: string;
    fax: string;
    validFrom: string;
    validTo: string;
    advisingBank: string;
    branchCode: string;
    bankAddress: string;
    accountNo: string;
    swiftCode: string;
    taxCode: string;
    supplierId: number;
    country: NamedEntity;
}

export interface DialogSupplierProps {
    data?: Supplier | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface FormErrors {
    [key: string]: string;
}