import ExcelJS from 'exceljs';
import type {
    CategoryMapsFrame,
    FrameRowData,
    ProductDto,
    ExcelFrameReadResult,
    RowValidationFrameResult
} from './Config/types';

const normalize = (str: unknown): string => String(str ?? '').toUpperCase().trim();

const isNumeric = (val: unknown): boolean => {
    if (val === null || val === undefined || val === '') return false;
    const n = parseFloat(String(val));
    return !isNaN(n) && isFinite(n);
};

function validateFrameRow(row: FrameRowData, maps: CategoryMapsFrame): string[] {
    const errors: string[] = [];

    if (!row.Group?.trim()) errors.push('Thiếu nhóm sản phẩm');
    if (!row.Brand?.trim()) errors.push('Thiếu thương hiệu');
    if (!row.FullName?.trim()) errors.push('Thiếu tên đầy đủ');
    if (!row.Image?.trim()) errors.push('Thiếu ảnh sản phẩm');
    if (!row.Unit?.trim()) errors.push('Thiếu đơn vị tính');
    if (!row.Supplier?.trim()) errors.push('Thiếu nhà cung cấp');
    if (!row.Country?.trim()) errors.push('Thiếu quốc gia');
    if (!row.Season?.trim()) errors.push('Thiếu phiên bản (mùa)');
    if (!row.Model?.trim()) errors.push('Thiếu model');
    if (!row.Serial?.trim()) errors.push('Thiếu serial');
    if (!row.Gender?.trim()) errors.push('Thiếu giới tính');
    if (!row.Temple_Length?.trim()) errors.push('Thiếu chiều dài càng');
    if (!row.Bridge_Width?.trim()) errors.push('Thiếu cầu mắt');
    if (!row.Lens_Width?.trim()) errors.push('Thiếu rộng mắt');
    if (!row.Lens_Height?.trim()) errors.push('Thiếu dài mắt');
    if (!row.Color_Code?.trim()) errors.push('Thiếu mã màu');
    if (!row.Frame?.trim()) errors.push('Thiếu kiểu khung');
    if (!row.Frame_Type?.trim()) errors.push('Thiếu loại khung');
    if (!row.Shape?.trim()) errors.push('Thiếu hình dáng');
    if (!row.Ve?.trim()) errors.push('Thiếu ve');
    if (!row.Color_Lens?.trim()) errors.push('Thiếu màu mắt');
    if (!row.Coating?.trim()) errors.push('Thiếu lớp phủ');
    if (!row.Temple?.trim()) errors.push('Thiếu càng kính');
    if (!row.Material_Front?.trim()) errors.push('Thiếu chất liệu viền');
    if (!row.Material_Temple?.trim()) errors.push('Thiếu chất liệu càng');
    if (!row.Material_Ve?.trim()) errors.push('Thiếu chất liệu ve');
    if (!row.Material_Temple_Tip?.trim()) errors.push('Thiếu chất liệu đuôi càng');
    if (!row.Material_Lens?.trim()) errors.push('Thiếu chất liệu mắt');
    if (!row.Color_Front?.trim()) errors.push('Thiếu màu viền');
    if (!row.Color_Temple?.trim()) errors.push('Thiếu màu càng');

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

    if (row.Temple_Length && !isNumeric(row.Temple_Length)) errors.push('Dài gọng phải là số');
    if (row.Lens_Width && !isNumeric(row.Lens_Width)) errors.push('Rộng mắt phải là số');
    if (row.Lens_Height && !isNumeric(row.Lens_Height)) errors.push('Dài mắt phải là số');
    if (row.Bridge_Width && !isNumeric(row.Bridge_Width)) errors.push('Cầu mắt phải là số');

    if (row.Original_Price && !isNumeric(row.Original_Price)) errors.push('Giá gốc phải là số');
    if (row.Retail_Price && !isNumeric(row.Retail_Price)) errors.push('Giá bán lẻ phải là số');
    if (row.Tax && !isNumeric(row.Tax)) errors.push('Thuế phải là số');

    const lookupChecks: { value: string; map: Record<string, any>; label: string }[] = [
        { value: row.Group, map: maps.group, label: 'Nhóm' },
        { value: row.Brand, map: maps.brand, label: 'Thương hiệu' },
        { value: row.Supplier, map: maps.supplier, label: 'Nhà cung cấp' },
        { value: row.Country, map: maps.country, label: 'Quốc gia' },
        { value: row.Gender, map: maps.gender, label: 'Giới tính' },
        { value: row.Frame, map: maps.frame, label: 'Kiểu khung' },
        { value: row.Frame_Type, map: maps.frameType, label: 'Loại khung' },
        { value: row.Shape, map: maps.shape, label: 'Hình dạng' },
        { value: row.Ve, map: maps.ve, label: 'Ve' },
        { value: row.Color_Lens, map: maps.color, label: 'Màu mắt' },
        { value: row.Coating, map: maps.coating, label: 'Lớp phủ' },
        { value: row.Temple, map: maps.temple, label: 'Càng kính' },
        { value: row.Material_Front, map: maps.material, label: 'Chất liệu viền' },
        { value: row.Material_Temple, map: maps.material, label: 'Chất liệu càng' },
        { value: row.Material_Ve, map: maps.material, label: 'Chất liệu ve' },
        { value: row.Material_Temple_Tip, map: maps.material, label: 'Chất liệu đuôi càng' },
        { value: row.Material_Lens, map: maps.material, label: 'Chất liệu mắt' },
        { value: row.Color_Front, map: maps.color, label: 'Màu viền' },
        { value: row.Color_Temple, map: maps.color, label: 'Màu càng' },
        { value: row.Warranty, map: maps.warranty, label: 'Bảo hành' },
        { value: row.Supplier_Warranty, map: maps.warranty, label: 'Bảo hành NCC' },
        { value: row.Warranty_Retail, map: maps.warranty, label: 'Bảo hành bán lẻ' },
        { value: row.Currency, map: maps.currency, label: 'Loại tiền tệ' },
    ];

    lookupChecks.forEach(({ value, map, label }) => {
        const normalized = normalize(value);
        if (normalized && !map[normalized]) {
            errors.push(`Không tìm thấy ${label}: "${value}"`);
        }
    });

    return errors;
}

