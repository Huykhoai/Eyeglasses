export const formatPrice = (value: number | null | undefined, currency?: string): string => {
    if (value == null) return '-';
    return value.toLocaleString('vi-VN') + ' ' + (currency || '');
};