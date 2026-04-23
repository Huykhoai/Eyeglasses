import type { NamedEntity } from "@/pages/Product/types/product";

export interface DepartmentType {
    id: number | null;
    cid: string;
    name: string;
    location: string;
    managers?: NamedEntity[] | null;
}

export interface DialogDepartmentProps {
    data?: DepartmentType | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface FormErrors {
    [key: string]: string;
}