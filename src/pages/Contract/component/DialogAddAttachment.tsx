import React, { useCallback, useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EventNote from '@mui/icons-material/EventNote';
import Notes from '@mui/icons-material/Notes';
import { ContentCopy as FileIcon } from "@mui/icons-material";
import Button from '@/components/common/Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { RHFTextField } from '@/components/common/TextField/RHFTextField';
import type { AttachmentDto } from '../config/types';

interface DialogAddAttachmentProps {
    open: boolean;
    onClose: () => void;
    contractId: number;
}

const DialogAddAttachment: React.FC<DialogAddAttachmentProps> = ({ open, onClose, contractId }) => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const methods = useForm<AttachmentDto>({
        defaultValues: {
            name: '',
            description: '',
            contractId: contractId,
        }
    });

    const { handleSubmit, setValue, reset } = methods;
    const nameValue = useWatch({ name: 'name', control: methods.control });

    const handleFile = useCallback((file: File) => {
        if (file) {
            setSelectedFile(file);
            if (!nameValue) {
                setValue('name', file.name, { shouldValidate: true });
            }
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
        }
    }, [setValue, nameValue]);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const mutation = useMutation({
        mutationFn: async (data: AttachmentDto) => {
            const formData = new FormData();
            const attachmentBlob = new Blob([JSON.stringify({ ...data })], { type: 'application/json' });
            formData.append('attachment', attachmentBlob);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await axiosClient.post('/api/attachment/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.status === 400) {
                showNotification('error', data.message, 'Thất bại');
                return;
            }
            showNotification('success', 'Tải tài liệu lên thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['attachments', contractId] });
            handleClose();
        },
        onError: (error: any) => {
            showNotification('error', error?.response?.data?.message || 'Lỗi khi tải tài liệu', 'Thất bại');
        }
    });

    const handleClose = useCallback(() => {
        reset();
        setPreviewUrl(null);
        setSelectedFile(null);
        onClose();
    }, [onClose, reset]);

    const handleRemoveFile = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', p: 1 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={700}>Thêm tệp đính kèm</Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <FormProvider {...methods}>
                <DialogContent dividers sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{ mb: 1, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventNote fontSize='small' />Tên tài liệu
                            </Typography>
                            <RHFTextField
                                name='name'
                                placeholder='Nhập tên tài liệu'
                                rules={{ required: 'Tên tài liệu là bắt buộc' }}
                            />
                        </Box>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{ mb: 1, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Notes fontSize='small' />Mô tả
                            </Typography>
                            <RHFTextField
                                name='description'
                                placeholder='Nhập mô tả'
                            />
                        </Box>

                        <Box className="d-flex flex-column">
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#475569' }}>
                                Chọn tệp tin
                            </Typography>
                            <Box
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    minWidth: 0,
                                    border: isDragging ? '2px dashed #6366f1' : '2px dashed #e2e8f0',
                                    borderRadius: '12px',
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isDragging ? 'rgba(99, 102, 241, 0.05)' : (selectedFile ? '#f8fafc' : '#fafafa'),
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    '&:hover': {
                                        borderColor: '#6366f1',
                                        bgcolor: 'rgba(99, 102, 241, 0.05)'
                                    }
                                }}>
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={onFileSelect}
                                />

                                {selectedFile ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: '50%' }}>
                                                <FileIcon sx={{ fontSize: 40, color: '#64748b' }} />
                                            </Box>
                                        )}
                                        <Box>
                                            <Typography variant="body2" fontWeight={700} color="#1e293b" noWrap>
                                                {selectedFile.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={handleRemoveFile}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                '&:hover': { bgcolor: '#fef2f2' }
                                            }}
                                        >
                                            <CloseIcon fontSize="small" sx={{ color: '#ef4444' }} />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box>
                                        <CloudUploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
                                        <Typography variant="body1" fontWeight={600} color="#475569">
                                            Kéo và thả tệp vào đây hoặc nhấp để chọn
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            Hỗ trợ mọi loại tệp tài liệu, hình ảnh (Tối đa 5MB)
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </FormProvider>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button variant="outline" onClick={handleClose} style={{ flex: 1 }}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit((data) => mutation.mutate(data))} isLoading={mutation.isPending} style={{ flex: 1 }}>Tải lên</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogAddAttachment;
