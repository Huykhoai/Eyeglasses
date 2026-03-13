import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/components/common/Button/Button';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useGroup } from '@/hooks/UseAllData';
import SelectUltra from '@/components/common/Select/SelectUltra';
import type { ConfigLimitResponse } from '@/types';
import { useNotification } from "@/components/ui/Notification/NotificationContext"
import './FormProduct.css';
import InformationProductLeft from './components/InformationProductLeft';
import InformationProductRight from './components/InformationProductRight';
import { GROUP_TYPE, type Product } from '../../types/product';
import Loading from '@/components/ui/Loading/Loading';
import LensFields from './components/LensFields';
import FrameFields from './components/FrameFields';
import { useForm, FormProvider } from 'react-hook-form';
import axiosClient from '@/api/axiosClient';

const FormProduct: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: groups = [] } = useGroup();

    const [isLoading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<ConfigLimitResponse | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const methods = useForm<Partial<Product>>({
        defaultValues: {
            id: id ? Number(id) : undefined,
            unit: "Chiếc"
        }
    });
    const currentType = useMemo(() => GROUP_TYPE[selectedGroup?.typeInfo?.id ?? 0], [selectedGroup]);

    useEffect(() => {
        if (groups.length === 0) return;
        if (id) return;

        if (!selectedGroup) {
            let groupToSelect = groups[0];
            const groupFromUrl = searchParams.get('group');

            if (groupFromUrl) {
                const matchedGroup = groups.find(group => group.id.toString() === groupFromUrl);
                if (matchedGroup) groupToSelect = matchedGroup;
            }

            if (groupFromUrl !== groupToSelect.id.toString()) {
                setSearchParams({ group: groupToSelect.id.toString() }, { replace: true });
            }

            setSelectedGroup(groupToSelect);
            methods.reset({ id: id ? Number(id) : undefined, unit: "Chiếc" });
        }
    }, [groups, id, searchParams, selectedGroup, setSearchParams, methods]);

    const handleChangeOption = useCallback((newGroup: ConfigLimitResponse) => {
        setSelectedGroup(newGroup);

        const oldType = GROUP_TYPE[selectedGroup?.typeInfo?.id ?? 0];
        const newType = GROUP_TYPE[newGroup?.typeInfo?.id ?? 0];
        if (oldType !== newType) {
            methods.reset({ id: id ? Number(id) : undefined, unit: "Chiếc" });
        }
        if (!id) {
            setSearchParams({ group: newGroup.id?.toString() }, { replace: true });
        }
    }, [id, selectedGroup, setSearchParams, methods]);

    const handleImageChange = useCallback((file: File | null) => {
        setSelectedFile(file);
    }, []);

    const validation = (data: any) => {
        const errors: string[] = [];

        if (!data.name?.trim()) errors.push("Tên sản phẩm");
        if (!data.brandId) errors.push("Thương hiệu");
        if (!data.supplierId) errors.push("Nhà cung cấp");
        if (!data.countryId) errors.push("Xuất xứ");
        if (!data.unit?.trim()) errors.push("Đơn vị");
        if (!data.currencyId) errors.push("Loại tiền tệ");
        if (!data.originalPrice) errors.push("Giá gốc");
        if (!data.note?.trim()) errors.push("Ghi chú");
        if (!data.uses?.trim()) errors.push("Công dụng");
        if (!data.guide?.trim()) errors.push("Hướng dẫn sử dụng");
        if (!data.warning?.trim()) errors.push("Cảnh báo");
        if (!data.preserve?.trim()) errors.push("Bảo quản");
        if (!selectedFile) errors.push("Ảnh sản phẩm");
        if (selectedFile && selectedFile.size > 1024 * 1024 * 3) errors.push("Ảnh sản phẩm phải nhỏ hơn 3MB");

        if (currentType === "LENS") {
            const lens = data.lensAttribute || {};
            if (!lens.refractiveIndexId) errors.push("Chiết suất");
            if (!lens.materialId) errors.push("Vật liệu mắt");
            if (lens.sph === undefined || lens.sph === null || lens.sph === "") errors.push("Độ SPH");
            if (lens.cyl === undefined || lens.cyl === null || lens.cyl === "") errors.push("Độ CYL");
            if (lens.lenAdd === undefined || lens.lenAdd === null || lens.lenAdd === "") errors.push("Độ Add");
            if (lens.diameter === undefined || lens.diameter === null || lens.diameter === "") errors.push("Đường kính");
            if (!lens.design1Id) errors.push("Thiết kế 1");
            if (!lens.design2Id) errors.push("Thiết kế 2");
            if (!lens.uvId) errors.push("UV");
            if (!lens.hmcColorId) errors.push("Màu sắc HMC");
            if (!lens.phoColorId) errors.push("Màu sắc Photochromic");
            if (!lens.tintColorId) errors.push("Màu sắc nhuộm");
            if (!lens.coatingId) errors.push("Lớp phủ");
        } else if (currentType === "FRAME") {
            const frame = data.frameAttribute || {};
            if (!frame.season?.trim()) errors.push("Phiên bản");
            if (!frame.colorCode?.trim()) errors.push("Mã màu");
            if (!frame.model?.trim()) errors.push("Model gọng");
            if (!frame.serial?.trim()) errors.push("Serial");
            if (!frame.genderId) errors.push("Giới tính");
            if (frame.templeLength === undefined || frame.templeLength === null || frame.templeLength === "") errors.push("Chiều dài càng");
            if (frame.bridgeWidth === undefined || frame.bridgeWidth === null || frame.bridgeWidth === "") errors.push("Cầu kính");
            if (frame.lensWidth === undefined || frame.lensWidth === null || frame.lensWidth === "") errors.push("Chiều rộng mắt");
            if (frame.lensHeight === undefined || frame.lensHeight === null || frame.lensHeight === "") errors.push("Chiều cao mắt");
            if (!frame.frameId) errors.push("Kiểu gọng");
            if (!frame.frameTypeId) errors.push("Loại gọng");
            if (!frame.shapeId) errors.push("Hình dáng");
            if (!frame.veId) errors.push("Chất liệu");
            if (!frame.coatingId) errors.push("Lớp phủ");
            if (!frame.templeId) errors.push("Càng kính");
            if (!frame.materialFrontId) errors.push("Chất liệu mặt trước");
            if (!frame.materialTempleId) errors.push("Chất liệu càng");
            if (!frame.materialVeId) errors.push("Chất liệu gọng");
            if (!frame.materialTempleTipId) errors.push("Chất liệu chuôi càng");
            if (!frame.materialLensId) errors.push("Chất liệu tròng");
            if (!frame.colorFrontId) errors.push("Màu mặt trước");
            if (!frame.colorTempleId) errors.push("Màu càng");
            if (!frame.colorLensId) errors.push("Màu mắt");

        }

        return errors;
    }
    const buildProductObject = (parent: any, key: string, value: any) => {
        if (value === null || value === undefined) return;

        if (typeof value === 'object' && !Array.isArray(value) && 'id' in value) {
            if (value.id !== null && value.id !== undefined) {
                parent[`${key}Id`] = value.id;
            }
        }
        else if (typeof value === 'object' && !Array.isArray(value)) {
            parent[key] = parent[key] || {};
            Object.entries(value).forEach(([subKey, subValue]) => {
                buildProductObject(parent[key], subKey, subValue);
            });
        }
        else {
            parent[key] = value;
        }
    };

    const onSubmit = async (data: any) => {
        const payload = new FormData();
        const productDto: any = {};

        Object.entries(data).forEach(([key, value]) => {
            buildProductObject(productDto, key, value);
        })
        if (selectedGroup) productDto.groupId = selectedGroup.id;

        const errors = validation(productDto);
        if (errors.length > 0) {
            showNotification("error", `Vui lòng điền đủ các trường: ${errors.join(", ")}`, "Thiếu thông tin");
            return;
        }

        payload.append("product", new Blob([JSON.stringify(productDto)], {
            type: 'application/json'
        }));

        if (selectedFile) {
            payload.append("image", selectedFile);
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/api/product/save", payload);
            showNotification("success", response.data.message, "Thành công");
            navigate("/products");
        } catch (error: any) {
            console.error("Lỗi khi handleSubmit:", error);
            const message = error?.response?.data?.message || error?.message || "Lỗi hệ thống";
            showNotification("error", message, "Thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className='form-product-container'>
                {isLoading && <Loading fullPage message='Đang lưu sản phẩm' />}
                <div className='form-product-header'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/products')}
                        >
                            Quay lại
                        </Button>

                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            {id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
                        </Typography>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-5'>
                        <SelectUltra
                            options={groups}
                            value={selectedGroup || null}
                            onChange={handleChangeOption} />
                        <Button
                            variant="primary"
                            onClick={methods.handleSubmit(onSubmit)}
                        >
                            {id ? 'Cập nhật' : 'Thêm sản phẩm'}
                        </Button>
                    </div>
                </div>
                <div className='form-product-body-container'>
                    <div className='form-product-body'>
                        <InformationProductLeft
                            onImageChange={handleImageChange}
                            selectedGroup={selectedGroup}
                            currentType={currentType}
                        />
                        {currentType === "LENS" && <LensFields />}
                        {currentType === "FRAME" && <FrameFields />}
                    </div>
                    <div className='form-product-body'>
                        <InformationProductRight />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default FormProduct;