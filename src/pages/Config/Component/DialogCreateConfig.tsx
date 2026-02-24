import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
    Typography,
    Autocomplete
} from '@mui/material';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';

interface DialogCreateConfigProps {
    data?: any;
    columns?: string[];
    columnsLabel?: { [key: string]: string };
    dataAutocomplete?: any;
    selectedConfig?: any;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DialogCreateConfig: React.FC<DialogCreateConfigProps> = ({ data, columns, columnsLabel, dataAutocomplete, selectedConfig, open, onClose, onSuccess }) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (data) {
                setFormData(data);
            } else {
                setFormData({});
            }
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!selectedConfig?.url) {
            showNotification('error', 'Không xác định được đường dẫn API', 'Lỗi');
            return;
        }

        const payload = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== null && value !== '' && value !== undefined)
        );
        setLoading(true);

        if (!formData.id) {
            try {
                await axiosClient.post(`/api${selectedConfig.url}/create`, payload);
                showNotification('success', 'Thêm mới thành công', 'Thành công');
                onSuccess?.();
                onClose();
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Thêm mới thất bại', 'Lỗi');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                await axiosClient.put(`/api${selectedConfig.url}/update/${formData.id}`, payload);
                showNotification('success', 'Cập nhật thành công', 'Thành công');
                onSuccess?.();
                onClose();
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Cập nhật thất bại', 'Lỗi');
            } finally {
                setLoading(false);
            }
        }
    };

    const fieldsToShow = (() => {
        const commonFields = columns?.filter(key => key !== 'modifiedAt' && key !== 'id' && key !== 'createdAt')

        if (selectedConfig?.name === 'Bảo hành') {
            commonFields?.push('value', 'type')
        } else if (selectedConfig?.name === "Group") {
            commonFields?.push('groupTypeDto')
        } else if (selectedConfig?.name === "Frame") {
            commonFields?.push('frameTypeDto')
        }
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
                                    fullWidth
                                    required
                                />
                            )} />
                    )
                }

                if (["frameTypeDto", "groupTypeDto"].includes(key)) {
                    const dataKey = key === "frameTypeDto" ? "frameType" : "groupType";
                    const options = dataAutocomplete?.[dataKey] || [];
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
                        label={columnsLabel?.[key]}
                        variant="outlined"
                        fullWidth
                        required
                    />
                )
            }
        }));
    })();

    return (
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
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#64748b',
                        px: 3,
                        '&:hover': { bgcolor: '#f1f5f9', color: '#334155' }
                    }}
                >
                    Hủy bỏ
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                    disableElevation
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        bgcolor: '#6366f1',
                        px: 3,
                        py: 1,
                        '&:hover': { bgcolor: '#4f46e5' }
                    }}
                >
                    {loading ? 'Đang xử lý...' : formData.id ? 'Cập nhập' : 'Thêm mới'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogCreateConfig;