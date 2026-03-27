export const Roles = {
    ADMIN: 'ADMIN',
    XUAT_NHAP_KHAU: 'XNK',
    OTK: 'OTK',
    KE_TOAN: 'KE_TOAN',
} as const;

export type RolesType = typeof Roles[keyof typeof Roles];
