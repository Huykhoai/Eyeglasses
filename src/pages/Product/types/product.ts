export type ProductType = 'LENS' | 'FRAME' | 'ACCESSORY';

export interface NamedEntity {
    id: number;
    cid: string;
    name: string;
}

export interface ProductBase {
    id: number;
    cid: string;
    name: string;
    originalPrice: number;
    retailPrice: number;
    costPrice: number;
    imageUrl: string;
    unit: string;
    note: string;
    uses: string;
    guide: string;
    warning: string;
    preserve: string;
    statusProduct: NamedEntity;
    brand: NamedEntity;
    group: NamedEntity;
    supplier: NamedEntity;
    country: NamedEntity;
    warranty: NamedEntity | null;
    warrantySupplier: NamedEntity | null;
    warrantyRetail: NamedEntity | null;
    tax: NamedEntity;
    currency: NamedEntity | null;
}

export interface LensAttributeDto {
    design1: NamedEntity | null;
    design2: NamedEntity | null;
    uv: NamedEntity | null;
    refractiveIndex: NamedEntity | null;
    coating: NamedEntity | null
    material: NamedEntity | null;
    sph: number | null;
    cyl: number | null;
    lenAdd: number | null;
    diameter: number | null;
    hmcColor: NamedEntity | null;
    phoColor: NamedEntity | null;
    tintColor: NamedEntity | null;
}

export interface FrameAttributeDto {
    season: string | null;
    model: string | null;
    serial: string | null;
    gender: number | null;
    frame: NamedEntity | null;
    frameType: NamedEntity | null;
    shape: NamedEntity | null;
    ve: NamedEntity | null;
    temple: NamedEntity | null;
    materialFront: NamedEntity | null;
    materialTemple: NamedEntity | null;
    materialVe: NamedEntity | null;
    materialTempleTip: NamedEntity | null;
    materialLens: NamedEntity | null;
    colorLens: NamedEntity | null;
    coating: NamedEntity | null;
    templeLength: number | null;
    lensHeight: number | null;
    lensWidth: number | null;
    bridgeWidth: number | null;
    colorCode: string | null;
    colorFront: NamedEntity | null;
    colorTemple: NamedEntity | null;
}

export interface LensProduct extends ProductBase {
    lensAttribute: LensAttributeDto;
}

export interface FrameProduct extends ProductBase {
    frameAttribute: FrameAttributeDto;
}

export type AccessoryProduct = ProductBase;

export type Product = LensProduct | FrameProduct | AccessoryProduct;

export interface ProductPageResponse {
    data: Product[];
    totalItems: number;
}

export const GROUP_TYPE: Record<number, ProductType> = {
    1: 'LENS',
    2: 'FRAME',
    3: 'ACCESSORY'
}
