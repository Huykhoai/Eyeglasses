import { type NavButton } from "@/components/Navbar/Navbar";

export const navButtons: NavButton[] = [
    { name: 'Tổng quan', url: '/dashboard' },
    {
        name: 'Sản phẩm',
        children: [
            { name: 'Danh sách sản phẩm', url: '/xnk/products?type=lens' },
            {
                name: 'Thêm sản phẩm mới', children: [
                    { name: 'Thêm thủ công', url: '/xnk/products/add' },
                    { name: 'Thêm bằng Excel', url: '/xnk/products/add-by-excel' }
                ]
            },
        ]
    },
    {
        name: 'Đơn hàng',
        children: [
            { name: 'Yêu cầu báo giá', url: '/xnk/orders/request-quote' },
            { name: 'Hợp đồng', url: '/xnk/contracts' },
            { name: 'Lịch giao hàng', url: '/xnk/delivery-schedule' }
        ]
    },
    {
        name: 'OTK', url: '/otk'
    },
    {
        name: 'Kho hàng',
        children: [
            { name: 'Phiếu nhập kho', url: '/warehouse/inventory-receipts' },
            { name: 'Kho hàng', url: '/warehouse' }
        ]
    },
    { name: 'Nhà cung cấp', url: '/xnk/suppliers' },
    {
        name: 'Phòng ban',
        children: [
            { name: 'Phòng ban', url: '/hr/departments' },
            { name: 'Nhân sự', url: '/hr/employees' }
        ]
    },
    { name: 'Phê duyệt', url: '/approvals?type=purchase-quotations' },
    { name: 'Cấu hình', url: '/xnk/config' }
];
