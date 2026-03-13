import React from "react";
import { Label, LayoutGrid } from "./commonUI";
import { useFrame, useFrameType, useVe, useShape, useTemple, useMaterial, useCoating, useColor } from "@/hooks/UseAllData";
import { RHFTextField, RHFAutoComplete } from "../../../../../components/common/TextField/RHFComponents";
import { useFormContext } from "react-hook-form";

const FrameFields: React.FC = () => {
    const { data: frames } = useFrame();
    const { data: frameTypes } = useFrameType();
    const { data: ve } = useVe();
    const { data: shapes } = useShape();
    const { data: temples } = useTemple();
    const { data: materials } = useMaterial();
    const { data: coatings } = useCoating();
    const { data: colors } = useColor();
    const { getValues } = useFormContext();
    const id = getValues("id");
    return (
        <div className="body-card gap-2">
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Thông tin Gọng
            </div>
            <div className="body-card-grid">
                <LayoutGrid>
                    <Label label="Phiên bản" />
                    <RHFTextField
                        name="frameAttribute.season"
                        placeholder="Nhập phiên bản"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Mã màu" />
                    <RHFTextField
                        name="frameAttribute.colorCode"
                        placeholder="Nhập mã màu"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Model" />
                    <RHFTextField
                        name="frameAttribute.model"
                        placeholder="Nhập model"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                        disabled={!!id}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Serial" />
                    <RHFTextField
                        name="frameAttribute.serial"
                        placeholder="Nhập serial"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
            </div>
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Thiết kế
            </div>
            <div className="body-card-grid">
                <RHFAutoComplete
                    className="mt-1"
                    options={frames || []}
                    name="frameAttribute.frame"
                    placeholder="Kiểu gọng"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={[{ id: 1, name: "Nam" }, { id: 2, name: "Nữ" }, { id: 3, name: "Unisex" }]}
                    name="frameAttribute.gender"
                    placeholder="Giới tính"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={frameTypes || []}
                    name="frameAttribute.frameType"
                    placeholder="Loại gọng"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={ve || []}
                    name="frameAttribute.ve"
                    placeholder="Ve"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={shapes || []}
                    name="frameAttribute.shape"
                    placeholder="Hình dạng"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={temples || []}
                    name="frameAttribute.temple"
                    placeholder="Chuôi càng"
                />
            </div>
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Chất liệu
            </div>
            <div className="body-card-grid">
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialFront"
                    placeholder="Mặt trước"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialTempleTip"
                    placeholder="Chuôi càng"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialTemple"
                    placeholder="Càng"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialLens"
                    placeholder="Tròng kính"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialVe"
                    placeholder="Ve kính"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={coatings || []}
                    name="frameAttribute.coating"
                    placeholder="Lớp mạ"
                />
            </div>
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Màu sắc
            </div>
            <div className="body-card-grid">
                <RHFAutoComplete
                    className="mt-1"
                    options={colors || []}
                    name="frameAttribute.colorFront"
                    placeholder="Mặt trước"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={colors || []}
                    name="frameAttribute.colorTemple"
                    placeholder="Càng kính"
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={colors || []}
                    name="frameAttribute.colorLens"
                    placeholder="Tròng kính"
                />
            </div>
            <div className="d-flex justify-content-center align-items-center"
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Kích thước
            </div>
            <div className="body-card-grid">
                <LayoutGrid>
                    <Label label="Dài gọng" />
                    <RHFTextField
                        name="frameAttribute.templeLength"
                        placeholder="Nhập dài gọng"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Rộng mắt" />
                    <RHFTextField
                        name="frameAttribute.lensWidth"
                        placeholder="Nhập độ rộng mắt"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Dài mắt" />
                    <RHFTextField
                        name="frameAttribute.lensHeight"
                        placeholder="Nhập độ dài mắt"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Dài cầu" />
                    <RHFTextField
                        name="frameAttribute.bridgeWidth"
                        placeholder="Nhập độ dài cầu"
                        props={{ type: 'text', style: { maxWidth: "15vw" } }}
                    />
                </LayoutGrid>
            </div>
        </div>
    );
}

export default React.memo(FrameFields);