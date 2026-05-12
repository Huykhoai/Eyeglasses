import { Box, Typography, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext } from 'react-hook-form';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Button from "@/components/common/Button/Button";
import TextField from "@/components/common/TextField/TextField";
import { useWatch } from "react-hook-form";

const THEME_PRIMARY = import.meta.env.VITE_PRIMARY_COLOR;

const AttachmentDisplay = () => {
    const { setValue } = useFormContext();
    const isSideBar = useWatch({ name: 'isSideBar' });
    const [filter, setFilter] = useState('all');

    const handleShowSideBar = useCallback(() => {
        setValue('isSideBar', true);
    }, [setValue]);

    const handleHideSideBar = useCallback(() => {
        setValue('isSideBar', false);
    }, [setValue]);
    // Mock data based on the image
    const [files] = useState([
        { id: 1, name: "Untitled diagram _ Merm...", desc: "Không có mô tả", type: "IMAGE", size: "1.2 MB" },
        { id: 2, name: "OTK_mockup", desc: "Không có mô tả", type: "PDF", size: "4.5 MB" },
        { id: 3, name: "Nguyen_Quang_Huy_524...", desc: "Không có mô tả", type: "PDF", size: "0.8 MB" },
    ]);

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
                    TỆP ĐÍNH KÈM
                </Typography>
            </Box>
        )
    }
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
                <Button
                    variant="primary"
                    icon={<CloudUploadIcon />}
                >
                    Thêm tệp đính kèm
                </Button>
            </Box>

            <TextField
                name="search"
                type="text"
                value={""}
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                onChange={(e) => {}}
            />

            <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
                <Chip
                    label={`Tất cả (${files.length})`}
                    onClick={() => setFilter('all')}
                    sx={{
                        bgcolor: filter === 'all' ? THEME_PRIMARY : '#f1f5f9',
                        color: filter === 'all' ? '#fff' : '#475569',
                        fontWeight: 700,
                        '&:hover': { bgcolor: filter === 'all' ? THEME_PRIMARY : '#e2e8f0' }
                    }}
                />
                <Chip
                    icon={<ImageIcon sx={{ fontSize: '18px !important', color: filter === 'image' ? '#fff !important' : 'inherit' }} />}
                    label="Hình ảnh (1)"
                    onClick={() => setFilter('image')}
                    variant="outlined"
                    sx={{
                        bgcolor: filter === 'image' ? THEME_PRIMARY : 'transparent',
                        color: filter === 'image' ? '#fff' : '#475569',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0'
                    }}
                />
                <Chip
                    icon={<PictureAsPdfIcon sx={{ fontSize: '18px !important', color: filter === 'pdf' ? '#fff !important' : 'inherit' }} />}
                    label="PDF (2)"
                    onClick={() => setFilter('pdf')}
                    variant="outlined"
                    sx={{
                        bgcolor: filter === 'pdf' ? THEME_PRIMARY : 'transparent',
                        color: filter === 'pdf' ? '#fff' : '#475569',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0'
                    }}
                />
            </Stack>

            <Stack spacing={1.5}>
                {files.map((file) => (
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
                            {file.type === 'PDF' ? (
                                <PictureAsPdfIcon sx={{ color: '#ef4444', fontSize: 32 }} />
                            ) : (
                                <ImageIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
                            )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} color="#1e293b" noWrap sx={{ mb: 0.2 }}>
                                {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {file.desc}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Xem">
                                <IconButton size="small" sx={{ bgcolor: '#f8fafc', color: '#64748b' }}>
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Tải xuống">
                                <IconButton size="small" sx={{ bgcolor: '#f0fdf4', color: '#166534' }}>
                                    <FileDownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Sửa">
                                <IconButton size="small" sx={{ bgcolor: '#eff6ff', color: '#1e40af' }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                                <IconButton size="small" sx={{ bgcolor: '#fef2f2', color: '#991b1b' }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                ))}
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Hiển thị {files.length} trên {files.length} file
                </Typography>
            </Box>
        </Box>
    );
};

export default React.memo(AttachmentDisplay);