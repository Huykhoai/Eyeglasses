import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
} from '@mui/material';
import {
    AddCircleOutline as AddIcon,
    Description as FormIcon,
    Save as SaveIcon,
    Calculate as CalcIcon,
} from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import Button from '@/components/common/Button/Button';
import DialogSelectProduct from './DialogSelectProduct';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './AddQuotationRequest.css';
import { Divider } from '@mui/material';
import type { ConfigLimitResponse } from '@/types';
import AddQuotationRequestInfo from './components/AddQuotationRequestInfo';
import AddQuotationRequestTable from './components/AddQuotationRequestTable';
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from '@/utils/PurchaseQuotationEnum';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import type { SelectedProduct } from '../config/types';

interface FormValues {
    cid: string;
    name: string;
    supplier: ConfigLimitResponse | null;
    requestDate: string;
    expectedDate: string;
    note: string;
    status: PurchaseQuotationEnum | null;
    currency: ConfigLimitResponse | null;
    currencyValue: number | null;
    products: Map<number, SelectedProduct>;
}

const AddQuotationRequest: React.FC = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [openConfirm, setOpenConfirm] = useState(false);

    const generateCID = () => `RFQ-${dayjs().format('YYYYMMDD')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const methods = useForm<FormValues>({
        defaultValues: {
            cid: generateCID(),
            name: '',
            supplier: null,
            requestDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            expectedDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
            note: '',
            currency: null,
            currencyValue: null,
            products: new Map<number, SelectedProduct>(),
            status: null
        }
    });

    const { handleSubmit, watch, setValue, getValues } = methods;


    const handleAddProducts = (newMap: Map<number, SelectedProduct>) => {
        const productsMap = getValues('products');
        setValue('products', new Map([...productsMap, ...newMap]), { shouldValidate: true });
    };

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const selectedProducts: SelectedProduct[] = Array.from(data.products.values());
            const payload = {
                cid: data.cid,
                name: data.name,
                supplierId: data.supplier?.id,
                currencyId: data.currency?.id,
                currencyValue: data.currencyValue,
                requestDate: data.requestDate,
                expectedDate: data.expectedDate,
                note: data.note,
                status: data.status,
                items: selectedProducts.map(p => ({
                    productId: p.id,
                    requestQty: p.requestQty,
                    expectedPrice: p.expectedPrice,
                    quotedQty: p.quotedQty,
                    tax: p.tax,
                    unit: p.unit,
                    quotedPrice: p.quotedPrice,
                }))
            };
            return axiosClient.post('/api/purchase-quotation/add', payload);
        },
        onSuccess: (response) => {
            if (response.data.status === 400) {
                showNotification('error', response.data.message, 'Thất bại');
                return;
            }
            showNotification('success', response.data.message, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['quotation-requests'] });
        },
        onError: (error: any) => {
            showNotification('error', error?.response?.data?.message || 'Lỗi khi lưu yêu cầu báo giá', 'Thất bại');
        }
    });

    const onSubmit = (data: FormValues, status: PurchaseQuotationEnum) => {
        if (status !== PurchaseQuotationStatus.DRAFT && !validate(data)) {
            return;
        }
        createMutation.mutate({ ...data, status });
    };

    const validate = (data: FormValues) => {
        let message = 'Vui lòng điền đầy đủ thông tin:';
        if (!data.cid) {
            message += ' Mã báo giá,';
        }
        if (!data.name) {
            message += ' Tên báo giá,';
        }
        if (!data.supplier) {
            message += ' Nhà cung cấp,';
        }
        if (!data.requestDate) {
            message += ' Ngày yêu cầu,';
        }
        if (!data.expectedDate) {
            message += ' Ngày dự kiến,';
        }
        if (!data.currency) {
            message += ' Loại tiền tệ,';
        }
        if (!data.currencyValue) {
            message += ' Tỉ giá,';
        }
        if (data.products.size === 0) {
            message += ' Sản phẩm';
        }
        if (message !== 'Vui lòng điền đầy đủ thông tin:') {
            showNotification('error', message, 'Lỗi dữ liệu');
            return false;
        }
        return true;
    };

    return (
        <FormProvider {...methods}>
            <Box className="add-quote-page-wapper">
                <Box className="add-quote-header">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Button variant="outline" onClick={() => navigate(-1)} style={{ padding: '4px 12px', height: '32px' }}>Quay lại</Button>
                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', opacity: 0.5 }} />
                            <Typography variant="h5" fontWeight={800} color="#1e293b" letterSpacing="-0.02em">
                                Tạo mới báo giá
                            </Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outline"
                            onClick={handleSubmit((data) => onSubmit(data, PurchaseQuotationStatus.DRAFT))}
                            style={{ height: '40px', padding: '0 24px', borderColor: '#e2e8f0' }}
                        >
                            Lưu nháp
                        </Button>
                        <Button
                            variant="primary"
                            icon={<SaveIcon fontSize="small" />}
                            onClick={handleSubmit((data) => {
                                if (validate(data)) {
                                    setOpenConfirm(true);
                                }
                            })}
                            style={{ height: '40px', padding: '0 24px' }}
                        >
                            Lưu & Phát hành
                        </Button>
                    </Stack>
                </Box>

                <Stack spacing={3}>
                    <Paper sx={{
                        p: 0,
                        borderRadius: '20px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            p: 2,
                            background: 'linear-gradient(to right, #f8fafc, #ffffff)',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Box sx={{
                                    bgcolor: '#6366f1',
                                    color: 'white',
                                    p: 1,
                                    ml: 1.5,
                                    borderRadius: '14px',
                                    display: 'flex',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                }}>
                                    <FormIcon fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ lineHeight: 1.2 }}>
                                        {watch('cid') || 'RFQ-XXXX'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ p: 4, pt: 3, pb: 1.5 }}>
                            <AddQuotationRequestInfo generateCID={generateCID} />
                        </Box>
                    </Paper>

                    <Paper sx={{
                        p: 0,
                        borderRadius: '20px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', p: 1, borderRadius: '12px', display: 'flex' }}>
                                    <CalcIcon sx={{ color: '#6366f1' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800} color="#1e293b">Danh mục mặt hàng</Typography>
                                    <Typography variant="caption" color="text.secondary">Chọn sản phẩm cần đề xuất báo giá</Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="primary"
                                icon={<AddIcon fontSize="small" />}
                                onClick={() => setOpenProductDialog(true)}
                                style={{ borderRadius: '10px', padding: '0 24px', height: '40px' }}
                            >
                                Thêm sản phẩm
                            </Button>
                        </Box>
                        <AddQuotationRequestTable
                            page={page}
                            size={size}
                            setPage={setPage}
                            setSize={setSize}
                        />
                    </Paper>
                </Stack>

                <DialogSelectProduct
                    open={openProductDialog}
                    onClose={() => setOpenProductDialog(false)}
                    onSelected={handleAddProducts}
                />
            </Box>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleSubmit((data) => {
                    onSubmit(data, PurchaseQuotationStatus.PENDING);
                    setOpenConfirm(false);
                })}
                title="Xác nhận phát hành"
                content="Bạn có chắc chắn muốn phát hành báo giá này?"
            />
        </FormProvider >
    );
};

export default AddQuotationRequest;
