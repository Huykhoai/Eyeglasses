import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default async function exportExcelLensTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const colors = {
        primary: 'FF2E5BBA',      // Xanh dương chính
        secondary: 'FF4A90E2',    // Xanh dương nhạt
        accent: 'FF7ED321',       // Xanh lá accent
        warning: 'FFF5A623',      // Vàng cảnh báo
        success: 'FF388E3C',      // Xanh mint thành công
        light: 'FFF8F9FA',        // Xám nhạt
        white: 'FFFFFFFF',        // Trắng
        text: 'FF2C3E50',         // Xám đậm cho text
        border: 'FFE1E8ED',       // Xám nhạt cho border
        headerBg: 'FF34495E',     // Xám đậm cho header

        // 3 màu chính cho header tương ứng với hướng dẫn
        manualInput: 'FF4A90E2',    // Xanh dương - Tự nhập tay
        codeRule: 'FFF5A623',       // Vàng - Mã tự quy định  
        multiCode: 'FF388E3C',      // Xanh mint - Mã tự quy định nhiều
    };

    // Setting row heights với tỷ lệ hài hòa hơn
    worksheet.getRow(3).height = 35;
    worksheet.getRow(6).height = 22;
    worksheet.getRow(7).height = 22;
    worksheet.getRow(8).height = 22;
    worksheet.getRow(9).height = 25;
    worksheet.getRow(10).height = 25;

    for (let i = 11; i <= 110; i++) {
        worksheet.getRow(i).height = 35;
    }

    // Header công ty với thiết kế chuyên nghiệp
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'CÔNG TY TNHH CÔNG NGHỆ QUANG HỌC VIỆT NAM';
    worksheet.getCell('A1').font = {
        size: 14,
        bold: true,
        color: { argb: colors.primary },
        name: 'Segoe UI'
    };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.light },
    };
    worksheet.getCell('A1').border = {
        bottom: { style: 'medium', color: { argb: colors.primary } },
    };
    worksheet.getRow(1).height = 30;

    // Địa chỉ với styling cải tiến
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = 'Số 63 phố Lê Duẩn, Phường Cửa Nam, Quận Hoàn Kiếm, Thành phố Hà Nội, Việt Nam';
    worksheet.getCell('A2').font = {
        size: 10,
        color: { argb: colors.text },
        name: 'Segoe UI',
        italic: true
    };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.light },
    };
    worksheet.getRow(2).height = 22;

    // Tiêu đề chính với gradient effect
    worksheet.mergeCells('E3:L3');
    worksheet.getCell('E3').value = 'BẢNG NHẬP HÀNG MẮT';
    worksheet.getCell('E3').font = {
        bold: true,
        size: 18,
        color: { argb: colors.white },
        name: 'Segoe UI'
    };
    worksheet.getCell('E3').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('E3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.primary },
    };
    worksheet.getCell('E3').border = {
        top: { style: 'medium', color: { argb: colors.primary } },
        left: { style: 'medium', color: { argb: colors.primary } },
        bottom: { style: 'medium', color: { argb: colors.primary } },
        right: { style: 'medium', color: { argb: colors.primary } },
    };

    // Logo area với border đẹp
    worksheet.mergeCells('A3:D8');
    worksheet.getCell('A3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.white },
    };
    worksheet.getCell('A3').border = {
        top: { style: 'medium', color: { argb: colors.primary } },
        left: { style: 'medium', color: { argb: colors.primary } },
        bottom: { style: 'medium', color: { argb: colors.primary } },
        right: { style: 'medium', color: { argb: colors.primary } },
    };

    // Chèn logo
    try {
        const response = await fetch('/logo.png');
        const imageBlob = await response.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: 'png',
        });
        worksheet.addImage(imageId, {
            tl: { col: 0.5, row: 2.5 } as any,
            br: { col: 3.0, row: 7.5 } as any,
            editAs: 'twoCell'
        });
    } catch (error) {
    }

    // Hướng dẫn nhập liệu với 3 màu chính
    worksheet.mergeCells('J6:K6');
    worksheet.getCell('J6').value = 'HƯỚNG DẪN NHẬP LIỆU';
    worksheet.getCell('J6').font = {
        size: 12,
        bold: true,
        color: { argb: colors.white },
        name: 'Segoe UI'
    };
    worksheet.getCell('J6').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('J6').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.headerBg },
    };
    worksheet.mergeCells('J7:K7');
    worksheet.mergeCells('J8:K8');

    const instructions = [
        { cell: 'J7', text: '🔵 Tự nhập tay', color: colors.manualInput, textColor: colors.white },
        { cell: 'J8', text: '🟡 Mã tự quy định', color: colors.codeRule, textColor: colors.white },
    ];

    instructions.forEach(instruction => {
        const cell = worksheet.getCell(instruction.cell);
        cell.value = instruction.text;
        cell.font = {
            size: 12,
            bold: true,
            color: { argb: instruction.textColor },
            name: 'Segoe UI'
        };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: instruction.color },
        };
        cell.border = {
            top: { style: 'thin', color: { argb: colors.border } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'thin', color: { argb: colors.border } },
            right: { style: 'thin', color: { argb: colors.border } },
        };
    });



    // Thông tin loại hàng
    worksheet.getCell('E8').value = 'LOẠI HÀNG:';
    worksheet.getCell('E8').font = {
        size: 12,
        bold: true,
        color: { argb: colors.white },
        name: 'Segoe UI'
    };
    worksheet.getCell('E8').alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell('E8').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.headerBg },
    };

    worksheet.getCell('F8').value = 'Mắt';
    worksheet.getCell('F8').font = {
        size: 12,
        bold: true,
        color: { argb: colors.white },
        name: 'Segoe UI'
    };
    worksheet.getCell('F8').alignment = { horizontal: 'left', vertical: 'middle' };
    worksheet.getCell('F8').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.headerBg },
    };

    // Headers tiếng Việt với thiết kế đẹp
    const headersVi = [
        'Nhóm', 'Tên ảnh', 'Tên đầy đủ', 'Đơn vị', 'Thương hiệu', 'Nhà cung cấp', 'Quốc gia',
        'Độ cầu', 'Độ trụ', 'Độ cộng thêm', 'Đường kính', 'Thiết kế 1', 'Thiết kế 2',
        'Chất liệu', 'Chiết suất', 'Chống UV', 'Lớp phủ', 'Đổi màu', 'Mạ màu', 'Độ đậm màu',
        'Bảo hành NCC', 'Bảo hành', 'Bảo hành bán lẻ', 'Giá gốc', 'Loại tiền tệ',
        'Giá bán lẻ', 'Thuế', 'Công dụng', 'Hướng dẫn', 'Cảnh báo', 'Bảo quản', 'Mô tả',
    ];

    headersVi.forEach((headerVi, idx) => {
        const cell = worksheet.getRow(9).getCell(idx + 1);
        cell.value = headerVi;
        cell.font = {
            bold: true,
            size: 11,
            color: { argb: colors.text },
            name: 'Segoe UI'
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'medium', color: { argb: colors.primary } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'thin', color: { argb: colors.border } },
            right: { style: 'thin', color: { argb: colors.border } },
        };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.warning },
        };
    });

    // Headers tiếng Anh - CHỈ 3 MÀU CHÍNH
    const headers: string[] = [
        'Group', 'Image', 'FullName', 'Unit', 'Brand', 'Supplier', 'Country',
        'SPH', 'CYL', 'ADD', 'Diameter', 'Design1', 'Design2',
        'Material', 'Refractive_Index', 'Uv', 'Coating', 'HMC', 'PHO', 'TIND'
        , 'Supplier_Warranty', 'Warranty', 'Warranty_Retail', 'Original_Price', 'Currency',
        'Retail_Price', 'Tax', 'Use', 'Guide', 'Warning', 'Preserve', 'Note',
    ];

    headers.forEach((header, idx) => {
        worksheet.getRow(10).getCell(idx + 1).value = header;
    });

    worksheet.getRow(10).eachCell((cell) => {
        const header = cell.value as string;

        // Phân loại theo 3 nhóm chính tương ứng với hướng dẫn
        // 🔵 Tự nhập tay - Thông tin cơ bản, dễ nhập
        const manualInputFields: string[] = [
            'Image', 'FullName', 'Unit', 'Original_Price', 'Note', 'Cost_Price', 'Retail_Price'
        ];

        // 🟡 Mã tự quy định - Các trường có danh mục cố định
        const codeRuleFields = [
            'Brand', 'Supplier', 'Country', 'Group', 'Design1', 'Design2',
            'Material', 'Refractive_Index', 'Uv', 'HMC', 'PHO', 'TIND', 'Warranty', 'Warranty_Retail',
            'Supplier_Warranty', 'Coating'
            , 'Currency'
        ];

        let fillColor = colors.manualInput; // Màu mặc định - xanh dương

        if (manualInputFields.includes(header)) {
            fillColor = colors.manualInput; // Xanh dương - Tự nhập tay
        } else if (codeRuleFields.includes(header)) {
            fillColor = colors.codeRule; // Vàng - Mã tự quy định
        }

        cell.font = {
            bold: true,
            size: 10,
            color: { argb: colors.white },
            name: 'Segoe UI'
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'thin', color: { argb: colors.border } },
            left: { style: 'thin', color: { argb: colors.border } },
            bottom: { style: 'medium', color: { argb: colors.primary } },
            right: { style: 'thin', color: { argb: colors.border } },
        };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor },
        };
    });

    worksheet.columns = [
        { key: 'group', width: 12 },
        { key: 'image', width: 15 },
        { key: 'fullname', width: 25 },
        { key: 'unit', width: 8 },
        { key: 'brand', width: 18 },
        { key: 'supplier', width: 20 },
        { key: 'country', width: 12 },
        { key: 'sph', width: 10 },
        { key: 'cyl', width: 10 },
        { key: 'add', width: 15 },
        { key: 'diameter', width: 15 },
        { key: 'design1', width: 14 },
        { key: 'design2', width: 14 },
        { key: 'material', width: 14 },
        { key: 'refractive_index', width: 14 },
        { key: 'uv', width: 12 },
        { key: 'coating', width: 14 },
        { key: 'hmc', width: 14 },
        { key: 'pho', width: 14 },
        { key: 'tind', width: 14 },
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
            cell.font = {
                size: 10,
                name: 'Segoe UI',
                color: { argb: colors.text }
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

    for (let i = 1; i <= 8; i++) {
        worksheet.getRow(i).outlineLevel = 1;
        worksheet.getRow(i).hidden = false;
    }
    worksheet.views = [
        { state: 'frozen', xSplit: 4, ySplit: 10 }
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `BangNhap_Mat_${new Date().toLocaleDateString()}.xlsx`);
}