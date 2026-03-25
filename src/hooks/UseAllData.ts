import type { ConfigLimitResponse } from "@/types"
import { useFetchAll } from "./GenericAllData"


export const useWarranty = () =>
    useFetchAll<ConfigLimitResponse[]>(['warranty'], "/api/warranty/all")

export const useBrand = () =>
    useFetchAll<ConfigLimitResponse[]>(['brand'], "/api/brand/all")

export const useGroup = () =>
    useFetchAll<ConfigLimitResponse[]>(['group'], "/api/group/all")

export const useGroupType = () =>
    useFetchAll<ConfigLimitResponse[]>(['group-type'], "/api/group-type/all")

export const useTax = () =>
    useFetchAll<ConfigLimitResponse[]>(['tax'], "/api/tax/all")

export const useCountry = () =>
    useFetchAll<ConfigLimitResponse[]>(['country'], "/api/country/all")

export const useCurrency = () =>
    useFetchAll<ConfigLimitResponse[]>(['currency'], "/api/currency/all")

export const useMaterial = () =>
    useFetchAll<ConfigLimitResponse[]>(['material'], "/api/material/all")

export const useRefractiveIndex = () =>
    useFetchAll<ConfigLimitResponse[]>(['refractive-index'], "/api/refractive-index/all")

export const useDesign = () =>
    useFetchAll<ConfigLimitResponse[]>(['design'], "/api/design/all")

export const useShape = () =>
    useFetchAll<ConfigLimitResponse[]>(['shape'], "/api/shape/all")

export const useFrame = () =>
    useFetchAll<ConfigLimitResponse[]>(['frame'], "/api/frame/all")

export const useTemple = () =>
    useFetchAll<ConfigLimitResponse[]>(['temple'], "/api/temple/all")

export const useFrameType = () =>
    useFetchAll<ConfigLimitResponse[]>(['frame-type'], "/api/frame-type/all")

export const useUv = () =>
    useFetchAll<ConfigLimitResponse[]>(['uv'], "/api/uv/all")

export const useCoating = () =>
    useFetchAll<ConfigLimitResponse[]>(['coating'], "/api/coating/all")

export const useVe = () =>
    useFetchAll<ConfigLimitResponse[]>(['ve'], "/api/ve/all")

export const useColor = () =>
    useFetchAll<ConfigLimitResponse[]>(['color'], "/api/color/all")

export const useSupplier = () =>
    useFetchAll<ConfigLimitResponse[]>(['supplier'], "/api/supplier/all")

export const useStatusProduct = () =>
    useFetchAll<ConfigLimitResponse[]>(['status-product'], "/api/status-product/all")

export const useDepartmentAll = () =>
    useFetchAll<ConfigLimitResponse[]>(['department-all'], "/api/department/all")

export const useEmployeeAll = () =>
    useFetchAll<ConfigLimitResponse[]>(['employee-all'], "/api/employee/all")
