import { type NavButton } from "@/components/Navbar/Navbar";

export const navButtons: NavButton[] = [
    { name: 'Tổng quan', url: '/dashboard' },
    {
        name: 'Sản phẩm',
        children: [
            { name: 'Danh sách sản phẩm', url: '/xnk/products?type=lens' },
            { name: 'Thêm sản phẩm mới', children: [
                { name: 'Thêm thủ công', url: '/xnk/products/add' },
                { name: 'Thêm bằng Excel', url: '/xnk/products/add-by-excel' }
            ] },
        ]
    },
    {
        name: 'Đơn hàng',
        children: [
            { name: 'Yêu cầu báo giá', url: '/xnk/orders/request-quote' },
            { name: 'Đơn hàng', url: '/orders' },
            { name: 'Hợp đồng', url: '/contracts' },
            { name: 'Lịch giao hàng', url: '/delivery-schedule' }
        ]
    },
    {
        name: 'Kho hàng',
        children: [
            { name: 'Nhập kho', url: '/warehouse/import' },
            { name: 'Xuất kho', url: '/warehouse/export' },
            { name: 'Kiểm kê', url: '/warehouse/audit' }
        ]
    },
    { name: 'Nhà cung cấp', url: '/xnk/suppliers' },
    { name: 'Khách hàng', url: '/customers' },
    { name: 'Phòng ban',
        children: [
            { name: 'Phòng ban', url: '/hr/departments'},
            { name: 'Nhân sự', url: '/hr/employees'}
        ]
    },
    { name: 'Cấu hình', url: '/xnk/config' }
];
