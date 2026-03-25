import type { NamedEntity } from "@/pages/Product/types/product";

export interface Department {
    id?: number;
    cid: string;
    name: string;
    location: string;
    parent?: NamedEntity | null;
    manager?: NamedEntity | null;
}

export interface DialogDepartmentProps {
    data?: Department | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface FormErrors {
    [key: string]: string;
}