export async function readFrameExcel(
    file: File,
    categoryMaps: CategoryMapsFrame
): Promise<ExcelFrameReadResult> {
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

    const rows: RowValidationFrameResult[] = [];
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

        const data: FrameRowData = {
            rowIndex: rowNumber,
            Group: getCellString('Group'),
            Image: getCellString('Image'),
            FullName: getCellString('FullName'),
            Unit: getCellString('Unit'),
            Brand: getCellString('Brand'),
            Supplier: getCellString('Supplier'),
            Country: getCellString('Country'),
            Season: getCellString('Season'),
            Model: getCellString('Model'),
            Serial: getCellString('Serial'),
            Gender: getCellString('Gender'),
            Temple_Length: getCellString('Temple_Length'),
            Bridge_Width: getCellString('Bridge_Width'),
            Lens_Width: getCellString('Lens_Width'),
            Lens_Height: getCellString('Lens_Height'),
            Color_Code: getCellString('Color_Code'),
            Frame: getCellString('Frame'),
            Frame_Type: getCellString('Frame_Type'),
            Shape: getCellString('Shape'),
            Ve: getCellString('Ve'),
            Color_Lens: getCellString('Color_Lens'),
            Coating: getCellString('Coating'),
            Temple: getCellString('Temple'),
            Material_Front: getCellString('Material_Front'),
            Material_Temple: getCellString('Material_Temple'),
            Material_Ve: getCellString('Material_Ve'),
            Material_Temple_Tip: getCellString('Material_Temple_Tip'),
            Material_Lens: getCellString('Material_Lens'),
            Color_Front: getCellString('Color_Front'),
            Color_Temple: getCellString('Color_Temple'),
            Supplier_Warranty: getCellString('Supplier_Warranty'),
            Warranty: getCellString('Warranty'),
            Warranty_Retail: getCellString('Warranty_Retail'),
            Original_Price: getCellString('Original_Price'),
            Currency: getCellString('Currency'),
            Retail_Price: getCellString('Retail_Price'),
            Tax: getCellString('Tax'),
            Use: getCellString('Use'),
            Guide: getCellString('Guide'),
            Warning: getCellString('Warning'),
            Preserve: getCellString('Preserve'),
            Note: getCellString('Note'),
        };

        if (data.Image) {
            imageNameSet.add(data.Image);
        }

        const errors = validateFrameRow(data, categoryMaps);
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
            if (groupType === "Gọng") {
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

                frameAttribute: {
                    season: data.Season,
                    model: data.Model,
                    serial: data.Serial,
                    genderId: categoryMaps.gender[normalize(data.Gender)]?.id ?? 0,
                    templeLength: parseFloat(data.Temple_Length || '0') || 0,
                    bridgeWidth: parseFloat(data.Bridge_Width || '0') || 0,
                    lensWidth: parseFloat(data.Lens_Width || '0') || 0,
                    lensHeight: parseFloat(data.Lens_Height || '0') || 0,
                    colorCode: data.Color_Code,
                    frameId: categoryMaps.frame[normalize(data.Frame)]?.id ?? 0,
                    frameTypeId: categoryMaps.frameType[normalize(data.Frame_Type)]?.id ?? 0,
                    shapeId: categoryMaps.shape[normalize(data.Shape)]?.id ?? 0,
                    veId: categoryMaps.ve[normalize(data.Ve)]?.id ?? 0,
                    colorLensId: categoryMaps.color[normalize(data.Color_Lens)]?.id ?? 0,
                    coatingId: categoryMaps.coating[normalize(data.Coating.split(',')[0] || '')]?.id ?? 0,
                    templeId: categoryMaps.temple[normalize(data.Temple)]?.id ?? 0,
                    materialFrontId: categoryMaps.material[normalize(data.Material_Front)]?.id ?? 0,
                    materialTempleId: categoryMaps.material[normalize(data.Material_Temple)]?.id ?? 0,
                    materialVeId: categoryMaps.material[normalize(data.Material_Ve)]?.id ?? 0,
                    materialTempleTipId: categoryMaps.material[normalize(data.Material_Temple_Tip)]?.id ?? 0,
                    materialLensId: categoryMaps.material[normalize(data.Material_Lens)]?.id ?? 0,
                    colorFrontId: categoryMaps.color[normalize(data.Color_Front)]?.id ?? 0,
                    colorTempleId: categoryMaps.color[normalize(data.Color_Temple)]?.id ?? 0,
                }
            } as any;
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
