import type { ConfigItem, ConfigLimitResponse } from "@/types";

export type StepStatus = 'active' | 'completed' | 'pending';

export interface ImageMapping {
    name: string;
    file: File | null;
    previewUrl: string | null;
}

export interface RowValidationResult {
    rowIndex: number;
    dto?: ProductDto;
    errors: string[];
    isValid: boolean;
}

export interface ExcelReadResult {
    rows: RowValidationResult[];
    uniqueImageNames: string[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
}

export interface CategoryMaps {
    group: Record<string, ConfigLimitResponse>;
    brand: Record<string, ConfigLimitResponse>;
    supplier: Record<string, ConfigLimitResponse>;
    country: Record<string, ConfigLimitResponse>;
    currency: Record<string, ConfigItem>;
    material: Record<string, ConfigLimitResponse>;
    refractiveIndex: Record<string, ConfigLimitResponse>;
    design: Record<string, ConfigLimitResponse>;
    uv: Record<string, ConfigLimitResponse>;
    color: Record<string, ConfigLimitResponse>;
    coating: Record<string, ConfigLimitResponse>;
    warranty: Record<string, ConfigLimitResponse>;
}

export interface CategoryMapsFrame {
    group: Record<string, ConfigLimitResponse>;
    brand: Record<string, ConfigLimitResponse>;
    supplier: Record<string, ConfigLimitResponse>;
    country: Record<string, ConfigLimitResponse>;
    currency: Record<string, ConfigItem>;
    warranty: Record<string, ConfigLimitResponse>;
    frame: Record<string, ConfigLimitResponse>;
    frameType: Record<string, ConfigLimitResponse>;
    shape: Record<string, ConfigLimitResponse>;
    ve: Record<string, ConfigLimitResponse>;
    temple: Record<string, ConfigLimitResponse>;
    material: Record<string, ConfigLimitResponse>;
    coating: Record<string, ConfigLimitResponse>;
    color: Record<string, ConfigLimitResponse>;
    gender: Record<string, { id: number, name: string, cid: string }>;
}

export interface FrameRowData {
    rowIndex: number;
    Group: string;
    Image: string;
    FullName: string;
    Unit: string;
    Brand: string;
    Supplier: string;
    Country: string;
    Season: string;
    Model: string;
    Serial: string;
    Gender: string;
    Temple_Length: string;
    Bridge_Width: string;
    Lens_Width: string;
    Lens_Height: string;
    Color_Code: string;
    Frame: string;
    Frame_Type: string;
    Shape: string;
    Ve: string;
    Color_Lens: string;
    Coating: string;
    Temple: string;
    Material_Front: string;
    Material_Temple: string;
    Material_Ve: string;
    Material_Temple_Tip: string;
    Material_Lens: string;
    Color_Front: string;
    Color_Temple: string;
    Supplier_Warranty: string;
    Warranty: string;
    Warranty_Retail: string;
    Original_Price: string;
    Currency: string;
    Retail_Price: string;
    Tax: string;
    Use: string;
    Guide: string;
    Warning: string;
    Preserve: string;
    Note: string;
}

export interface RowValidationFrameResult {
    rowIndex: number;
    dto?: ProductDto;
    errors: string[];
    isValid: boolean;
}

export interface ExcelFrameReadResult {
    rows: RowValidationFrameResult[];
    uniqueImageNames: string[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
}

export interface TableProductProps {
    rows: RowValidationResult[];
    imagePreviewMap: Record<string, string>;
    categoryMaps: CategoryMaps;
}

export interface TableProductFrameProps {
    rows: RowValidationFrameResult[];
    imagePreviewMap: Record<string, string>;
    categoryMaps: CategoryMapsFrame;
}

export interface LensAttributeDto {
    design1Id: number;
    design2Id: number;
    uvId: number;
    refractiveIndexId: number;
    materialId: number;
    hmcColorId: number;
    phoColorId: number;
    tintColorId: number;
    sph: number;
    cyl: number;
    lenAdd: number;
    diameter: number;
    coatingId: number;
}

export interface FrameAttributeDto {
    season: string;
    model: string;
    serial: string;
    genderId: number;
    templeLength: number;
    lensHeight: number;
    lensWidth: number;
    bridgeWidth: number;
    colorCode: string;
    frameId: number;
    frameTypeId: number;
    shapeId: number;
    veId: number;
    colorLensId: number;
    coatingId: number;
    templeId: number;
    materialFrontId: number;
    materialTempleId: number;
    materialVeId: number;
    materialTempleTipId: number;
    materialLensId: number;
    colorFrontId: number;
    colorTempleId: number;
}

export interface ProductDto {
    cid: string;
    name: string;
    note?: string;
    imageUrl?: string;
    retailPrice: number;
    costPrice?: number;
    lastPurchasePrice?: number;
    tax: number;
    unit: string;
    uses: string;
    guide: string;
    warning: string;
    preserve: string;
    originalPrice: number;
    warrantyId?: number;
    warrantySupplierId?: number;
    warrantyRetailId?: number;
    countryId: number;
    brandId: number;
    groupId: number;
    supplierId: number;
    currencyId: number;
    lensAttribute?: LensAttributeDto;
    frameAttribute?: FrameAttributeDto;
}
