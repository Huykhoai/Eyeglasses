import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    IconButton,
    Typography,
    Autocomplete,
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
import FlagIcon from '@mui/icons-material/Flag';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import type { Supplier } from '../hooks/useSupplierData';
import { useQueryClient } from '@tanstack/react-query';
import { useCountry } from '@/hooks/UseAllData';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';

interface DialogSupplierProps {
    data?: Supplier | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormErrors {
    [key: string]: string;
}

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
    countryDto: null as any
};

const DialogSupplier: React.FC<DialogSupplierProps> = ({ data, open, onClose, onSuccess }) => {
    const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR || '#7b4b68';
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const { data: countries } = useCountry();

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    useEffect(() => {
        if (open) {
            if (data) {
                setFormData({
                    ...initialForm,
                    ...data,
                });
            } else {
                setFormData(initialForm);
            }
            setErrors({});
        }
    }, [open, data]);
    
    const labelMapper: Record<string, string> = {
        cid: 'Mã nhà cung cấp',
        name: 'Tên nhà cung cấp',
        email: 'Email',
        phone: 'Số điện thoại',
        contact: 'Liên hệ',
        address: 'Địa chỉ',
        fax: 'Fax',
        advisingBank: 'Ngân hàng',
        branchCode: 'Mã chi nhánh',
        bankAddress: 'Địa chỉ ngân hàng',
        accountNo: 'Số tài khoản',
        swiftCode: 'Mã SWIFT',
        taxCode: 'Mã số thuế',
        countryDto: 'Quốc gia'
    };

    const validate = () => {
        const newErrors: FormErrors = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "supplierId" || key === "id") return;

            if (!value && labelMapper[key]) {
                newErrors[key] = `${labelMapper[key]} không được để trống`;
            }
        });

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.phone && !/^(0[2|3|5|7|8|9])+([0-9]{8,9})$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleSave = async () => {
        if (!validate()){
            setOpenConfirm(false)
            return;
        };

        setLoading(true);
        try {
            if (data?.id) {
                await axiosClient.put(`/api/supplier/update/${data.id}`, formData);
                showNotification('success', 'Cập nhật nhà cung cấp thành công', 'Thành công');
            } else {
                await axiosClient.post('/api/supplier/create', formData);
                showNotification('success', 'Thêm nhà cung cấp thành công', 'Thành công');
            }

            queryClient.invalidateQueries({ queryKey: ['supplier'] });
            onSuccess?.();
            onClose();
            setOpenConfirm(false)
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra';
            showNotification('error', message, 'Lỗi');
        } finally {
            setLoading(false);
        }
    };

    const renderTextField = (label: string, name: string, icon: React.ReactNode, gridSpan: any = { xs: 'span 12', md: 'span 4' }, required: boolean = false, disabled: boolean = false) => (
        <Box sx={{ gridColumn: gridSpan }}>
            <TextField
                fullWidth
                size="small"
                label={label + (required ? ' *' : '')}
                name={name}
                disabled={disabled}
                value={(formData as any)[name] || ''}
                onChange={handleChange}
                error={!!errors[name]}
                helperText={errors[name]}
                InputProps={{
                    startAdornment: icon ? (
                        <InputAdornment position="start">
                            {icon}
                        </InputAdornment>
                    ) : null,
                    sx: { borderRadius: '6px' }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                        '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR }
                }}
            />
        </Box>
    );

    return (
        <div>
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
                                <CorporateFareIcon sx={{ color: PRIMARY_COLOR }} />
                                <Typography variant="h6" fontSize="1rem" fontWeight={600} color={PRIMARY_COLOR}>
                                    Thông tin cơ bản
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                                {renderTextField("Mã nhà cung cấp", "cid", <BusinessIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true, data?.id ? true : false)}
                                {renderTextField("Tên nhà cung cấp", "name", <PersonIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Số điện thoại", "phone", <PhoneIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' })}

                                {renderTextField("Email", "email", <EmailIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Địa chỉ", "address", <LocationOnIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Fax", "fax", <PrintIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                            </Box>
                        </Box>

                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <AccountBalanceIcon sx={{ color: PRIMARY_COLOR }} />
                                <Typography variant="h6" fontSize="1.1rem" fontWeight={700} color={PRIMARY_COLOR}>
                                    Thông tin ngân hàng & liên hệ
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                                {renderTextField("Người liên hệ", "contact", <PersonIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Mã số thuế", "taxCode", <AssignmentIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Ngân hàng", "advisingBank", <AccountBalanceIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}

                                {renderTextField("Địa chỉ ngân hàng", "bankAddress", <LocationOnIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Số tài khoản", "accountNo", <CreditCardIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}
                                {renderTextField("Chi nhánh", "branchCode", <BusinessIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}

                                {renderTextField("Swift Code", "swiftCode", <CodeIcon fontSize="small" sx={{ color: '#757575' }} />, { xs: 'span 12', md: 'span 4' }, true)}

                                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                                    <Autocomplete
                                        size="small"
                                        options={countries || []}
                                        getOptionLabel={(option) => option.name}
                                        value={formData.countryDto}
                                        onChange={(_, value) => {
                                            setFormData(prev => ({ ...prev, countryDto: value }));
                                            setErrors(prev => ({ ...prev, countryDto: '' }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Quốc gia"
                                                required
                                                error={!!errors.countryDto}
                                                helperText={errors.countryDto}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <FlagIcon fontSize="small" sx={{ color: '#757575' }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: '6px' }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                                        '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR }
                                                }}
                                            />
                                        )}
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
                        disabled={loading}
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
                            HỦY
                        </Box>
                    </Button>
                        <Button
                            onClick={() => setOpenConfirm(true)}
                            variant="primary"
                            disabled={loading}
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
                            LƯU
                        </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                open={openConfirm}
                title={`Xác nhận ${data ? "sửa" : "thêm"}`}
                content={`Bạn có chắc chắn muốn ${data ? "sửa" : "thêm"} nhà cung cấp "${formData?.name}" không? Hành động này không thể hoàn tác.`}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleSave}
                loading={loading}
            />
        </div>

    );
};

export default React.memo(DialogSupplier);
