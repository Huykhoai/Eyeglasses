import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const exportContractToExcel = async (contractData: any, quotationsMap: Record<number, any>, detailedItems: any[], fileName?: string) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hợp đồng');

    sheet.columns = [
        { width: 12 },
        { width: 18 },
        { width: 18 },
        { width: 45 },
        { width: 15 },
        { width: 18 },
        { width: 18 }
    ];
    sheet.mergeCells('A1:G1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'PHIẾU THÔNG TIN HỢP ĐỒNG';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet.getCell('A3').value = 'Mã hợp đồng:';
    sheet.getCell('B3').value = contractData.cid;
    sheet.getCell('A3').font = { bold: true };

    sheet.getCell('D3').value = 'Ngày ký:';
    sheet.getCell('E3').value = contractData.signDate ? format(new Date(contractData.signDate), 'dd/MM/yyyy') : '';
    sheet.getCell('D3').font = { bold: true };

    sheet.getCell('A4').value = 'Tên hợp đồng:';
    sheet.getCell('B4').value = contractData.name;
    sheet.getCell('A4').font = { bold: true };

    sheet.getCell('D4').value = 'Loại tiền tệ:';
    sheet.getCell('E4').value = contractData.currency ? `${contractData.currency.cid} - ${contractData.currency.name}` : '';
    sheet.getCell('D4').font = { bold: true };

    sheet.getCell('A5').value = 'Nhà cung cấp:';
    sheet.getCell('B5').value = contractData.supplier ? `${contractData.supplier.cid} - ${contractData.supplier.name}` : '';
    sheet.getCell('A5').font = { bold: true };

    sheet.getCell('D5').value = 'Ngày giao:';
    sheet.getCell('E5').value = contractData.expectedDeliveryDate ? format(new Date(contractData.expectedDeliveryDate), 'dd/MM/yyyy') : '';
    sheet.getCell('D5').font = { bold: true };

    sheet.getCell('A6').value = 'Ghi chú:';
    sheet.getCell('B6').value = contractData.note || '';
    sheet.getCell('A6').font = { bold: true };

    for (let i = 3; i <= 6; i++) {
        ['A', 'B', 'D', 'E'].forEach(col => {
            sheet.getCell(`${col}${i}`).font = { ...sheet.getCell(`${col}${i}`).font, name: 'Arial', size: 11 };
        });
    }

    sheet.mergeCells('A7:G7');
    const tbBanner = sheet.getCell('A7');
    tbBanner.value = 'DANH SÁCH THIẾT BỊ / SẢN PHẨM';
    tbBanner.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    tbBanner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF64748B' } };
    tbBanner.alignment = { vertical: 'middle', horizontal: 'center' };

    const headers = [
        'STT', 'Mã báo giá', 'Mã sản phẩm', 'Tên đầy đủ', 'Số lượng', 'Giá báo giá', 'Thành tiền'
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

    const items = detailedItems || [];
    items.forEach((prod, idx) => {
        const row = sheet.getRow(9 + idx);
        const qCid = quotationsMap[prod.quotationId]?.cid || '';

        row.getCell(1).value = idx + 1;
        row.getCell(1).alignment = { horizontal: 'center' };

        row.getCell(2).value = qCid;
        row.getCell(3).value = prod.cid || '';
        row.getCell(4).value = prod.name || '';

        const contractQty = prod.contractQty || 0;
        const quoPrice = prod.quoPrice || 0;
        const lineTotal = prod.lineTotal || 0;

        row.getCell(5).value = contractQty;
        row.getCell(6).value = quoPrice;
        row.getCell(7).value = lineTotal;

        row.getCell(5).numFmt = '#,##0';
        row.getCell(5).alignment = { horizontal: 'right' };
        row.getCell(6).numFmt = '#,##0.00';
        row.getCell(6).alignment = { horizontal: 'right' };
        row.getCell(7).numFmt = '#,##0.00';
        row.getCell(7).alignment = { horizontal: 'right' };

        for (let i = 1; i <= 7; i++) {
            row.getCell(i).border = {
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const defaultName = `Contract_${contractData.cid || format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    saveAs(blob, fileName || defaultName);
};
