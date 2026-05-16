import React, { useCallback, useMemo, useState } from 'react';
import Button from '@/components/common/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Slide, Typography } from '@mui/material';
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
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import axiosClient from '@/api/axiosClient';
import useGetProductById from './hooks/useGetProductById';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { StatusProductEnum } from '@/utils/StatusProductEnum';
import { useBase64 } from '@/utils/base64';

const FormProduct: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { decode } = useBase64();
    const { showNotification } = useNotification();

    const decodedId = id ? Number(decode(id)) : undefined;
    const { data: groups = [] } = useGroup();
    const { data: product, isLoading: isLoadingProduct } = useGetProductById(Number(decodedId));
    const queryClient = useQueryClient();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const methods = useForm<Partial<Product>>({
        defaultValues: {
            id: decodedId,
            unit: "Chiếc",
        },
        values: product ? {
            ...product,
            group: groups.find(g => g.id === product.group?.id)
        } : (groups.length > 0 && !decodedId ? {
            unit: "Chiếc",
            group: groups[0]
        } : undefined)
    });

    const { control, handleSubmit, trigger, getValues } = methods;

    const watchedGroup = useWatch({ control, name: 'group' }) as unknown as ConfigLimitResponse;
    const currentType = useMemo(() => GROUP_TYPE[watchedGroup?.typeInfo?.id ?? 0], [watchedGroup]);

    const handleChangeOption = useCallback((newGroup: ConfigLimitResponse) => {
        const oldType = currentType;
        const newType = GROUP_TYPE[newGroup?.typeInfo?.id ?? 0];

        if (oldType !== newType) {
            methods.reset({ id: decodedId, unit: "Chiếc", group: newGroup });
        } else {
            methods.setValue('group', newGroup);
        }
    }, [decodedId, currentType, methods]);

    const handleImageChange = useCallback((file: File | null) => {
        setSelectedFile(file);
    }, []);

    const validation = (data: any) => {
        const errors: string[] = [];
        if (!data.id && !selectedFile) errors.push("Ảnh sản phẩm");
        if (selectedFile && selectedFile.size > 1024 * 1024 * 3) errors.push("Ảnh sản phẩm phải nhỏ hơn 3MB");

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

    const handleOpenDialog = useCallback(async () => {
        const isValid = await trigger();
        if (!isValid) return;
        setOpenDialog(true);
    }, [trigger])

    const onSubmit = async (data: any) => {
        const payload = new FormData();
        const productDto: any = {};

        Object.entries(data).forEach(([key, value]) => {
            buildProductObject(productDto, key, value);
        })

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
        createMutation.mutate(payload);
    };

    const createMutation = useMutation({
        mutationFn: async (payload: any) => {
            return await axiosClient.post("/api/product/save", payload);
        },
        onSuccess: (response) => {
            if (response.data.status === 400) {
                showNotification("error", response.data.message, "Thất bại");
            } else {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                showNotification("success", response.data.message, "Thành công");
                setOpenDialog(false);
                navigate(-1);
            }
        }
    })

    return (
        <FormProvider {...methods}>
            <div className='form-product-container'>
                {(isLoadingProduct || createMutation.isPending) && <Loading fullPage message='Đang lưu sản phẩm' />}
                <div className='form-product-header'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </Button>

                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            {decodedId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
                        </Typography>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-5'>
                        <Controller
                            control={control}
                            name="group"
                            render={({ field: { value } }) => (
                                <SelectUltra
                                    options={groups}
                                    value={value || null}
                                    onChange={handleChangeOption}
                                    disabled={!!decodedId} />
                            )} />
                        <Button
                            variant="primary"
                            disabled={getValues("statusProduct.id") === StatusProductEnum.INACTIVE}
                            onClick={handleOpenDialog}
                        >
                            {decodedId ? 'Cập nhật' : 'Thêm sản phẩm'}
                        </Button>
                    </div>
                </div>
                <div className='form-product-body-container'>
                    <div className='form-product-body'>
                        <InformationProductLeft
                            onImageChange={handleImageChange}
                            currentType={currentType}
                        />
                        <Slide direction="up" in={!!currentType} key={currentType} mountOnEnter unmountOnExit timeout={400}>
                            <div style={{ width: '100%' }}>
                                {currentType === "LENS" ? <LensFields /> : <FrameFields />}
                            </div>
                        </Slide>
                    </div>
                    <div className='form-product-body'>
                        <InformationProductRight />
                    </div>
                </div>
            </div>
            <ConfirmDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={"Xác nhận"}
                content={`Bạn có chắc chắn muốn ${decodedId ? 'cập nhật' : 'thêm'} sản phẩm này?`}
                onConfirm={handleSubmit(onSubmit)}
                loading={createMutation.isPending}
            />
        </FormProvider>
    );
};

export default FormProduct;