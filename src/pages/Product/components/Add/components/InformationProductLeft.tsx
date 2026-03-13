import { Close, Image as ImageIcon } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid, Label } from "./commonUI";
import { RHFTextField } from "../../../../../components/common/TextField/RHFComponents";
import { useFormContext, useWatch } from "react-hook-form";

interface InformationProductProps {
    onImageChange: (file: File | null) => void;
    selectedGroup?: any;
    currentType?: any;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const GeneratedCidField: React.FC<{ selectedGroup: any; currentType: any }> = ({ selectedGroup, currentType }) => {
    const { control, setValue } = useFormContext();
    const brand = useWatch({ control, name: 'brand' });
    const lensRefractiveIndex = useWatch({ control, name: 'lensAttribute.refractiveIndex' });
    const frameModel = useWatch({ control, name: 'frameAttribute.model' });

    useEffect(() => {
        if (!selectedGroup) return;

        let generatedCid = "";

        if (selectedGroup.id) {
            generatedCid += selectedGroup.id.toString().padStart(2, '0');
        }

        if (brand && brand.id) {
            generatedCid += brand.id.toString().padStart(2, '0');
        } else {
            generatedCid += "00";
        }

        if (currentType === "LENS") {
            if (lensRefractiveIndex && lensRefractiveIndex.cid) {
                const riCidStr = lensRefractiveIndex.cid.toString().replace(/[^0-9a-zA-Z]/g, '').substring(0, 3).padEnd(3, '0');
                generatedCid += riCidStr;
            } else {
                generatedCid += "000";
            }
        } else if (currentType === "FRAME") {
            if (frameModel) {
                const flStr = frameModel.replace(/[^0-9a-zA-Z]/g, '').substring(0, 3).toUpperCase().padEnd(3, '0');
                generatedCid += flStr;
            } else {
                generatedCid += "000";
            }
        } else {
            generatedCid += "000";
        }

        generatedCid += "00000";

        setValue('cid', generatedCid, { shouldValidate: true, shouldDirty: true });

    }, [selectedGroup, currentType, brand, lensRefractiveIndex, frameModel, setValue]);

    return <RHFTextField name="cid" props={{ disabled: true }} />;
};

const GeneratedNameField: React.FC<{ selectedGroup: any; currentType: any}> = ({ selectedGroup, currentType}) => {
    const { control, setValue } = useFormContext();

    const brand = useWatch({ control, name: 'brand' });
    
    const refractiveIndex = useWatch({ control, name: 'lensAttribute.refractiveIndex' });
    const lensMaterial = useWatch({ control, name: 'lensAttribute.material' });
    const uv = useWatch({ control, name: 'lensAttribute.uv' });
    const phoColor = useWatch({ control, name: 'lensAttribute.phoColor' });
    const coating = useWatch({ control, name: 'lensAttribute.coating' });
    const sph = useWatch({ control, name: 'lensAttribute.sph' });
    const cyl = useWatch({ control, name: 'lensAttribute.cyl' });
    const add = useWatch({ control, name: 'lensAttribute.lenAdd' });

    const frameModel = useWatch({ control, name: 'frameAttribute.model' });
    const colorCode = useWatch({ control, name: 'frameAttribute.colorCode' });

    useEffect(() => {
        if (!selectedGroup) return;

        const nameParts: (string | undefined | null)[] = [];

        nameParts.push(selectedGroup?.typeInfo?.name);
        nameParts.push(brand?.name);

        if (currentType === "LENS") {
            nameParts.push(refractiveIndex?.cid);
            nameParts.push(lensMaterial?.name);
            nameParts.push(uv?.name);
            nameParts.push(phoColor?.name);
            nameParts.push(coating?.name);

            let params = [];
            if (sph !== undefined && sph !== null && sph !== "") params.push(`S${sph}`);
            if (cyl !== undefined && cyl !== null && cyl !== "") params.push(`C${cyl}`);
            if (add !== undefined && add !== null && add !== "") params.push(`A${add}`);
            
            if (params.length > 0) {
                nameParts.push(params.join('/'));
            }

        } else if (currentType === "FRAME") {
            nameParts.push(""); 
            nameParts.push(frameModel);
            nameParts.push(colorCode);
        }

        const finalName = nameParts.filter(part => part && String(part).trim() !== "").join(' ');
        setValue("name", finalName, { shouldValidate: true, shouldDirty: true });

    }, [
        selectedGroup, currentType, brand, 
        refractiveIndex, lensMaterial, uv, phoColor, coating, sph, cyl, add,
        frameModel, colorCode,
        setValue
    ]);

    return <RHFTextField name="name" />;
};

const InformationProductLeft: React.FC<InformationProductProps> = ({ onImageChange, selectedGroup, currentType }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { control } = useFormContext();
    const imageUrl = useWatch({ control, name: 'imageUrl' });

    useEffect(() => {
        if (imageUrl) {
            const fullUrl = imageUrl.startsWith('/api/images/')
                ? imageUrl
                : `${BASE_URL}${imageUrl}`;
            setPreviewUrl(fullUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [imageUrl]);

    const handleFile = useCallback((file: File) => {
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onImageChange(file);
        }
    }, [onImageChange]);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onContainerClick = () => {
        fileInputRef.current?.click();
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        onImageChange(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="body-card gap-2">
            <LayoutGrid>
                <Label label="Ảnh sản phẩm" />

                <div
                    className="d-flex flex-column align-items-center justify-content-center gap-2"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={onContainerClick}
                    style={{
                        border: isDragging ? '2px dashed #6366f1' : '2px dashed #ccc',
                        borderRadius: '12px',
                        padding: '16px',
                        width: '100%',
                        minHeight: '220px',
                        cursor: 'pointer',
                        backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : '#fafafa',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                    />

                    {previewUrl ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={previewUrl}
                                alt="Product Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '180px',
                                    borderRadius: '8px',
                                    objectFit: 'contain'
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={handleRemoveImage}
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    '&:hover': { backgroundColor: '#f1f1f1' }
                                }}
                            >
                                <Close fontSize="small" color="error" />
                            </IconButton>
                        </div>
                    ) : (
                        <>
                            <ImageIcon fontSize="large" sx={{ color: 'gray', mb: 1 }} />
                            <Typography variant='body1' sx={{ color: '#64748b', fontWeight: 500, textAlign: 'center' }}>
                                Chưa có ảnh nào được thêm
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                                Kéo và thả ảnh vào đây hoặc nhấp để chọn
                            </Typography>
                            <div className="d-flex gap-2 flex-wrap justify-content-center mt-1">
                                <Typography variant="caption" sx={{ color: '#94a3b8', background: '#f1f5f9', px: 1, borderRadius: '4px' }}>
                                    JPG, PNG
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', background: '#f1f5f9', px: 1, borderRadius: '4px' }}>
                                    Tối đa 3MB
                                </Typography>
                            </div>
                        </>
                    )}
                </div>
            </LayoutGrid>
            <LayoutGrid>
                <Label label="Kí hiệu viết tắt" />
                <GeneratedCidField selectedGroup={selectedGroup} currentType={currentType} />
            </LayoutGrid>
            <LayoutGrid>
                <Label label="Tên đầy đủ" />
                <GeneratedNameField selectedGroup={selectedGroup} currentType={currentType} />
            </LayoutGrid>
            <LayoutGrid>
                <Label label="Đơn vị" />
                <RHFTextField name="unit" />
            </LayoutGrid>
        </div>
    );
};

export default React.memo(InformationProductLeft);