import { Box, Typography, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useFormContext, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Button from "@/components/common/Button/Button";
import TextField from "@/components/common/TextField/TextField";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import DialogAddAttachment from "./DialogAddAttachment";
import type { AttachmentDto } from "../config/types";
import DialogViewImage from "./DialogViewImage";

const THEME_PRIMARY = import.meta.env.VITE_PRIMARY_COLOR;
const url = import.meta.env.VITE_API_URL;
const AttachmentDisplay = () => {
    const { setValue } = useFormContext();
    const contractId = useWatch({ name: 'id' });
    const isSideBar = useWatch({ name: 'isSideBar' });

    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const { data: files = [], isLoading } = useQuery<AttachmentDto[]>({
        queryKey: ['attachments', contractId],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/attachment/contract/${contractId}`);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi tải tài liệu';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!contractId,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await axiosClient.delete(`/api/attachment/delete/${id}`);
            return response.data;
        },
        onSuccess: () => {
            showNotification('success', 'Xóa tài liệu thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['attachments', contractId] });
            setOpenDelete(false);
        },
        onError: (error: any) => {
            showNotification('error', error?.response?.data?.message || 'Lỗi khi xóa tài liệu', 'Thất bại');
        }
    });

    const handleShowSideBar = useCallback(() => {
        setValue('isSideBar', true);
    }, [setValue]);

    const handleHideSideBar = useCallback(() => {
        setValue('isSideBar', false);
    }, [setValue]);

    const isPDF = useCallback((url: string) => {
        return url?.toLowerCase().endsWith(".pdf");
    }, []);

    const isImage = useCallback((url: string) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        return imageExtensions.some((ext) =>
            url?.toLowerCase().endsWith(ext)
        );
    }, []);

    const handleViewFile = (attachment: AttachmentDto) => {
        if (attachment.url) {
            window.open(`${url}${attachment.url}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleImageClick = (attachment: AttachmentDto) => {
        if (attachment.url) {
            if (isImage(attachment.url)) {
                setImagePreviewUrl(`${url}${attachment.url}`);
                setImagePreviewOpen(true);
            } else {
                handleViewFile(attachment);
            }
        }

    };

    const handleDownloadFile = async (attachment: AttachmentDto) => {
        if (!attachment.url) return;

        try {
            const fullUrl = `${url}${attachment.url}`;
            const response = await fetch(fullUrl);

            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', attachment.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error: any) {
            showNotification("error", `Lỗi khi tải file: ${error.message}`, "Thất bại")
        }
    };

    if (!isSideBar) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pt: 3,
                gap: 3
            }}>
                <IconButton onClick={handleShowSideBar} sx={{ color: '#6366f1' }}>
                    <KeyboardDoubleArrowLeftIcon />
                </IconButton>
                <Typography variant="caption" sx={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    letterSpacing: '0.1em'
                }}>
                    TỆP ĐÍNH KÈM ({files.length})
                </Typography>
            </Box>
        )
    }

    const filteredFiles = files.filter(f => {
        const searchMatch = !searchTerm ||
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!searchMatch) return false;

        if (filter === 'all') return true;
        const ext = f.url?.split('.').pop()?.toLowerCase();
        if (filter === 'pdf') return ext === 'pdf';
        if (filter === 'image') return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
        return true;
    });
    return (
        <Box sx={{ p: 1, width: '100%' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#fdfbff',
                p: 1,
                borderRadius: '12px',
                mb: 2,
                border: '1px solid rgba(113, 75, 103, 0.05)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Thu gọn">
                        <IconButton onClick={handleHideSideBar} size="small" sx={{ color: THEME_PRIMARY }}>
                            <KeyboardDoubleArrowRightIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <FolderIcon sx={{ color: THEME_PRIMARY }} />
                    <Typography variant="subtitle1" fontWeight={700} color="#1e293b" sx={{ whiteSpace: 'nowrap' }}>
                        Tệp đính kèm ({files.length})
                    </Typography>
                </Box>
                <Tooltip title={!contractId ? "Vui lòng tạo hợp đồng trước" : "Thêm tệp đính kèm"} placement="top">
                    <Button
                        variant="primary"
                        icon={<CloudUploadIcon />}
                        onClick={() => setOpenAdd(true)}
                        disabled={!contractId}
                    >

                        Thêm tệp đính kèm
                    </Button>
                </Tooltip>

            </Box>

            <TextField
                name="search"
                type="text"
                value={searchTerm}
                disabled={!contractId}
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
                <Chip
                    label={`Tất cả (${files.length})`}
                    onClick={() => setFilter('all')}
                    sx={{
                        bgcolor: filter === 'all' ? THEME_PRIMARY : '#f1f5f9',
                        color: filter === 'all' ? '#fff' : '#475569',
                        fontWeight: 700,
                        '&:hover': {
                            bgcolor: filter === 'all' ? THEME_PRIMARY : '#e2e8f0',
                            opacity: 0.9
                        }
                    }}
                />
                <Chip
                    icon={<ImageIcon sx={{
                        fontSize: '18px !important',
                        color: filter === 'image' ? '#fff !important' : '#64748b !important'
                    }} />}
                    label="Hình ảnh"
                    onClick={() => setFilter('image')}
                    variant={filter === 'image' ? 'filled' : 'outlined'}
                    sx={{
                        bgcolor: filter === 'image' ? THEME_PRIMARY : 'transparent',
                        color: filter === 'image' ? '#fff' : '#475569',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: filter === 'image' ? 'none' : '1px solid #e2e8f0',
                        '&:hover': {
                            bgcolor: filter === 'image' ? THEME_PRIMARY : '#f8fafc',
                            color: filter === 'image' ? '#fff' : THEME_PRIMARY,
                            borderColor: THEME_PRIMARY,
                            '& .MuiChip-icon': {
                                color: filter === 'image' ? '#fff !important' : `${THEME_PRIMARY} !important`
                            }
                        }
                    }}
                />
                <Chip
                    icon={<PictureAsPdfIcon sx={{
                        fontSize: '18px !important',
                        color: filter === 'pdf' ? '#fff !important' : '#64748b !important'
                    }} />}
                    label="PDF"
                    onClick={() => setFilter('pdf')}
                    variant={filter === 'pdf' ? 'filled' : 'outlined'}
                    sx={{
                        bgcolor: filter === 'pdf' ? THEME_PRIMARY : 'transparent',
                        color: filter === 'pdf' ? '#fff' : '#475569',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: filter === 'pdf' ? 'none' : '1px solid #e2e8f0',
                        '&:hover': {
                            bgcolor: filter === 'pdf' ? THEME_PRIMARY : '#f8fafc',
                            color: filter === 'pdf' ? '#fff' : THEME_PRIMARY,
                            borderColor: THEME_PRIMARY,
                            '& .MuiChip-icon': {
                                color: filter === 'pdf' ? '#fff !important' : `${THEME_PRIMARY} !important`
                            }
                        }
                    }}
                />
            </Stack>

            <Stack spacing={1.5} sx={{ position: 'relative', maxHeight: '40vh', minHeight: '34.6vh', overflowY: 'auto' }}>
                {isLoading && <Typography variant="caption" align="center">Đang tải...</Typography>}
                {filteredFiles.map((file) => (
                    <Box
                        key={file.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            border: '1px solid #f1f5f9',
                            borderRadius: '12px',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: THEME_PRIMARY,
                                boxShadow: '0 4px 12px rgba(113, 75, 103, 0.08)'
                            }
                        }}
                    >
                        <Box sx={{
                            width: 60,
                            height: 60,
                            bgcolor: '#f8fafc',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            overflow: 'hidden',
                            border: '1px solid #f1f5f9'
                        }}>
                            {isPDF(file.url || '') ? (
                                <PictureAsPdfIcon sx={{ width: 40, height: 40, color: '#ef4444' }} />
                            ) : (
                                <img
                                    src={`${url}${file.url}`}
                                    alt={file.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        transition: "transform 0.3s",

                                    }}
                                    onClick={() => handleImageClick(file)}
                                />
                            )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} color="#1e293b" noWrap sx={{ mb: 0.2 }}>
                                {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                                {file.description || "Không có mô tả"}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Tải xuống">
                                <IconButton onClick={() => handleDownloadFile(file)} size="small" sx={{ bgcolor: '#f0fdf4', color: '#166534' }}>
                                    <FileDownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                                <IconButton onClick={() => { setSelectedId(file.id!); setOpenDelete(true); }} size="small" sx={{ bgcolor: '#fef2f2', color: '#991b1b' }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                ))}
            </Stack>

            <DialogAddAttachment
                key={openAdd ? 'open' : 'closed'}
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                contractId={contractId}
            />

            <ConfirmDialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => selectedId && deleteMutation.mutate(selectedId)}
                title="Xác nhận xóa tài liệu"
                content="Bạn có chắc chắn muốn xóa tệp đính kèm này không? Hành động này không thể hoàn tác."
                loading={deleteMutation.isPending}
            />
            <DialogViewImage
                open={imagePreviewOpen}
                onClose={() => setImagePreviewOpen(false)}
                imagePreviewUrl={imagePreviewUrl}
            />
        </Box>
    );
};

export default React.memo(AttachmentDisplay);