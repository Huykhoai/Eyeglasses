const DeliveryEnum = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    INSPECTING: 'INSPECTING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export const DeliveryEnumLabel = {
    DRAFT: 'Bản nháp',
    PENDING: 'Chờ hàng về',
    INSPECTING: 'Đang kiểm kê',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
} as const;

export type DeliveryEnumType = typeof DeliveryEnum[keyof typeof DeliveryEnum];

export default DeliveryEnum;