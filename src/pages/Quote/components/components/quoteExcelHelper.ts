import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import type { FormValues } from '../AddQuotationRequest';

export const exportQuoteToExcel = async (data: FormValues, fileName?: string) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Yêu cầu báo giá');

    sheet.columns = [
        { width: 13 },
        { width: 18 },
        { width: 60 },
        { width: 10 },
        { width: 10 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 18 },
    ];
    sheet.mergeCells('A1:J1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'PHIẾU THÔNG TIN YÊU CẦU BÁO GIÁ';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet.getCell('A3').value = 'Mã yêu cầu:';
    sheet.getCell('B3').value = data.cid || '';
    sheet.getCell('A3').font = { bold: true };

    sheet.getCell('D3').value = 'Thời hạn:';
    sheet.getCell('E3').value = data.expectedDate || '';
    sheet.getCell('D3').font = { bold: true };

    sheet.getCell('A4').value = 'Tiêu đề:';
    sheet.getCell('B4').value = data.name || '';
    sheet.getCell('A4').font = { bold: true };


    sheet.getCell('D4').value = 'Tiền tệ:';
    sheet.getCell('E4').value = data.currency ? data?.currency?.cid + ' - ' + data.currency?.name : '';
    sheet.getCell('D4').font = { bold: true };

    sheet.getCell('A5').value = 'Nhà cung cấp:';
    sheet.getCell('B5').value = data.supplier ? data.supplier?.cid + ' - ' + data.supplier?.name : '';
    sheet.getCell('A5').font = { bold: true };

    sheet.getCell('D5').value = 'Ghi chú:';
    sheet.getCell('E5').value = data.note || '';
    sheet.getCell('D5').font = { bold: true };

    for (let i = 3; i <= 5; i++) {
        ['A', 'B', 'D', 'E'].forEach(col => {
            sheet.getCell(`${col}${i}`).font = { ...sheet.getCell(`${col}${i}`).font, name: 'Arial', size: 11 };
        });
    }

    sheet.mergeCells('A7:J7');
    const tbBanner = sheet.getCell('A7');
    tbBanner.value = 'DANH SÁCH SẢN PHẨM';
    tbBanner.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    tbBanner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF64748B' } };
    tbBanner.alignment = { vertical: 'middle', horizontal: 'center' };

    const headers = [
        'STT', 'Mã sản phẩm', 'Tên đầy đủ', 'Đơn vị', 'Thuế (%)',
        'SL dự kiến', 'Giá dự kiến', 'SL báo giá', 'Giá báo giá', 'Tổng tiền'
    ];

    const headerRow = sheet.getRow(8);
    headers.forEach((h, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = h;
        cell.font = { bold: true, name: 'Arial', size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
        };
    });

    const products = Object.values(data.products) || [];
    products.forEach((prod, idx) => {
        const row = sheet.getRow(9 + idx);

        row.getCell(1).value = idx + 1;
        row.getCell(1).alignment = { horizontal: 'center' };

        row.getCell(2).value = prod.cid || '';
        row.getCell(3).value = prod.name || '';

        row.getCell(4).value = prod.unit || '';
        row.getCell(4).alignment = { horizontal: 'center' };

        row.getCell(5).value = prod.tax || 0;
        row.getCell(5).alignment = { horizontal: 'right' };

        const requestQty = prod.requestQty || 0;
        const expectedPrice = prod.expectedPrice || 0;
        const quotedQty = prod.quotedQty || 0;
        const quotedPrice = prod.quotedPrice || 0;
        const totalPrice = prod.lineTotal || 0;

        row.getCell(6).value = requestQty;
        row.getCell(7).value = expectedPrice;
        row.getCell(8).value = quotedQty;
        row.getCell(9).value = quotedPrice;
        row.getCell(10).value = totalPrice;
    });

    for (let i = 9; i <= 110; i++) {
        sheet.getRow(i).eachCell((cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
            cell.font = {
                size: 10,
                name: 'Segoe UI',
                color: { argb: 'FF2C3E50' }
            };

            if (i % 2 === 0) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF8F9FA' },
                };
            }
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const defaultName = `RFQ_${data.cid || format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    saveAs(blob, fileName || defaultName);
};
