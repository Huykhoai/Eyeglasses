import { type NavButton } from "@/components/Navbar/Navbar";

export const navButtons: NavButton[] = [
    { name: 'Tổng quan', url: '/dashboard' },
    {
        name: 'Sản phẩm',
        children: [
            { name: 'Danh sách sản phẩm', url: '/products' },
            { name: 'Thêm sản phẩm mới', url: '/products/create' },
            {
                name: 'Chuyên mục',
                children: [
                    { name: 'Gọng kính', url: '/categories/frames' },
                    { name: 'Tròng kính', url: '/categories/lenses' },
                    { name: 'Kính áp tròng', url: '/categories/contacts' }
                ]
            }
        ]
    },
    {
        name: 'Đơn hàng',
        children: [
            { name: 'Yêu cầu báo giá', url: '/orders/request-quote' },
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
    { name: 'Nhà cung cấp', url: '/suppliers' },
    { name: 'Khách hàng', url: '/customers' },
    { name: 'Phòng ban',
        children: [
            { name: 'Phòng ban', url: '/departments'},
            { name: 'Nhân viên', url: '/employees'}
        ]
    },
    { name: 'Cấu hình', url: '/config' }
];
