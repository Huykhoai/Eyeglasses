const DeliveryEnum = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    INSPECTING: 'INSPECTING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NOT_CHECKED: 'NOT_CHECKED',
    CHECKING: 'CHECKING',
    CHECKED: 'CHECKED',
} as const;

export const DeliveryEnumLabel = {
    DRAFT: 'Bản nháp',
    PENDING: 'Chờ hàng về',
    INSPECTING: 'Đang kiểm kê',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    NOT_CHECKED: 'Chưa kiểm',
    CHECKING: 'Đang kiểm',
    CHECKED: 'Đã kiểm',
} as const;

export type DeliveryEnumType = typeof DeliveryEnum[keyof typeof DeliveryEnum];

export default DeliveryEnum;