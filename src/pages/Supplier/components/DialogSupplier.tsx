import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    IconButton,
    Typography,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PrintIcon from '@mui/icons-material/Print';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CodeIcon from '@mui/icons-material/Code';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCountry } from '@/hooks/UseAllData';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import type { DialogSupplierProps, Supplier } from '../config/type';
import { FormProvider, useForm } from 'react-hook-form';
import { RHFTextField } from '@/components/common/TextField/RHFTextField';
import { RHFAutoComplete } from '@/components/common/TextField/RHFComponents';

const initialForm = {
    cid: '',
    name: '',
    email: '',
    phone: '',
    contact: '',
    address: '',
    fax: '',
    advisingBank: '',
    branchCode: '',
    bankAddress: '',
    accountNo: '',
    swiftCode: '',
    taxCode: '',
    supplierId: 0,
    country: null as any
};

const DialogSupplier: React.FC<DialogSupplierProps> = ({ data, open, onClose, onSuccess }) => {
    const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR;
    const SECONDARY_COLOR = import.meta.env.VITE_SECOND_COLOR;
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const { data: countries } = useCountry();

    const [openConfirm, setOpenConfirm] = useState(false);

    const methods = useForm<Supplier>({
        defaultValues: initialForm,
        values: data ? { ...data } : undefined,
    });

    const { handleSubmit, trigger, getValues, reset } = methods;

    React.useEffect(() => {
        if (open) {
            reset(data ? { ...data } : initialForm);
        }
    }, [open, data, reset]);

    const onSubmit = async (data: Supplier) => {
        const isValid = await trigger();
        if (!isValid) {
            setOpenConfirm(false)
            return;
        };
        createMutation.mutate(data)
    };

    const createMutation = useMutation({
        mutationFn: async (data: Supplier) => {
            if (data?.id) return await axiosClient.put(`/api/supplier/update/${data.id}`, data);
            return await axiosClient.post('/api/supplier/create', data);
        },
        onSuccess: () => {
            showNotification('success', data?.id
                ? 'Cập nhật nhà cung cấp thành công'
                : 'Thêm nhà cung cấp thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['supplier'] });
            onSuccess?.();
            onClose();
            setOpenConfirm(false)
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra';
            showNotification('error', message, 'Lỗi');
        }
    })

    const renderTextField = (
        label: string, name: string, icon: React.ReactNode, gridSpan: any = { xs: 'span 12', md: 'span 4' },
        required: boolean = false, disabled: boolean = false, rules?: any
    ) => (
        <Box sx={{ gridColumn: gridSpan }}>
            <RHFTextField
                rules={rules}
                fullWidth
                label={label + (required ? ' *' : '')}
                name={name}
                disabled={disabled}
                startAdornment={icon ? (
                    <InputAdornment position="start">
                        {icon}
                    </InputAdornment>
                ) : null}
            />
        </Box>
    );

    return (
        <FormProvider {...methods}>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '12px', overflow: 'hidden' }
                }}
            >
                <DialogTitle sx={{
                    p: 2,
                    bgcolor: PRIMARY_COLOR,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <CorporateFareIcon fontSize="medium" />
                    <Typography variant="h6" fontSize="1.1rem" fontWeight={600} sx={{ flexGrow: 1, letterSpacing: '0.5px' }}>
                        {data ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Box sx={{ bgcolor: '#eeeae9', px: 3, py: 1, borderBottom: '1px solid #d1cccb' }}>
                    <Typography variant="caption" color="#666" sx={{ fontStyle: 'italic', }}>
                        Vui lòng điền đầy đủ thông tin nhà cung cấp
                    </Typography>
                </Box>

                <DialogContent sx={{ p: 2, bgcolor: '#ffffff' }}>
                    <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: 3, position: 'relative' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <CorporateFareIcon sx={{ color: SECONDARY_COLOR }} />
                                <Typography variant="h6" fontSize="1rem" fontWeight={600} color={SECONDARY_COLOR}>
                                    Thông tin cơ bản
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                                {renderTextField(
                                    "Mã nhà cung cấp", "cid", <BusinessIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, data?.id ? true : false,
                                    {
                                        required: "Mã nhà cung cấp là bắt buộc",
                                        maxLength: { value: 50, message: "Mã nhà cung cấp không được vượt quá 50 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Tên nhà cung cấp", "name", <PersonIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Tên nhà cung cấp là bắt buộc",
                                        maxLength: { value: 250, message: "Tên nhà cung cấp không được vượt quá 250 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Số điện thoại", "phone", <PhoneIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Số điện thoại là bắt buộc",
                                        maxLength: { value: 15, message: "Số điện thoại không được vượt quá 15 ký tự" },
                                        pattern: {
                                            value: /^(0[2|3|5|7|8|9])+([0-9]{8,9})$/,
                                            message: "Số điện thoại không hợp lệ"
                                        }
                                    }
                                )}

                                {renderTextField(
                                    "Email", "email", <EmailIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Email là bắt buộc",
                                        maxLength: { value: 255, message: "Email không được vượt quá 255 ký tự" },
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email không hợp lệ"
                                        }
                                    }
                                )}
                                {renderTextField(
                                    "Địa chỉ", "address", <LocationOnIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Địa chỉ là bắt buộc",
                                        maxLength: { value: 500, message: "Địa chỉ không được vượt quá 500 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Fax", "fax", <PrintIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Fax là bắt buộc",
                                        maxLength: { value: 100, message: "Fax không được vượt quá 100 ký tự" }
                                    }
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <AccountBalanceIcon sx={{ color: SECONDARY_COLOR }} />
                                <Typography variant="h6" fontSize="1.1rem" fontWeight={700} color={SECONDARY_COLOR}>
                                    Thông tin ngân hàng & liên hệ
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                                {renderTextField(
                                    "Người liên hệ", "contact", <PersonIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Người liên hệ là bắt buộc",
                                        maxLength: { value: 100, message: "Người liên hệ không được vượt quá 100 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Mã số thuế", "taxCode", <AssignmentIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Mã số thuế là bắt buộc",
                                        maxLength: { value: 100, message: "Mã số thuế không được vượt quá 100 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Ngân hàng", "advisingBank", <AccountBalanceIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Ngân hàng là bắt buộc",
                                        maxLength: { value: 255, message: "Ngân hàng không được vượt quá 100 ký tự" }
                                    }
                                )}

                                {renderTextField(
                                    "Địa chỉ ngân hàng", "bankAddress", <LocationOnIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Địa chỉ ngân hàng là bắt buộc",
                                        maxLength: { value: 500, message: "Địa chỉ ngân hàng không được vượt quá 500 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Số tài khoản", "accountNo", <CreditCardIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Số tài khoản là bắt buộc",
                                        maxLength: { value: 100, message: "Số tài khoản không được vượt quá 100 ký tự" }
                                    }
                                )}
                                {renderTextField(
                                    "Chi nhánh", "branchCode", <BusinessIcon fontSize="small" sx={{ color: '#757575' }} />,
                                    { xs: 'span 12', md: 'span 4' }, true, false,
                                    {
                                        required: "Chi nhánh là bắt buộc",
                                        maxLength: { value: 100, message: "Chi nhánh không được vượt quá 100 ký tự" }
                                    }
                                )}

                                {renderTextField("Swift Code", "swiftCode", <CodeIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}

                                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                                    <RHFAutoComplete
                                        name="country"
                                        options={countries || []}
                                        placeholder="Chọn quốc gia"
                                        getOptionLabel={(option: any) => (option?.cid ? `${option?.cid} - ${option?.name}` : option?.name)}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={createMutation.isPending}
                        style={{
                            color: '#666',
                            borderColor: '#ccc',
                            padding: '7px 24px',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CloseIcon fontSize="small" />
                            Hủy
                        </Box>
                    </Button>
                    <Button
                        onClick={() => setOpenConfirm(true)}
                        variant="primary"
                        disabled={createMutation.isPending}
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            color: 'white',
                            padding: '7px 32px',
                            fontWeight: 600,
                            minHeight: "20px",
                            fontSize: '0.8rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        Lưu lại
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                open={openConfirm}
                title={`Xác nhận ${data ? "sửa" : "thêm"}`}
                content={`Bạn có chắc chắn muốn ${data ? "sửa" : "thêm"} nhà cung cấp "${getValues("name")}" không? Hành động này không thể hoàn tác.`}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleSubmit(onSubmit)}
                loading={createMutation.isPending}
            />
        </FormProvider>
    );
};

export default React.memo(DialogSupplier);
