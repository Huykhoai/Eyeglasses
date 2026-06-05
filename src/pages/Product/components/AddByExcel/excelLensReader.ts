import ExcelJS from 'exceljs';
import type { CategoryMaps, ExcelReadResult, ProductDto, RowValidationResult } from './Config/types';

const normalize = (str: unknown): string =>
    String(str ?? '').toUpperCase().trim();

const isNumeric = (val: unknown): boolean => {
    if (val === null || val === undefined || val === '') return false;
    const n = parseFloat(String(val));
    return !isNaN(n) && isFinite(n);
};

export function buildLookupMap<T extends { cid: string }>(
    items: T[] | undefined
): Record<string, T> {
    const map: Record<string, T> = {};
    if (!items) return map;
    items.forEach((item) => {
        const key = normalize(item.cid);
        if (key) map[key] = item;
    });
    return map;
}


function validateLensRow(row: any, maps: CategoryMaps): string[] {
    const errors: string[] = [];

    if (!row.Group?.trim()) errors.push('Thiếu nhóm sản phẩm');
    if (!row.Brand?.trim()) errors.push('Thiếu thương hiệu');
    if (!row.FullName?.trim()) errors.push('Thiếu tên đầy đủ');
    if (!row.Image?.trim()) errors.push('Thiếu ảnh sản phẩm');
    if (!row.Unit?.trim()) errors.push('Thiếu đơn vị tính');
    if (!row.Supplier?.trim()) errors.push('Thiếu nhà cung cấp');
    if (!row.Country?.trim()) errors.push('Thiếu quốc gia');
    if (!row.SPH && !row.CYL && !row.ADD) errors.push('Thiếu thông số kỹ thuật');
    if (!row.Diameter?.trim()) errors.push('Thiếu đường kính');
    if (!row.Design1?.trim()) errors.push('Thiếu thiết kế 1');
    if (!row.Design2?.trim()) errors.push('Thiếu thiết kế 2');
    if (!row.Material?.trim()) errors.push('Thiếu chất liệu');
    if (!row.Refractive_Index?.trim()) errors.push('Thiếu chiết suất');
    if (!row.Uv?.trim()) errors.push('Thiếu chống UV');
    if (!row.Coating?.trim()) errors.push('Thiếu lớp phủ');
    if (!row.HMC?.trim()) errors.push('Thiếu ánh mạ (HMC)');
    if (!row.PHO?.trim()) errors.push('Thiếu đổi màu (PHO)');
    if (!row.TIND?.trim()) errors.push('Thiếu mạ màu (TIND)');
    if (!row.Supplier_Warranty?.trim()) errors.push('Thiếu bảo hành NCC');
    if (!row.Warranty?.trim()) errors.push('Thiếu bảo hành');
    if (!row.Warranty_Retail?.trim()) errors.push('Thiếu bảo hành bán lẻ');
    if (!row.Original_Price?.trim()) errors.push('Thiếu giá gốc');
    if (!row.Currency?.trim()) errors.push('Thiếu loại tiền tệ');
    if (!row.Retail_Price?.trim()) errors.push('Thiếu giá bán lẻ');
    if (!row.Use?.trim()) errors.push('Thiếu công dụng');
    if (!row.Guide?.trim()) errors.push('Thiếu hướng dẫn sử dụng');
    if (!row.Warning?.trim()) errors.push('Thiếu cảnh báo');
    if (!row.Preserve?.trim()) errors.push('Thiếu bảo quản');
    if (!row.Note?.trim()) errors.push('Thiếu ghi chú');

    // ── Kiểm tra số ──
    if (row.SPH && !isNumeric(row.SPH)) errors.push('SPH phải là số');
    if (row.CYL && !isNumeric(row.CYL)) errors.push('CYL phải là số');
    if (row.ADD && !isNumeric(row.ADD)) errors.push('ADD phải là số');
    if (row.Original_Price && !isNumeric(row.Original_Price)) errors.push('Giá gốc phải là số');
    if (row.Retail_Price && !isNumeric(row.Retail_Price)) errors.push('Giá bán lẻ phải là số');

    // ── Kiểm tra mục lục (lookup) ──
    const lookupChecks: { value: string; map: Record<string, any>; label: string }[] = [
        { value: row.Group, map: maps.group, label: 'Nhóm' },
        { value: row.Brand, map: maps.brand, label: 'Thương hiệu' },
        { value: row.Supplier, map: maps.supplier, label: 'Nhà cung cấp' },
        { value: row.Country, map: maps.country, label: 'Quốc gia' },
        { value: row.Currency, map: maps.currency, label: 'Loại tiền tệ' },
        { value: row.Material, map: maps.material, label: 'Chất liệu' },
        { value: row.Refractive_Index, map: maps.refractiveIndex, label: 'Chiết suất' },
        { value: row.Design1, map: maps.design, label: 'Thiết kế 1' },
        { value: row.Design2, map: maps.design, label: 'Thiết kế 2' },
        { value: row.Coating, map: maps.coating, label: 'Lớp phủ' },
        { value: row.Uv, map: maps.uv, label: 'Chống UV' },
        { value: row.HMC, map: maps.color, label: 'Ánh mạ (HMC)' },
        { value: row.PHO, map: maps.color, label: 'Đổi màu (PHO)' },
        { value: row.TIND, map: maps.color, label: 'Mạ màu (TIND)' },
        { value: row.Warranty, map: maps.warranty, label: 'Bảo hành' },
        { value: row.Supplier_Warranty, map: maps.warranty, label: 'Bảo hành NCC' },
        { value: row.Warranty_Retail, map: maps.warranty, label: 'Bảo hành bán lẻ' },
    ];

    lookupChecks.forEach(({ value, map, label }) => {
        const normalized = normalize(value);
        if (normalized && !map[normalized]) {
            errors.push(`Không tìm thấy ${label}: "${value}"`);
        }
    });


    return errors;
}

