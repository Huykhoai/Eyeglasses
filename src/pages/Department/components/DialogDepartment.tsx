import React, { useState } from 'react';
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
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GroupIcon from '@mui/icons-material/Group';

import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useDepartmentAll, useEmployeeAll } from '@/hooks/UseAllData';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import type { DepartmentType, DialogDepartmentProps } from '../config/type';
const initialForm: DepartmentType = {
    id: null,
    cid: '',
    name: '',
    location: '',
    parent: null,
    manager: null
};

const DialogDepartment: React.FC<DialogDepartmentProps> = ({ data, open, onClose, onSuccess }) => {
    const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR;
    const SECONDARY_COLOR = import.meta.env.VITE_SECOND_COLOR;
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    
    const { data: departmentList } = useDepartmentAll();
    const { data: employeeList } = useEmployeeAll();

    const methods = useForm<DepartmentType>({
        defaultValues: initialForm,
        values: data || initialForm,
    });

    const { control, trigger, getValues } = methods;

    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleSave = async (formData: DepartmentType) => {
        setLoading(true);
        const payload: Record<string, any> = {
            id: formData.id,
            cid: formData.cid,
            name: formData.name,
            location: formData.location,
            parentId: formData.parent?.id,
            managerId: formData.manager?.id
        }
        try {
            const response = await axiosClient.post('/api/department/save', payload);

            if(response.data.status === 400) {
                showNotification('error', response.data.message, 'Lỗi hệ thống');
                return;
            }

            showNotification('success', response.data.message, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['department'] });
            queryClient.invalidateQueries({ queryKey: ['department-all'] });
            onSuccess?.();
            onClose();
            setOpenConfirm(false);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra khi lưu phòng ban';
            showNotification('error', message, 'Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handlePreSave = async () => {
        const isValid = await trigger();
        if (isValid) {
            setOpenConfirm(true);
        }
    };

    const renderTextField = (label: string, name: keyof DepartmentType, icon: React.ReactNode, rules: any = {}, gridSpan: any = { xs: 'span 12', md: 'span 6' }) => (
        <Box sx={{ gridColumn: gridSpan }}>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        fullWidth
                        size="small"
                        label={label + (rules.required ? ' *' : '')}
                        value={field.value || ''}
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                            startAdornment: icon ? (
                                <InputAdornment position="start">
                                    {icon}
                                </InputAdornment>
                            ) : null,
                            sx: { borderRadius: '8px' }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: SECONDARY_COLOR }
                        }}
                    />
                )}
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
                    sx: { borderRadius: '16px', overflow: 'hidden' }
                }}
            >
                <DialogTitle sx={{
                    p: 2.5,
                    background: PRIMARY_COLOR,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <CorporateFareIcon />
                    <Typography variant="h6" fontSize="1.15rem" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: '0.3px' }}>
                        {data ? 'Cập Nhật Phòng Ban' : 'Thêm Phòng Ban Mới'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Box sx={{ bgcolor: '#eeeae9', px: 3, py: 1, borderBottom: '1px solid #d1cccb' }}>
                    <Typography variant="caption" color="#666" sx={{ fontStyle: 'italic', }}>
                        Vui lòng điền đầy đủ thông tin phòng ban.
                    </Typography>
                </Box>

                <DialogContent sx={{ p: 4, bgcolor: '#fcfcfc' }}>
                    <Box component="form" sx={{ mt: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3.5 }}>
                        
                        <Box sx={{ gridColumn: 'span 12', mb: 1 }}>
                            <Typography variant="subtitle2" color={SECONDARY_COLOR} fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                <BusinessIcon fontSize="small" /> Thông tin cơ bản
                            </Typography>
                        </Box>

                        {renderTextField("Mã phòng ban", "cid", <BusinessIcon fontSize="small" />, { 
                            required: 'Mã phòng ban không được để trống',
                            maxLength: { value: 50, message: 'Tối đa 50 ký tự' }
                        })}
                        {renderTextField("Tên phòng ban", "name", <PersonIcon fontSize="small" />, { 
                            required: 'Tên phòng ban không được để trống',
                            maxLength: { value: 250, message: 'Tối đa 250 ký tự' }
                        })}
                        {renderTextField("Vị trí", "location", <LocationOnIcon fontSize="small" />, { 
                            required: 'Vị trí không được để trống',
                            maxLength: { value: 500, message: 'Tối đa 500 ký tự' }
                        }, { xs: 'span 12' })}

                        <Box sx={{ gridColumn: 'span 12', mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" color={SECONDARY_COLOR} fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                <GroupIcon fontSize="small" /> Cơ cấu & Quản lý
                            </Typography>
                        </Box>

                        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                            <Controller
                                name="parent"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        size="small"
                                        options={departmentList?.filter(d => d.id !== data?.id) || []}
                                        getOptionLabel={(option) => {
                                            if (!option) return '';
                                            if (typeof option === 'string') return option;
                                            return `[${option.cid}] ${option.name}`;
                                        }}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        onChange={(_, value) => field.onChange(value)}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Phòng ban cấp trên" 
                                                placeholder="Chọn phòng ban cha"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <InputAdornment position="start"><CorporateFareIcon fontSize="small" /></InputAdornment>
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Box>

                        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                            <Controller
                                name="manager"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        size="small"
                                        options={employeeList || []}
                                        getOptionLabel={(option) => {
                                            if (!option) return '';
                                            if (typeof option === 'string') return option;
                                            return `${option.name || ''} (${option.cid || ''})`.trim();
                                        }}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        onChange={(_, value) => field.onChange(value)}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Người quản lý" 
                                                placeholder="Chọn nhân viên quản lý"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment>
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e9ecef', gap: 1.5 }}>
                    <Button 
                        onClick={onClose} 
                        variant="outline" 
                        disabled={loading}
                        style={{ minWidth: '100px', fontWeight: 600 }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handlePreSave} 
                        variant="primary" 
                        disabled={loading}
                        style={{ 
                            minWidth: '120px', 
                            background: PRIMARY_COLOR,
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        {data ? 'Cập Nhật' : 'Lưu Lại'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={openConfirm}
                title={`Xác nhận ${data ? "cập nhật" : "thêm mới"}`}
                content={`Bạn có chắc chắn muốn ${data ? "cập nhật" : "thêm"} phòng ban "${getValues().name}" không?`}
                onClose={() => setOpenConfirm(false)}
                onConfirm={() => handleSave(getValues())}
                loading={loading}
            />
        </FormProvider>
    );
};

export default React.memo(DialogDepartment);
