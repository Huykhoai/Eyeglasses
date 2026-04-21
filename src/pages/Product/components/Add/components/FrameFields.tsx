import React from "react";
import { Label, LayoutGrid } from "./commonUI";
import { useFrame, useFrameType, useVe, useShape, useTemple, useMaterial, useCoating, useColor } from "@/hooks/UseAllData";
import { RHFAutoComplete } from "../../../../../components/common/TextField/RHFComponents";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "@/components/common/TextField/RHFTextField";

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
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Phiên bản là bắt buộc",
                            maxLength: {
                                value: 50,
                                message: "Phiên bản không được vượt quá 50 ký tự"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Mã màu" />
                    <RHFTextField
                        name="frameAttribute.colorCode"
                        placeholder="Nhập mã màu"
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Mã màu là bắt buộc",
                            maxLength: {
                                value: 100,
                                message: "Mã màu không được vượt quá 100 ký tự"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Model" />
                    <RHFTextField
                        name="frameAttribute.model"
                        placeholder="Nhập model"
                        props={{ style: { maxWidth: "15vw" } }}
                        disabled={!!id}
                        rules={{
                            required: "Model là bắt buộc",
                            maxLength: {
                                value: 50,
                                message: "Model không được vượt quá 50 ký tự"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Serial" />
                    <RHFTextField
                        name="frameAttribute.serial"
                        placeholder="Nhập serial"
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Serial là bắt buộc",
                            maxLength: {
                                value: 50,
                                message: "Serial không được vượt quá 50 ký tự"
                            }
                        }}
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
                    rules={{
                        required: "Kiểu gọng là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={[{ id: 1, name: "Nam" }, { id: 2, name: "Nữ" }, { id: 3, name: "Unisex" }]}
                    name="frameAttribute.gender"
                    placeholder="Giới tính"
                    rules={{
                        required: "Giới tính là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={frameTypes || []}
                    name="frameAttribute.frameType"
                    placeholder="Loại gọng"
                    rules={{
                        required: "Loại gọng là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={ve || []}
                    name="frameAttribute.ve"
                    placeholder="Ve"
                    rules={{
                        required: "Ve là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={shapes || []}
                    name="frameAttribute.shape"
                    placeholder="Hình dạng"
                    rules={{
                        required: "Hình dạng là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={temples || []}
                    name="frameAttribute.temple"
                    placeholder="Chuôi càng"
                    rules={{
                        required: "Chuôi càng là bắt buộc"
                    }}
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
                    rules={{
                        required: "Mặt trước là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialTempleTip"
                    placeholder="Chuôi càng"
                    rules={{
                        required: "Chuôi càng là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialTemple"
                    placeholder="Càng"
                    rules={{
                        required: "Càng là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialLens"
                    placeholder="Tròng kính"
                    rules={{
                        required: "Tròng kính là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={materials || []}
                    name="frameAttribute.materialVe"
                    placeholder="Ve kính"
                    rules={{
                        required: "Ve kính là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={coatings || []}
                    name="frameAttribute.coating"
                    placeholder="Lớp mạ"
                    rules={{
                        required: "Lớp mạ là bắt buộc"
                    }}
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
                    rules={{
                        required: "Màu mặt trước là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={colors || []}
                    name="frameAttribute.colorTemple"
                    placeholder="Càng kính"
                    rules={{
                        required: "Màu càng kính là bắt buộc"
                    }}
                />
                <RHFAutoComplete
                    className="mt-1"
                    options={colors || []}
                    name="frameAttribute.colorLens"
                    placeholder="Tròng kính"
                    rules={{
                        required: "Màu tròng kính là bắt buộc"
                    }}
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
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Dài gọng là bắt buộc",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Dài gọng phải là số"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Rộng mắt" />
                    <RHFTextField
                        name="frameAttribute.lensWidth"
                        placeholder="Nhập độ rộng mắt"
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Rộng mắt là bắt buộc",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Rộng mắt phải là số"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Dài mắt" />
                    <RHFTextField
                        name="frameAttribute.lensHeight"
                        placeholder="Nhập độ dài mắt"
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Dài mắt là bắt buộc",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Dài mắt phải là số"
                            }
                        }}
                    />
                </LayoutGrid>
                <LayoutGrid>
                    <Label label="Dài cầu" />
                    <RHFTextField
                        name="frameAttribute.bridgeWidth"
                        placeholder="Nhập độ dài cầu"
                        props={{ style: { maxWidth: "15vw" } }}
                        rules={{
                            required: "Dài cầu là bắt buộc",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Dài cầu phải là số"
                            }
                        }}
                    />
                </LayoutGrid>
            </div>
        </div>
    );
}

export default React.memo(FrameFields);