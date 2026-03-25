export const StatusProductEnum = {
    NEW: 1,
    ACTIVE: 2,
    INACTIVE: 3,
} as const;

export type StatusProductEnum = (typeof StatusProductEnum)[keyof typeof StatusProductEnum];