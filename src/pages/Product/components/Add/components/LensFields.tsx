import React from "react";
import { LayoutGrid, Label } from "./commonUI";
import { RHFTextField, RHFAutoComplete } from "../../../../../components/common/TextField/RHFComponents";
import { useDesign, useRefractiveIndex, useMaterial, useUv, useCoating, useColor } from "@/hooks/UseAllData";
import { useFormContext } from "react-hook-form";

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
                        props={{ type: 'number', style: { maxWidth: "15vw" } }}
                        placeholder="Nhập SPH"
                    />
                </LayoutGrid>
                <div className="d-grid align-items-center" style={{ gridTemplateColumns: "1fr 2.3fr" }}>
                    <Label label="Đường kính" />
                    <RHFTextField
                        name="lensAttribute.diameter"
                        props={{ type: 'number', style: { maxWidth: "15vw" } }}
                        placeholder="Nhập đường kính (milimet)"
                    />
                </div>
                <LayoutGrid>
                    <Label label="CYL" />
                    <RHFTextField
                        name="lensAttribute.cyl"
                        props={{ type: 'number', style: { maxWidth: "15vw" } }}
                        placeholder="Nhập CYL"
                    />
                </LayoutGrid>
                <div className="d-grid align-items-center" style={{ gridTemplateColumns: "1fr 2.3fr" }}>
                    <Label label="ADD" />
                    <RHFTextField
                        name="lensAttribute.lenAdd"
                        props={{ type: 'number', style: { maxWidth: "15vw" } }}
                        placeholder="Nhập ADD"
                    />
                </div>
                <RHFAutoComplete
                    className="mt-2"
                    options={designs || []}
                    name="lensAttribute.design1"
                    placeholder="Thiết kế 1"
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={designs || []}
                    name="lensAttribute.design2"
                    placeholder="Thiết kế 2"
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
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={materials || []}
                    name="lensAttribute.material"
                    placeholder="Vật liệu"
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
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={colors || []}
                    name="lensAttribute.phoColor"
                    placeholder="Photochromic (Đổi màu)"
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={colors || []}
                    name="lensAttribute.hmcColor"
                    placeholder="HMC (Phủ đa năng)"
                />
                <RHFAutoComplete
                    className="mt-2"
                    options={colors || []}
                    name="lensAttribute.tintColor"
                    placeholder="Tint (Màu nhuộm)"
                />
            </div>
            <RHFAutoComplete
                className="mt-2"
                options={coatings || []}
                name="lensAttribute.coating"
                placeholder="Lớp phủ"
            />
        </div>
    );
};

export default React.memo(LensFields);