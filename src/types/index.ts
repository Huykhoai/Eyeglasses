// User types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'staff';
    avatar?: string;
}

// Auth types
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

// Product types
export interface Product {
    id: string;
    name: string;
    code: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    images?: string[];
}

// Customer types
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

// Order types
export interface Order {
    id: string;
    customerId: string;
    products: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
