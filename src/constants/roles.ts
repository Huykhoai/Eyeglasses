export const Department = {
    ADMIN: 'ADMIN',
    XUAT_NHAP_KHAU: 'XNK',
    OTK: 'OTK',
    KE_TOAN: 'KE_TOAN',
} as const;

export type DepartmentType = typeof Department[keyof typeof Department];
