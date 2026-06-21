import ExcelJS from 'exceljs';
import axiosClient from '@/api/axiosClient';

export interface ContractQuotationImportResult {
    success: boolean;
    quotation?: any;
    items?: any[];
    warnings?: string[];
    errors?: string[];
}

export const readQuotationExcelForContract = async (
    file: File,
    supplierId: number,
    contractId?: number
): Promise<ContractQuotationImportResult> => {
    try {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);

        const sheet = workbook.getWorksheet(1);
        if (!sheet) {
            return { success: false, errors: ["File Excel không hợp lệ"] };
        }

        const quotationCid = sheet.getCell('B3').value?.toString()?.trim();
        if (!quotationCid) {
            return { success: false, errors: ["Không tìm thấy Mã báo giá (CID) trong file."] };
        }

        const itemsMap: Record<string, number> = {};
        const errors: string[] = [];

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber >= 9) {
                const productCid = row.getCell(2).value?.toString()?.trim();
                const quoteQty = Number(row.getCell(8).value) || 0;

                if (productCid) {
                    if (itemsMap[productCid]) {
                        errors.push(`Dòng ${rowNumber}: Mã sản phẩm trùng lặp trong file.`);
                    } else if (quoteQty <= 0) {
                        errors.push(`Dòng ${rowNumber}: Sản phẩm ${productCid} có số lượng <= 0.`);
                    } else {
                        itemsMap[productCid] = quoteQty;
                    }
                }
            }
        });

        if (Object.keys(itemsMap).length === 0) {
            return { success: false, errors: ["Không tìm thấy sản phẩm hợp lệ nào trong báo giá."] };
        }

        const requestPayload = {
            contractId,
            quotationCid,
            supplierId,
            items: itemsMap
        };

        const response = await axiosClient.post('/api/contract/parse-quotation-excel', requestPayload);
        const data = response.data;

        if (data?.error) {
            return { success: false, errors: [data.error] };
        }

        return {
            success: true,
            quotation: data.quotation,
            items: data.items,
            warnings: data.warnings,
            errors: errors.length > 0 ? errors : undefined
        };
    } catch (error: any) {
        console.error("Lỗi parse file Excel Báo Giá", error);
        return { success: false, errors: ["Có lỗi kỹ thuật khi xử lý file."] };
    }
};
