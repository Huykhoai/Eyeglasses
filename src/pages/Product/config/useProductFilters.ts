import { useBrand, useCountry, useGroup, useRefractiveIndex, useSupplier } from "@/hooks/UseAllData";
import type { ProductType } from "../types/product";
import type { FilterItem } from "@/components/common/MultiFilterBar/MultiFilterBar";
import { useMemo } from "react";

const useProductFilters = (productType: ProductType): FilterItem[] => {
    const { data: groups } = useGroup();
    const { data: brands } = useBrand();
    const { data: suppliers } = useSupplier();
    const { data: countries } = useCountry();
    const { data: refractiveIndexes } = useRefractiveIndex();

    return useMemo(() => {
        const baseFilters: FilterItem[] = [
            { key: 'cid', label: 'Mã viết tắt', type: 'text' },
            { key: 'name', label: 'Tên đầy đủ', type: 'text' },
            { key: 'group', label: 'Nhóm', type: 'select', options: groups?.map((item) => ({ id: item.id, label: item.name })) || [] },
            { key: 'brand', label: 'Thương hiệu', type: 'select', options: brands?.map((item) => ({ id: item.id, label: item.name })) || [] },
            { key: 'supplier', label: 'Nhà cung cấp', type: 'select', options: suppliers?.map((item) => ({ id: item.id, label: item.name })) || [] },
            { key: 'country', label: 'Xuất xứ', type: 'select', options: countries?.map((item) => ({ id: item.id, label: item.name })) || [] },
            { key: 'status', label: 'Trạng thái', type: 'select', options: [{ id: 1, label: 'Mới' }, { id: 2, label: 'Đang lưu hành' }, { id: 3, label: 'Ngừng lưu hành' }] },
        ];

        switch (productType) {
            case "LENS":
                return [
                    ...baseFilters,
                    { key: 'refractiveIndex', label:'Chiết suất', type: 'select', options: refractiveIndexes?.map((item) => ({ id: item.id, label: item.name })) || []},
                    { key: 'sph', label: 'SPH', type: 'number' },
                    { key: 'cyl', label: 'CYL', type: 'number' },
                ];
            case "FRAME":
                return [
                    ...baseFilters,
                    { key: 'model', label: 'Model', type: 'text' },
                    { key: 'serial', label: 'Serial', type: 'text' },
                    { key: 'colorCode', label: 'Mã màu', type: 'text' },
                ];
            default:
                return baseFilters;
        }
    }, [productType, groups, brands, suppliers, countries]);
};

export default useProductFilters;
