export const WarehouseEnum = {
    DRAFT: "DRAFT",
    IMPORTED: "IMPORTED",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    TYPE_ACCEPTABLE: "TYPE_ACCEPTABLE",
    TYPE_DEFECTIVE: "TYPE_DEFECTIVE"
}

export const WarehouseEnumLabel = {
    [WarehouseEnum.DRAFT]: "Nháp",
    [WarehouseEnum.IMPORTED]: "Đã nhập",
    [WarehouseEnum.ACTIVE]: "Đang hoạt động",
    [WarehouseEnum.INACTIVE]: "Ngưng hoạt động",
    [WarehouseEnum.TYPE_ACCEPTABLE]: "Kho hàng",
    [WarehouseEnum.TYPE_DEFECTIVE]: "Kho hỏng"
}
export type WarehouseEnum = (typeof WarehouseEnum)[keyof typeof WarehouseEnum];
