import { useMemo } from 'react';

export interface ConfigCategoryItem {
    name: string;
    url: string;
}

export interface ConfigCategory {
    name: string;
    items: ConfigCategoryItem[];
}

export const useConfigData = () => {
    const generalCategory: ConfigCategory[] = useMemo(() => [
        { name: "Hàng hóa", items: [{ name: "Bảo hành", url: "/warranty" }, { name: "Thương hiệu", url: "/brand" }, { name: "Nhóm", url: "/group" }] },
        { name: "Hệ thống", items: [{ name: "Thuế", url: "/tax" }, { name: "Quốc gia", url: "/country" }, { name: "Tiền tệ", url: "/currency" }] }
    ], []);

    const specificCategory: ConfigCategory[] = useMemo(() => [
        { name: "Chất liệu", items: [{ name: "Chất liệu", url: "/material" }, { name: "Chiết suất", url: "/refractive-index" }] },
        { name: "Thiết kế", items: [{ name: "Thiết kế", url: "/design" }, { name: "Hình dạng", url: "/shape" }, { name: "Kiểu gọng", url: "/frame" }, { name: "Càng", url: "/temple" }, { name: "Loại gọng", url: "/frame-type" }] },
        { name: "Tích hợp", items: [{ name: "UV", url: "/uv" }, { name: "Lớp phủ", url: "/coating" }, { name: "VE", url: "/ve" }, { name: "Màu sắc", url: "/color" }] }
    ], []);

    return { generalCategory, specificCategory };
};
