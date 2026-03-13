import React from "react";
import { useBrand, useCountry, useCurrency, useWarranty, useSupplier } from "@/hooks/UseAllData";
import { Label } from "./commonUI";
import { RHFTextField, RHFTextArea, RHFAutoComplete } from "../../../../../components/common/TextField/RHFComponents";
import { useFormContext } from "react-hook-form";

const InformationProductRight: React.FC = () => {
    const { getValues } = useFormContext();
    const { data: brands = [] } = useBrand();
    const { data: suppliers = [] } = useSupplier();
    const { data: countries = [] } = useCountry();
    const { data: currencies = [] } = useCurrency();
    const { data: warranties = [] } = useWarranty();
    const id = getValues("id");

    return (
        <div>
            <div className="body-card">
                <div className="body-card-grid">
                    <RHFAutoComplete
                        options={brands}
                        name="brand"
                        placeholder="Thương hiệu"
                        disabled={!!id}
                    />
                    <RHFAutoComplete
                        options={countries}
                        name="country"
                        placeholder="Xuất xứ"
                    />
                </div>
                <RHFAutoComplete
                    className="mt-2"
                    options={suppliers}
                    name="supplier"
                    placeholder="Nhà cung cấp"
                />
            </div>
            <div className="body-card mt-2 gap-2">
                <div className="d-flex justify-content-between gap-1">
                    <div className={`d-grid gap-2`} style={{ gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
                        <Label label="Giá nguyên tệ" />
                        <RHFTextField name="originalPrice" placeholder="Nhập giá nguyên tệ" />
                    </div>
                    <RHFAutoComplete
                        options={currencies || []}
                        name="currency"
                        placeholder="Đơn vị"
                        props={{ maxWidth: "12vw" }}
                    />
                </div>
                <LayoutGrid>
                    <Label label="Mô tả" />
                    <RHFTextArea name="note" placeholder="Nhập mô tả" />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Công dụng" />
                    <RHFTextArea name="uses" placeholder="Nhập công dụng" />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Hướng dẫn" />
                    <RHFTextArea name="guide" placeholder="Nhập hướng dẫn sử dụng" />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Cảnh báo" />
                    <RHFTextArea name="warning" placeholder="Nhập cảnh báo" />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Bảo quản" />
                    <RHFTextArea name="preserve" placeholder="Nhập cách bảo quản" />
                </LayoutGrid>

                <RHFAutoComplete
                    options={warranties || []}
                    name="warrantySupplier"
                    placeholder="Bảo hành hãng"
                />
                <RHFAutoComplete
                    options={warranties || []}
                    name="warranty"
                    placeholder="Bảo hành công ty"
                />
                <RHFAutoComplete
                    options={warranties || []}
                    name="warrantyRetail"
                    placeholder="Bảo hành bán lẻ"
                />
            </div>
        </div>
    );
};

const LayoutGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`d-grid gap-2`} style={{ gridTemplateColumns: '1fr 5.1fr', alignItems: 'center' }}>
            {children}
        </div>
    );
};
export default React.memo(InformationProductRight);
