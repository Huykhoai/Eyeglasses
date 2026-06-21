import ExcelJS from 'exceljs';
import axiosClient from '@/api/axiosClient';
import type { ConfigItem, ConfigLimitResponse } from '@/types';

export interface ContractImportResult {
    success: boolean;
    contractCid?: string;
    contractName?: string;
    currency?: ConfigItem | null;
    supplier?: ConfigLimitResponse | null;
    note?: string;
    quotations?: any[];
    items?: any[];
    warnings?: string[];
    errors?: string[];
}

export const readContractExcel = async (
    file: File,
    currencies: ConfigItem[],
    suppliers: ConfigLimitResponse[],
    contractId?: number
): Promise<ContractImportResult> => {
    try {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);

        const sheet = workbook.getWorksheet(1);
        if (!sheet) {
            return { success: false, errors: ["File Excel không hợp lệ"] };
        }

        const contractCid = sheet.getCell('B3').value?.toString()?.trim();
        if (!contractCid) {
            return { success: false, errors: ["Không tìm thấy Mã hợp đồng trong file."] };
        }

        const currencyMap = new Map<string, ConfigItem>();
        currencies.forEach(c => currencyMap.set(c.cid, c));

        const supplierMap = new Map<string, ConfigLimitResponse>();
        suppliers.forEach(s => supplierMap.set(s.cid, s));

        const nameValue = sheet.getCell('B4').value?.toString()?.trim() || '';
        const currencyValue = sheet.getCell('E4').value?.toString().trim().split('-')[0].trim();
        const supplierValue = sheet.getCell('B5').value?.toString().trim().split('-')[0].trim();
        const noteValue = sheet.getCell('B6').value?.toString()?.trim() || '';

        const currency = currencyValue ? currencyMap.get(currencyValue) : null;
        const supplier = supplierValue ? supplierMap.get(supplierValue) : null;

        const itemsData: any[] = [];
        const errors: string[] = [];

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber >= 9) {
                const quotationCid = row.getCell(2).value?.toString()?.trim();
                const productCid = row.getCell(3).value?.toString()?.trim();
                const contractQty = Number(row.getCell(5).value) || 0;

                if (productCid) {
                    if (contractQty <= 0) {
                        errors.push(`Dòng ${rowNumber}: Sản phẩm ${productCid} có số lượng <= 0.`);
                    } else if (!quotationCid) {
                        errors.push(`Dòng ${rowNumber}: Sản phẩm ${productCid} thiếu Mã báo giá.`);
                    } else {
                        itemsData.push({ quotationCid, productCid, contractQty });
                    }
                }
            }
        });

        if (itemsData.length === 0) {
            return { success: false, errors: ["Không tìm thấy sản phẩm hợp lệ nào trong file."] };
        }

        const requestPayload = {
            contractId,
            contractCid,
            supplierId: supplier?.id || 0,
            items: itemsData
        };

        const response = await axiosClient.post('/api/contract/parse-contract-excel', requestPayload);
        const data = response.data;

        if (data?.error) {
            return { success: false, errors: [data.error] };
        }

        return {
            success: true,
            contractCid: contractCid,
            contractName: nameValue,
            currency: currency,
            
            supplier: supplier,
            note: noteValue,
            quotations: data.quotations,
            items: data.items,
            warnings: data.warnings,
            errors: errors.length > 0 ? errors : undefined
        };
    } catch (error: any) {
        console.error("Lỗi parse file Excel Hợp đồng", error);
        return { success: false, errors: ["Có lỗi kỹ thuật khi xử lý file hoặc kết nối với server."] };
    }
};
