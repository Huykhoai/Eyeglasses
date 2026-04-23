export const NotificationEnum = {
    QUOTATION_CREATED: "QUOTATION_CREATED",
    QUOTATION_APPROVED: "QUOTATION_APPROVED",
    QUOTATION_REJECTED: "QUOTATION_REJECTED",
    CONTRACT_CREATED: "CONTRACT_CREATED",
    CONTRACT_APPROVED: "CONTRACT_APPROVED",
    DELIVERY_SCHEDULED: "DELIVERY_SCHEDULED",
    OTK_PASSED: "OTK_PASSED",
    INVENTORY_RECEIVED: "INVENTORY_RECEIVED"
} as const;

export const NotificationTitleEnum = {
    [NotificationEnum.QUOTATION_CREATED]: "Tạo báo giá",
    [NotificationEnum.QUOTATION_APPROVED]: "Phê duyệt báo giá",
    [NotificationEnum.QUOTATION_REJECTED]: "Từ chối báo giá",
    [NotificationEnum.CONTRACT_CREATED]: "Tạo hợp đồng",
    [NotificationEnum.CONTRACT_APPROVED]: "Phê duyệt hợp đồng",
    [NotificationEnum.DELIVERY_SCHEDULED]: "Lên lịch giao hàng",
    [NotificationEnum.OTK_PASSED]: "Kiểm tra OTK",
    [NotificationEnum.INVENTORY_RECEIVED]: "Nhận hàng tồn kho"
}

export type NotificationEnumType = typeof NotificationEnum[keyof typeof NotificationEnum];

export const StatusNotification = {
    [NotificationEnum.QUOTATION_CREATED]: "success",
    [NotificationEnum.QUOTATION_APPROVED]: "success",
    [NotificationEnum.QUOTATION_REJECTED]: "error",
    [NotificationEnum.CONTRACT_CREATED]: "success",
    [NotificationEnum.CONTRACT_APPROVED]: "success",
    [NotificationEnum.DELIVERY_SCHEDULED]: "success",
    [NotificationEnum.OTK_PASSED]: "success",
    [NotificationEnum.INVENTORY_RECEIVED]: "success"
} as const;

export type StatusNotificationType = typeof StatusNotification[keyof typeof StatusNotification];
