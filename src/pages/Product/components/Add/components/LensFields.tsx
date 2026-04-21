import React from "react";
import { LayoutGrid, Label } from "./commonUI";
import { RHFAutoComplete } from "../../../../../components/common/TextField/RHFComponents";
import { useDesign, useRefractiveIndex, useMaterial, useUv, useCoating, useColor } from "@/hooks/UseAllData";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "@/components/common/TextField/RHFTextField";

const LensFields: React.FC = () => {
    const { data: designs } = useDesign();
    const { data: refractiveIndexs } = useRefractiveIndex();
    const { data: materials } = useMaterial();
    const { data: uvs } = useUv();
    const { data: coatings } = useCoating();
    const { data: colors } = useColor();
    const { getValues } = useFormContext();
    const id = getValues("id");

    return (
        <div className="body-card gap-2">
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Thiết kế
            </div>
            <div className="body-card-grid">
                <LayoutGrid>
                    <Label label="SPH (-/+) " />
                    <RHFTextField
                        name="lensAttribute.sph"
                        type="number"
                        props={{ maxWidth: "15vw" }}
                        placeholder="Nhập SPH"
                        rules={{
                            required: "SPH là bắt buộc",
                            pattern: {
                                value: /^[-+]?[0-9]*\.?[0-9]+$/,
                                message: "SPH không hợp lệ (VD: -2.50, +1.25)"
                            }
                        }}
                    />
                </LayoutGrid>
                <div className="d-grid align-items-center" style={{ gridTemplateColumns: "1fr 2.3fr" }}>
                    <Label label="Đường kính" />
                    <RHFTextField
                        name="lensAttribute.diameter"
                        type="number"
                        props={{ maxWidth: "15vw" }}
                        placeholder="Nhập đường kính (milimet)"
                        rules={{
                            required: "Đường kính là bắt buộc",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "Đường kính không hợp lệ"
                            }
                        }}
                    />
                </div>
                <LayoutGrid>
                    <Label label="CYL" />
                    <RHFTextField
                        name="lensAttribute.cyl"
                        type="number"
                        props={{ maxWidth: "15vw" }}
                        placeholder="Nhập CYL"
                        rules={{
                            required: "CYL là bắt buộc",
                            pattern: {
                                value: /^[-+]?[0-9]*\.?[0-9]+$/,
                                message: "CYL không hợp lệ"
                            }
                        }}
                    />
                </LayoutGrid>
                <div className="d-grid align-items-center" style={{ gridTemplateColumns: "1fr 2.3fr" }}>
                    <Label label="ADD" />
                    <RHFTextField
                        name="lensAttribute.lenAdd"
                        type="number"
                        props={{ maxWidth: "15vw" }}
                        placeholder="Nhập ADD"
                        rules={{
                            required: "ADD là bắt buộc",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "ADD không hợp lệ"
                            }
                        }}
                    />
                </div>
                <RHFAutoComplete
                    className="mt-2"
                    options={designs || []}
                    name="lensAttribute.design1"
                    placeholder="Thiết kế 1"
                    rules={{
                        required: "Thiết kế 1 là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={designs || []}
                    name="lensAttribute.design2"
                    placeholder="Thiết kế 2"
                    rules={{
                        required: "Thiết kế 2 là bắt buộc",
                    }}
                />
            </div>
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Chất liệu
            </div>
            <div className="body-card-grid">
                <RHFAutoComplete
                    className="mt-2"
                    options={refractiveIndexs || []}
                    name="lensAttribute.refractiveIndex"
                    placeholder="Chiết suất"
                    disabled={!!id}
                    rules={{
                        required: "Chiết suất là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={materials || []}
                    name="lensAttribute.material"
                    placeholder="Vật liệu"
                    rules={{
                        required: "Vật liệu là bắt buộc",
                    }}
                />
            </div>
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Tích hợp
            </div>
            <div className="body-card-grid">
                <RHFAutoComplete
                    className="mt-2"
                    options={uvs || []}
                    name="lensAttribute.uv"
                    placeholder="UV"
                    rules={{
                        required: "UV là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={colors || []}
                    name="lensAttribute.phoColor"
                    placeholder="Photochromic (Đổi màu)"
                    rules={{
                        required: "Photochromic là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={colors || []}
                    name="lensAttribute.hmcColor"
                    placeholder="HMC (Phủ đa năng)"
                    rules={{
                        required: "HMC là bắt buộc",
                    }}
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={colors || []}
                    name="lensAttribute.tintColor"
                    placeholder="Tint (Màu nhuộm)"
                    rules={{
                        required: "Tint là bắt buộc",
                    }}
                />
            </div>
            <RHFAutoComplete
                className="mt-2"
                options={coatings || []}
                name="lensAttribute.coating"
                placeholder="Lớp phủ"
                rules={{
                    required: "Lớp phủ là bắt buộc",
                }}
            />
        </div>
    );
};

export default React.memo(LensFields);