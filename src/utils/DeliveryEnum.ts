const DeliveryEnum = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    INSPECTING: 'INSPECTING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NOT_CHECKED: 'NOT_CHECKED',
    CHECKING: 'CHECKING',
    CHECKED: 'CHECKED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
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
    APPROVED: 'Đã duyệt OTK',
    REJECTED: 'Từ chối OTK',
} as const;

export type DeliveryEnumType = typeof DeliveryEnum[keyof typeof DeliveryEnum];

export default DeliveryEnum;