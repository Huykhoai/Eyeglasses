import React from "react";
import { useBrand, useCountry, useCurrency, useWarranty, useSupplier } from "@/hooks/UseAllData";
import { Label } from "./commonUI";
import { RHFAutoComplete } from "../../../../../components/common/TextField/RHFComponents";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "@/components/common/TextField/RHFTextField";

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
                        rules={{
                            required: "Thương hiệu là bắt buộc",
                        }}
                    />
                    <RHFAutoComplete
                        options={countries}
                        name="country"
                        placeholder="Xuất xứ"
                        rules={{
                            required: "Xuất xứ là bắt buộc",
                        }}
                    />
                </div>
                <RHFAutoComplete
                    className="mt-2"
                    options={suppliers}
                    name="supplier"
                    placeholder="Nhà cung cấp"
                    rules={{
                        required: "Nhà cung cấp là bắt buộc",
                    }}
                />
            </div>
            <div className="body-card mt-2 gap-2">
                <LayoutGrid>
                    <Label label="Thuế" />
                    <RHFTextField
                        name="tax"
                        placeholder="Nhập thuế"
                        type="number"
                        rules={{
                            required: "Thuế là bắt buộc",
                            pattern: {
                                value: /^[0-9]*\.[0-9]+$/,
                                message: "Thuế không hợp lệ"
                            }
                        }}
                    />
                </LayoutGrid>
                <div className="d-flex justify-content-between ">
                    <div className={`d-grid gap-2`} style={{ gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
                        <Label label="Giá nguyên tệ" />
                        <RHFTextField
                            name="originalPrice"
                            placeholder="Nhập giá nguyên tệ"
                            type="number"
                            rules={{
                                required: "Giá nguyên tệ là bắt buộc",
                                pattern: {
                                    value: /^[0-9]*\.?[0-9]+$/,
                                    message: "Giá nguyên tệ không hợp lệ"
                                }
                            }}
                        />
                    </div>
                    <RHFAutoComplete
                        options={currencies || []}
                        name="currency"
                        placeholder="Đơn vị"
                        props={{ maxWidth: "13vw" }}
                        rules={{
                            required: "Đơn vị là bắt buộc",
                        }}
                    />
                </div>
                <LayoutGrid>
                    <Label label="Giá bán lẻ" />
                    <RHFTextField
                        name="retailPrice"
                        placeholder="Nhập giá bán lẻ"
                        type="number"
                        rules={{
                            required: "Giá bán lẻ là bắt buộc",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "Giá bán lẻ không hợp lệ"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Mô tả" />
                    <RHFTextField
                        name="note"
                        placeholder="Nhập mô tả"
                        multiline rows={4}
                        rules={{
                            required: "Mô tả là bắt buộc",
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Công dụng" />
                    <RHFTextField
                        name="uses"
                        placeholder="Nhập công dụng"
                        multiline rows={4}
                        rules={{
                            required: "Công dụng là bắt buộc",
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Hướng dẫn" />
                    <RHFTextField
                        name="guide"
                        placeholder="Nhập hướng dẫn sử dụng"
                        multiline rows={4}
                        rules={{
                            required: "Hướng dẫn sử dụng là bắt buộc",
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Cảnh báo" />
                    <RHFTextField
                        name="warning"
                        placeholder="Nhập cảnh báo"
                        multiline rows={4}
                        rules={{
                            required: "Cảnh báo là bắt buộc",
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Bảo quản" />
                    <RHFTextField
                        name="preserve"
                        placeholder="Nhập cách bảo quản"
                        multiline rows={4}
                        rules={{
                            required: "Cách bảo quản là bắt buộc",
                        }}
                    />
                </LayoutGrid>

                <RHFAutoComplete
                    options={warranties || []}
                    name="warrantySupplier"
                    placeholder="Bảo hành hãng"
                    rules={{
                        required: "Bảo hành hãng là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    options={warranties || []}
                    name="warranty"
                    placeholder="Bảo hành công ty"
                    rules={{
                        required: "Bảo hành công ty là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    options={warranties || []}
                    name="warrantyRetail"
                    placeholder="Bảo hành bán lẻ"
                    rules={{
                        required: "Bảo hành bán lẻ là bắt buộc",
                    }}
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
