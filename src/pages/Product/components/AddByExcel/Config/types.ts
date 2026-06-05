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

export interface TableProductProps {
    rows: RowValidationResult[];
    imagePreviewMap: Record<string, string>;
    categoryMaps: CategoryMaps;
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
