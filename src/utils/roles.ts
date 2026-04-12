export const Position = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    STAFF_XNK: 'STAFF_XNK',
    STAFF_OTK: 'STAFF_OTK',
    STAFF_WH: 'STAFF_WH',
    STAFF_HR: 'STAFF_HR',
} as const;

export const Roles = {
    ADMIN: 'ROLE_ADMIN',
    MANAGE_XNK: 'ROLE_MANAGE_XNK',
    MANAGE_OTK: 'ROLE_MANAGE_OTK',
    MANAGE_WH: 'ROLE_MANAGE_WH',
    MANAGE_HR: 'ROLE_MANAGE_HR',
    STAFF_VIEW: 'ROLE_STAFF_VIEW',
    STAFF_ADD: 'ROLE_STAFF_ADD',
    STAFF_EDIT: 'ROLE_STAFF_EDIT',
    STAFF_DELETE: 'ROLE_STAFF_DELETE',
} as const;

export const positionLabel: Record<string, string> = {
    [Position.ADMIN]: 'Quản trị viên',
    [Position.MANAGER]: 'Trưởng phòng',
    [Position.STAFF_XNK]: 'Nhân viên xuất nhập khẩu',
    [Position.STAFF_OTK]: 'Nhân viên OTK',
    [Position.STAFF_WH]: 'Nhân viên kho',
    [Position.STAFF_HR]: 'Nhân viên nhân sự',
} as const;

export const roleLabels: Record<string, string> = {
    [Roles.ADMIN]: 'Quản trị viên',
    [Roles.MANAGE_XNK]: 'Trưởng phòng xuất nhập khẩu',
    [Roles.MANAGE_OTK]: 'Trưởng phòng kiểm soát chất lượng (OTK)',
    [Roles.MANAGE_WH]: 'Trưởng phòng kho',
    [Roles.MANAGE_HR]: 'Trưởng phòng nhân sự',
    [Roles.STAFF_VIEW]: 'Nhân viên xem',
    [Roles.STAFF_ADD]: 'Nhân viên thêm',
    [Roles.STAFF_EDIT]: 'Nhân viên sửa',
    [Roles.STAFF_DELETE]: 'Nhân viên xóa',
};
export type PositionType = typeof Position[keyof typeof Position];
export type RolesType = typeof Roles[keyof typeof Roles];
