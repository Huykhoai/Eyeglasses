// User types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'staff';
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    createdAt: Date;
    totalOrders?: number;
    totalSpent?: number;
}

export interface ApiResponse<T> {
    status: number
    message: string;
    data?: T;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    items?: T[];
    totalItems?: number;
}
export interface ObjectType {
    id: number;
    name: string;
}
export interface ConfigLimitResponse {
    id: number;
    cid: string;
    name: string;
    typeInfo: ObjectType | null;
}

export interface ConfigItem {
    id: number;
    cid: string;
    name: string;
    description: string;
    type?: string;
    value?: string;
}
export interface ColumnDef {
    key: string;
    header: string;
    width?: string;
    render?: (item: any) => React.ReactNode;
}