export async function readLensExcel(
    file: File,
    categoryMaps: CategoryMaps
): Promise<ExcelReadResult> {
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
        return { rows: [], uniqueImageNames: [], totalRows: 0, validRows: 0, invalidRows: 0 };
    }

    const groupType = worksheet.getCell('F8').value;
    let headerRowIndex = 10;
    worksheet.eachRow((row, rowNumber) => {
        const firstCell = String(row.getCell(1).value ?? '').trim();
        if (firstCell === 'Group') {
            headerRowIndex = rowNumber;
        }
    });

    const headerRow = worksheet.getRow(headerRowIndex);
    const colMap: Record<string, number> = {};
    headerRow.eachCell((cell, colNumber) => {
        const val = String(cell.value ?? '').trim();
        if (val) colMap[val] = colNumber;
    });

    const rows: RowValidationResult[] = [];
    const imageNameSet = new Set<string>();
    const dataStartRow = headerRowIndex + 1;

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < dataStartRow) return;

        let hasData = false;
        row.eachCell(() => { hasData = true; });
        if (!hasData) return;

        const getCellString = (key: string): string => {
            const colIdx = colMap[key];
            if (!colIdx) return '';
            const cellValue = row.getCell(colIdx).value;
            return String(cellValue ?? '').trim();
        };

        const data: any = {
            rowIndex: rowNumber,
            Group: getCellString('Group')?.trim(),
            Image: getCellString('Image')?.trim(),
            FullName: getCellString('FullName')?.trim(),
            Unit: getCellString('Unit')?.trim(),
            Brand: getCellString('Brand')?.trim(),
            Supplier: getCellString('Supplier')?.trim(),
            Country: getCellString('Country')?.trim(),
            SPH: getCellString('SPH')?.trim(),
            CYL: getCellString('CYL')?.trim(),
            ADD: getCellString('ADD')?.trim(),
            Diameter: getCellString('Diameter')?.trim(),
            Design1: getCellString('Design1')?.trim(),
            Design2: getCellString('Design2')?.trim(),
            Material: getCellString('Material')?.trim(),
            Refractive_Index: getCellString('Refractive_Index')?.trim(),
            Uv: getCellString('Uv')?.trim(),
            Coating: getCellString('Coating')?.trim(),
            HMC: getCellString('HMC')?.trim(),
            PHO: getCellString('PHO')?.trim(),
            TIND: getCellString('TIND')?.trim(),
            Supplier_Warranty: getCellString('Supplier_Warranty')?.trim(),
            Warranty: getCellString('Warranty')?.trim(),
            Warranty_Retail: getCellString('Warranty_Retail')?.trim(),
            Original_Price: getCellString('Original_Price')?.trim(),
            Currency: getCellString('Currency')?.trim(),
            Retail_Price: getCellString('Retail_Price')?.trim(),
            Tax: getCellString('Tax')?.trim(),
            Use: getCellString('Use')?.trim(),
            Guide: getCellString('Guide')?.trim(),
            Warning: getCellString('Warning')?.trim(),
            Preserve: getCellString('Preserve')?.trim(),
            Note: getCellString('Note')?.trim(),
        };

        if (data.Image) {
            imageNameSet.add(data.Image);
        }

        const errors = validateLensRow(data, categoryMaps);
        let dto: ProductDto | undefined;

        if (errors.length === 0) {
            let generatedCid = "";

            if (data.Group) {
                const group = categoryMaps.group[normalize(data.Group)];
                generatedCid += group?.id.toString().padStart(2, '0');
            }

            if (data.Brand) {
                const brand = categoryMaps.brand[normalize(data.Brand)];
                generatedCid += brand?.id.toString().padStart(2, '0');
            } else {
                generatedCid += "00";
            }

            if (groupType === "Mắt") {
                if (data.Refractive_Index) {
                    const refractiveIndex = categoryMaps.refractiveIndex[normalize(data.Refractive_Index)];
                    const riCidStr = refractiveIndex?.cid.toString().replace(/[^0-9a-zA-Z]/g, '').substring(0, 3).padEnd(3, '0');
                    generatedCid += riCidStr;
                } else {
                    generatedCid += "000";
                }
            } else if (groupType === "Gọng") {
                if (data.Model) {
                    const flStr = data.Model.replace(/[^0-9a-zA-Z]/g, '').substring(0, 3).toUpperCase().padEnd(3, '0');
                    generatedCid += flStr;
                } else {
                    generatedCid += "000";
                }
            } else {
                generatedCid += "000";
            }
            generatedCid += "00000";
            dto = {
                cid: generatedCid,
                name: data.FullName,
                imageUrl: data.Image,
                note: data.Note,
                retailPrice: parseFloat(data.Retail_Price || '0') || 0,
                tax: parseFloat(data.Tax || '0') || 0,
                unit: data.Unit,
                uses: data.Use,
                guide: data.Guide,
                warning: data.Warning,
                preserve: data.Preserve,
                originalPrice: parseFloat(data.Original_Price || '0') || 0,
                warrantyId: categoryMaps.warranty[normalize(data.Warranty)]?.id,
                warrantySupplierId: categoryMaps.warranty[normalize(data.Supplier_Warranty)]?.id,
                warrantyRetailId: categoryMaps.warranty[normalize(data.Warranty_Retail)]?.id,

                countryId: categoryMaps.country[normalize(data.Country)]?.id ?? 0,
                brandId: categoryMaps.brand[normalize(data.Brand)]?.id ?? 0,
                groupId: categoryMaps.group[normalize(data.Group)]?.id ?? 0,
                supplierId: categoryMaps.supplier[normalize(data.Supplier)]?.id ?? 0,
                currencyId: categoryMaps.currency[normalize(data.Currency)]?.id ?? 0,

                lensAttribute: {
                    design1Id: categoryMaps.design[normalize(data.Design1)]?.id ?? 0,
                    design2Id: categoryMaps.design[normalize(data.Design2)]?.id ?? 0,
                    uvId: categoryMaps.uv[normalize(data.Uv)]?.id ?? 0,
                    refractiveIndexId: categoryMaps.refractiveIndex[normalize(data.Refractive_Index)]?.id ?? 0,
                    materialId: categoryMaps.material[normalize(data.Material)]?.id ?? 0,
                    hmcColorId: categoryMaps.color[normalize(data.HMC)]?.id ?? 0,
                    phoColorId: categoryMaps.color[normalize(data.PHO)]?.id ?? 0,
                    tintColorId: categoryMaps.color[normalize(data.TIND)]?.id ?? 0,
                    sph: parseFloat(data.SPH || '0') || 0,
                    cyl: parseFloat(data.CYL || '0') || 0,
                    lenAdd: parseFloat(data.ADD || '0') || 0,
                    diameter: parseFloat(data.Diameter || '0') || 0,
                    coatingId: categoryMaps.coating[normalize(data.Coating.split(',')[0] || '')]?.id ?? 0,
                }
            };
        }

        rows.push({
            rowIndex: rowNumber,
            dto,
            errors,
            isValid: errors.length === 0,
        });
    });

    const uniqueImageNames = Array.from(imageNameSet);
    const validRows = rows.filter((r) => r.isValid).length;
    const invalidRows = rows.filter((r) => !r.isValid).length;

    return {
        rows,
        uniqueImageNames,
        totalRows: rows.length,
        validRows,
        invalidRows,
    };
}
