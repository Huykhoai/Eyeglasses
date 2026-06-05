import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default async function exportExcelFrameTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const colors = {
        primary: 'FF2E5BBA',
        secondary: 'FF4A90E2',
        accent: 'FF7ED321',
        warning: 'FFF5A623',
        success: 'FF388E3C',
        light: 'FFF8F9FA',
        white: 'FFFFFFFF',
        text: 'FF2C3E50',
        border: 'FFE1E8ED',
        headerBg: 'FF34495E',

        manualInput: 'FF4A90E2',    // Xanh dương - Tự nhập tay
        codeRule: 'FFF5A623',       // Vàng - Mã tự quy định
        multiCode: 'FF388E3C',      // Xanh mint - Mã tự quy định nhiều
    };

    worksheet.getRow(3).height = 35;
    worksheet.getRow(6).height = 22;
    worksheet.getRow(7).height = 22;
    worksheet.getRow(8).height = 22;
    worksheet.getRow(9).height = 25;
    worksheet.getRow(10).height = 25;

    for (let i = 11; i <= 110; i++) {
        worksheet.getRow(i).height = 35;
    }

    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'CÔNG TY TNHH CÔNG NGHỆ QUANG HỌC VIỆT NAM';
    worksheet.getCell('A1').font = { size: 14, bold: true, color: { argb: colors.primary }, name: 'Segoe UI' };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.light } };
    worksheet.getCell('A1').border = { bottom: { style: 'medium', color: { argb: colors.primary } } };
    worksheet.getRow(1).height = 30;

    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = 'Số 63 phố Lê Duẩn, Phường Cửa Nam, Quận Hoàn Kiếm, Thành phố Hà Nội, Việt Nam';
    worksheet.getCell('A2').font = { size: 10, color: { argb: colors.text }, name: 'Segoe UI', italic: true };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.light } };
    worksheet.getRow(2).height = 22;

    worksheet.mergeCells('E3:L3');
    worksheet.getCell('E3').value = 'BẢNG NHẬP HÀNG GỌNG';
    worksheet.getCell('E3').font = { bold: true, size: 18, color: { argb: colors.white }, name: 'Segoe UI' };
    worksheet.getCell('E3').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('E3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary } };
    worksheet.getCell('E3').border = {
        top: { style: 'medium', color: { argb: colors.primary } },
        left: { style: 'medium', color: { argb: colors.primary } },
        bottom: { style: 'medium', color: { argb: colors.primary } },
        right: { style: 'medium', color: { argb: colors.primary } },
    };

    worksheet.mergeCells('A3:D8');
    worksheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.white } };
    worksheet.getCell('A3').border = {
        top: { style: 'medium', color: { argb: colors.primary } },
        left: { style: 'medium', color: { argb: colors.primary } },
        bottom: { style: 'medium', color: { argb: colors.primary } },
        right: { style: 'medium', color: { argb: colors.primary } },
    };

    try {
        const response = await fetch('/logo.png');
        const imageBlob = await response.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const imageId = workbook.addImage({ buffer: imageBuffer, extension: 'png' });
        worksheet.addImage(imageId, {
            tl: { col: 0.5, row: 2.5 } as any,
            br: { col: 3.0, row: 7.5 } as any,
            editAs: 'twoCell'
        });
    } catch (error) { }

    worksheet.mergeCells('I6:J6');
    worksheet.getCell('I6').value = 'HƯỚNG DẪN NHẬP LIỆU';
    worksheet.getCell('I6').font = { size: 12, bold: true, color: { argb: colors.white }, name: 'Segoe UI' };
    worksheet.getCell('I6').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('I6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } };
    worksheet.mergeCells('I7:J7');
    worksheet.mergeCells('I8:J8');

    const instructions = [
        { cell: 'I7', text: '🔵 Tự nhập tay', color: colors.manualInput, textColor: colors.white },
        { cell: 'I8', text: '🟡 Mã tự quy định', color: colors.codeRule, textColor: colors.white },
    ];

    instructions.forEach(instruction => {
        const cell = worksheet.getCell(instruction.cell);
        cell.value = instruction.text;
        cell.font = { size: 12, bold: true, color: { argb: instruction.textColor }, name: 'Segoe UI' };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: instruction.color } };
        cell.border = {
            top: { style: 'thin', color: { argb: colors.border } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'thin', color: { argb: colors.border } },
            right: { style: 'thin', color: { argb: colors.border } },
        };
    });

    const genderInstructions = [
        { cell: 'K6', text: '1 - Nam', color: colors.text },
        { cell: 'K7', text: '2 - Nữ', color: colors.text },
        { cell: 'K8', text: '3 - Unisex', color: colors.text }
    ];

    genderInstructions.forEach(instruction => {
        const cell = worksheet.getCell(instruction.cell);
        cell.value = instruction.text;
        cell.font = {
            size: 11,
            bold: true,
            color: { argb: instruction.color },
            name: 'Segoe UI'
        };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    worksheet.getCell('E8').value = 'LOẠI HÀNG:';
    worksheet.getCell('E8').font = { size: 12, bold: true, color: { argb: colors.white }, name: 'Segoe UI' };
    worksheet.getCell('E8').alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell('E8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } };

    worksheet.getCell('F8').value = 'Gọng';
    worksheet.getCell('F8').font = { size: 12, bold: true, color: { argb: colors.white }, name: 'Segoe UI' };
    worksheet.getCell('F8').alignment = { horizontal: 'left', vertical: 'middle' };
    worksheet.getCell('F8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } };

    const headersVi = [
        'Nhóm', 'Tên ảnh', 'Tên đầy đủ', 'Đơn vị', 'Thương hiệu', 'Nhà cung cấp', 'Quốc gia',
        'Mùa', 'Kiểu dáng', 'Series', 'Giới tính', 'Dài càng', 'Cầu mắt', 'Dài mắt', 'Cao tròng', 'Mã màu',
        'Khung', 'Loại khung', 'Hình dáng', 'Ve', 'Màu mắt', 'Lớp phủ', 'Càng kính',
        'Chất liệu viền', 'Chất liệu càng', 'Chất liệu ve', 'Chất liệu đuôi càng', 'Chất liệu mắt',
        'Màu viền', 'Màu càng',
        'Bảo hành NCC', 'Bảo hành', 'Bảo hành bán lẻ', 'Giá gốc', 'Loại tiền tệ',
        'Giá bán lẻ', 'Thuế', 'Công dụng', 'Hướng dẫn', 'Cảnh báo', 'Bảo quản', 'Mô tả',
    ];

    headersVi.forEach((headerVi, idx) => {
        const cell = worksheet.getRow(9).getCell(idx + 1);
        cell.value = headerVi;
        cell.font = { bold: true, size: 11, color: { argb: colors.text }, name: 'Segoe UI' };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'medium', color: { argb: colors.primary } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'thin', color: { argb: colors.border } },
            right: { style: 'thin', color: { argb: colors.border } },
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.warning } };
    });

    const headers: string[] = [
        'Group', 'Image', 'FullName', 'Unit', 'Brand', 'Supplier', 'Country',
        'Season', 'Model', 'Serial', 'Gender', 'Temple_Length', 'Bridge_Width', 'Lens_Width', 'Lens_Height', 'Color_Code',
        'Frame', 'Frame_Type', 'Shape', 'Ve', 'Color_Lens', 'Coating', 'Temple',
        'Material_Front', 'Material_Temple', 'Material_Ve', 'Material_Temple_Tip', 'Material_Lens',
        'Color_Front', 'Color_Temple',
        'Supplier_Warranty', 'Warranty', 'Warranty_Retail', 'Original_Price', 'Currency',
        'Retail_Price', 'Tax', 'Use', 'Guide', 'Warning', 'Preserve', 'Note',
    ];

    headers.forEach((header, idx) => {
        worksheet.getRow(10).getCell(idx + 1).value = header;
    });

    worksheet.getRow(10).eachCell((cell) => {
        const header = cell.value as string;
        const manualInputFields = [
            'Image', 'FullName', 'Unit', 'Season', 'Model', 'Serial', 'Temple_Length', 'Bridge_Width',
            'Lens_Width', 'Lens_Height', 'Color_Code', 'Original_Price', 'Note', 'Retail_Price', 'Tax',
            'Use', 'Guide', 'Warning', 'Preserve',
        ];
        const codeRuleFields = [
            'Brand', 'Supplier', 'Country', 'Group', 'Gender', 'Frame', 'Frame_Type', 'Shape', 'Ve',
            'Color_Lens', 'Coating', 'Temple', 'Material_Front', 'Material_Temple', 'Material_Ve',
            'Material_Temple_Tip', 'Material_Lens', 'Color_Front', 'Color_Temple',
            'Warranty', 'Warranty_Retail', 'Supplier_Warranty', 'Currency'
        ];

        let fillColor = colors.manualInput;
        if (manualInputFields.includes(header)) fillColor = colors.manualInput;
        else if (codeRuleFields.includes(header)) fillColor = colors.codeRule;

        cell.font = { bold: true, size: 10, color: { argb: colors.white }, name: 'Segoe UI' };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'thin', color: { argb: colors.border } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'medium', color: { argb: colors.primary } },
            right: { style: 'thin', color: { argb: colors.border } },
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    });

    worksheet.columns = [
        { key: 'group', width: 12 },
        { key: 'image', width: 15 },
        { key: 'fullname', width: 25 },
        { key: 'unit', width: 8 },
        { key: 'brand', width: 18 },
        { key: 'supplier', width: 20 },
        { key: 'country', width: 12 },
        { key: 'season', width: 12 },
        { key: 'model', width: 15 },
        { key: 'serial', width: 15 },
        { key: 'gender', width: 12 },
        { key: 'temple_length', width: 12 },
        { key: 'bridge_width', width: 12 },
        { key: 'lens_width', width: 12 },
        { key: 'lens_height', width: 12 },
        { key: 'color_code', width: 12 },
        { key: 'frame', width: 14 },
        { key: 'frame_type', width: 14 },
        { key: 'shape', width: 14 },
        { key: 've', width: 14 },
        { key: 'color_lens', width: 14 },
        { key: 'coating', width: 14 },
        { key: 'temple', width: 14 },
        { key: 'material_front', width: 14 },
        { key: 'material_temple', width: 14 },
        { key: 'material_ve', width: 14 },
        { key: 'material_temple_tip', width: 14 },
        { key: 'material_lens', width: 14 },
        { key: 'color_front', width: 14 },
        { key: 'color_temple', width: 14 },
        { key: 'supplier_warranty', width: 17 },
        { key: 'warranty', width: 12 },
        { key: 'warranty_retail', width: 17 },
        { key: 'original_price', width: 12 },
        { key: 'currency', width: 16 },
        { key: 'retail_price', width: 12 },
        { key: 'tax', width: 8 },
        { key: 'use', width: 16 },
        { key: 'guide', width: 16 },
        { key: 'warning', width: 16 },
        { key: 'preserve', width: 16 },
        { key: 'note', width: 25 },
    ];

    for (let i = 11; i <= 110; i++) {
        worksheet.getRow(i).eachCell((cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: colors.border } },
                left: { style: 'thin', color: { argb: colors.border } },
                bottom: { style: 'thin', color: { argb: colors.border } },
                right: { style: 'thin', color: { argb: colors.border } },
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
            cell.font = { size: 10, name: 'Segoe UI', color: { argb: colors.text } };
            if (i % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
        });
    }

    for (let i = 1; i <= 8; i++) {
        worksheet.getRow(i).outlineLevel = 1;
        worksheet.getRow(i).hidden = false;
    }
    worksheet.views = [{ state: 'frozen', xSplit: 4, ySplit: 10 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `BangNhap_Gong_${new Date().toLocaleDateString()}.xlsx`);
}
