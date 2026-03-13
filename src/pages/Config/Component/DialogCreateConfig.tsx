import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Box,
    IconButton,
    Typography,
    Autocomplete
} from '@mui/material';
import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import type { ConfigLimitResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import type { ConfigCategoryItem } from '../hooks/useConfigData';

interface DialogCreateConfigProps {
    data?: any;
    columns?: string[];
    columnsLabel?: { [key: string]: string };
    dataAutocomplete?: ConfigLimitResponse[];
    selectedConfig?: ConfigCategoryItem | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DialogCreateConfig: React.FC<DialogCreateConfigProps> = ({ data, columns, columnsLabel, dataAutocomplete, selectedConfig, open, onClose, onSuccess }) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (open) {
            setFormData({});
            if (data) {
                setFormData(data);
            } else {
                setFormData(
                    columns?.reduce((acc: { [key: string]: any }, key) => {
                        acc[key] = null;
                        return acc;
                    }, {} as { [key: string]: any }) || {}
                )
            }
        }
    }, [open, columns]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };
    const handleSave = async () => {
        if (!selectedConfig?.url) {
            showNotification('error', 'API url is not defined', 'Error');
            return;
        }

        setLoading(true);

        if (!formData.id) {
            try {
                await axiosClient.post(`/api${selectedConfig.url}/create`, formData);
                showNotification('success', 'Add successfully', 'Successfully');
                queryClient.invalidateQueries({
                    queryKey: [`${selectedConfig.url.substring(1)}`]
                })

                onSuccess?.();
                onClose();
                
            } catch (error: any) {
                if (error.status === 400) {
                    const messages = error?.response?.data?.message?.split(",");
                    messages?.forEach((message: string) => {
                        showNotification('error', message, 'Error');
                    });
                } else {
                    showNotification('error', error?.response?.data?.message || 'Add failed', 'Error');
                }
            } finally {
                setLoading(false);
                setOpenDialog(false);
            }
        } else {
            try {
                await axiosClient.put(`/api${selectedConfig.url}/update/${formData.id}`, formData);
                showNotification('success', 'Update successfully', 'Successfully');
                queryClient.invalidateQueries({
                    queryKey: [`${selectedConfig.url.substring(1)}`]
                })
                onSuccess?.();
                onClose();
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Update failed', 'Error');
            } finally {
                setLoading(false);
                setOpenDialog(false);
            }
        }
    };

    const fieldsToShow = (() => {
        const commonFields = columns?.filter(key => key !== 'modifiedAt' && key !== 'id' && key !== 'createdAt')

        return commonFields?.map((key) => ({
            header: columnsLabel?.[key],
            dataKey: key,
            render: () => {
                if (key === "type") {
                    return (
                        <Autocomplete
                            options={["Tháng", "Năm"]}
                            getOptionLabel={(option) => option.toString()}
                            value={formData[key] || ''}
                            onChange={(_, value) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [key]: value?.toString() || ''
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={columnsLabel?.[key]}
                                    variant="outlined"
                                    onKeyDown={handleKeyDown}
                                    fullWidth
                                    required
                                />
                            )} />
                    )
                }

                if (["groupTypeDto"].includes(key)) {
                    const options = dataAutocomplete || [];
                    return (
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option: any) => option?.name || ''}
                            value={formData[key] || null}
                            onChange={(_, value: any) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [key]: value
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={columnsLabel?.[key]}
                                    variant="outlined"
                                    fullWidth
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                            )} />
                    )
                }
                return (
                    <TextField
                        key={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        label={columnsLabel?.[key]}
                        variant="outlined"
                        fullWidth
                        required={key !== "description"}
                        disabled={key === "cid" && !!formData.id}
                    />
                )
            }
        }));
    })();

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                <DialogTitle sx={{
                    m: 0,
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    bgcolor: '#f8fafc'
                }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {formData.id ? "Cập nhập" : "Thêm mới"} {selectedConfig?.name?.toLowerCase() || 'cấu hình'}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                            '&:hover': {
                                color: '#1e293b',
                                bgcolor: 'rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, pt: '24px !important' }}>
                    <DialogContentText sx={{ mb: 3, color: '#64748b' }}>
                        Điền đầy đủ các thông tin bên dưới để tạo mới cấu hình. Các trường có dấu * là bắt buộc.
                    </DialogContentText>
                    <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {fieldsToShow?.map((item) => (
                            <Box key={item.dataKey} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {item.render()}
                            </Box>
                        ))}
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    p: 2.5,
                    borderTop: '1px solid #e2e8f0',
                    bgcolor: '#f8fafc',
                    gap: 1.5
                }}>
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        variant='outline'
                        isLoading={loading}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={() => setOpenDialog(true)}
                        variant="primary"
                        disabled={loading}
                        isLoading={loading}
                    >
                        {loading ? 'Đang xử lý...' : formData.id ? 'Cập nhập' : 'Thêm mới'}
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                open={openDialog}
                title="Xác nhận"
                content={`Bạn có chắc chắn muốn ${formData.id ? 'cập nhập' : 'thêm mới'} cấu hình này không?`}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleSave}
                loading={loading}
            />
        </div>

    );
};

export default React.memo(DialogCreateConfig);