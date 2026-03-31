export const Roles = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    XNK: 'XNK',
    OTK: 'OTK',
    KE_TOAN: 'KE_TOAN',
    
} as const;

export type RolesType = typeof Roles[keyof typeof Roles];
