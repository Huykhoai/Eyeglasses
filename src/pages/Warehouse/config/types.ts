import type { NamedEntity } from "@/pages/Product/types/product";

export interface ProductStockResponse {
    id: number;
    imageUrl: string;
    product: NamedEntity;
    brand: NamedEntity;
    group: NamedEntity;
    quantity: number;
    costPrice: number;
    lastUpdate: string;
}