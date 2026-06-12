import ExcelJS from 'exceljs';
import axiosClient from '@/api/axiosClient';
import type { ConfigItem, ConfigLimitResponse } from '@/types';

export interface ExcelImportResult {
    success: boolean;
    data?: any;
    errors?: string[];
}
interface ExcelRowData {
    rowNumber: number;
    cid: string;
    reqQty: number;
    expPrice: number;
    quoteQty: number;
    quotePrice: number;
}

export const readExcelData = async (file: File, currencies: ConfigItem[], suppliers: ConfigLimitResponse[]): Promise<ExcelImportResult> => {
    try {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            return { success: false, errors: ["File Excel không hợp lệ hoặc không có sheet đầu tiên."] };
        }

        const currencyMap = new Map<string, ConfigItem>();
        currencies.forEach(c => currencyMap.set(c.cid, c));

        const supplierMap = new Map<string, ConfigLimitResponse>();
        suppliers.forEach(s => supplierMap.set(s.cid, s));

        const cidValue = worksheet.getCell('B3').value?.toString().trim();
        const nameValue = worksheet.getCell('B4').value?.toString().trim();
        const expectedDateValue = worksheet.getCell('E3').value?.toString().trim();
        const noteValue = worksheet.getCell('E5').value?.toString().trim();
        const currencyValue = worksheet.getCell('E4').value?.toString().trim().split('-')[0].trim();
        const supplierValue = worksheet.getCell('B5').value?.toString().trim().split('-')[0].trim();

        const currency = currencyValue ? currencyMap.get(currencyValue) : null;
        const supplier = supplierValue ? supplierMap.get(supplierValue) : null;

        const cids: string[] = [];
        const cidSet = new Set<string>();
        const errors: string[] = [];
        const validRows: ExcelRowData[] = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber >= 9) {
                const cidValue = row.getCell(2).value?.toString()?.trim();

                if (!cidValue) {
                    errors.push(`Dòng ${rowNumber}: Mã sản phẩm (CID) bị trống.`);
                } else {
                    if (cidSet.has(cidValue)) {
                        errors.push(`Dòng ${rowNumber}: Mã sản phẩm (CID) '${cidValue}' bị trùng lặp trong file.`);
                    } else {
                        cidSet.add(cidValue);
                        cids.push(cidValue);

                        validRows.push({
                            rowNumber,
                            cid: cidValue,
                            reqQty: Number(row.getCell(6).value) || 0,
                            expPrice: Number(row.getCell(7).value) || 0,
                            quoteQty: Number(row.getCell(8).value) || 0,
                            quotePrice: Number(row.getCell(9).value) || 0,
                        });
                    }
                }
            }
        });

        if (cids.length === 0) {
            errors.push('Không tìm thấy mã sản phẩm hợp lệ nào trong file.');
            return { success: false, errors };
        }

        const res = await axiosClient.post('/api/product/by-cids', cids);
        const cidToIdMap = res.data || {};

        if (Object.keys(cidToIdMap).length === 0) {
            errors.push('Tất cả các mã sản phẩm trong file không tồn tại trên hệ thống.');
            return { success: false, errors };
        }

        const newProductsMap: Record<number, any> = {};

        validRows.forEach((row) => {
            if (cidToIdMap[row.cid]) {
                const productId = cidToIdMap[row.cid];
                newProductsMap[productId] = {
                    productId: productId,
                    requestQty: row.reqQty > 0 ? row.reqQty : 1,
                    expectedPrice: row.expPrice,
                    quotedQty: row.quoteQty > 0 ? row.quoteQty : 1,
                    quotedPrice: row.quotePrice,
                };
            } else {
                errors.push(`Dòng ${row.rowNumber}: Mã sản phẩm '${row.cid}' không tồn tại trên hệ thống.`);
            }
        });

        const result = {
            cid: cidValue,
            name: nameValue,
            expectedDate: expectedDateValue,
            note: noteValue,
            currency: currency,
            supplier: supplier,
            products: newProductsMap
        };
        return {
            success: true,
            data: result,
            errors: errors.length > 0 ? errors : undefined
        };

    } catch (error: any) {
        const message = error.response?.data?.message || error.message;
        return { success: false, errors: [message] };
    }
};
