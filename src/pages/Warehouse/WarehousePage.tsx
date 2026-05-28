import React, { useCallback, useState } from "react";
import { Box, Card, CardActionArea, Chip, Grid, Stack, Typography, IconButton, Tooltip, Divider } from "@mui/material";
import {
    Warehouse as WarehouseIcon,
    Add as AddIcon,
    Inventory as InventoryIcon,
    EditOutlined as EditIcon,
    DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import { useBase64 } from "@/utils/base64";
import type { PaginatedResponse } from "@/types";
import '../DeliverySchedule/components/AddDeliverySchedule.css';
import WarehouseDialog from "./Components/WarehouseDialog";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const statusColor: Record<string, 'success' | 'default' | 'error'> = {
    ACTIVE: 'success',
    INACTIVE: 'default',
};

export interface WarehouseResponse {
    id: number;
    cid: string;
    name: string;
    address: string;
    status: string;
    type: string;
    createdAt?: string;
}

const WarehousePage: React.FC = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { encode } = useBase64();
    const queryClient = useQueryClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<WarehouseResponse | null>(null);

    const { data: warehouses, isLoading, refetch } = useQuery<PaginatedResponse<WarehouseResponse>>({
        queryKey: ['warehouses', 'all'],
        queryFn: async () => {
            try {
                const res = await axiosClient.get('/api/warehouse/page/1', { params: { size: 100 } });
                return { items: res.data.data, totalItems: res.data.totalItems };
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Lỗi hệ thống', 'Lỗi');
                throw error;
            }
        },
        retry: false,
    });

    const handleNavigateStock = useCallback((wh: WarehouseResponse) => {
        const encodedId = encode(wh.id);
        navigate(`/warehouse/stock/${encodedId}?name=${wh.name}`);
    }, [encode, navigate]);

    const handleOpenAdd = () => {
        setEditingWarehouse(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (wh: WarehouseResponse, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingWarehouse(wh);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Thao tác này sẽ VÔ HIỆU HÓA kho này. Bạn có đồng ý tiếp tục?")) {
            try {
                const res = await axiosClient.delete(`/api/warehouse/delete/${id}`);
                if (res.data.status === 200) {
                    showNotification('success', res.data.message || 'Xóa thành công!', 'Thành công');
                    handleSuccess();
                } else {
                    showNotification('error', res.data.message || 'Thao tác thất bại!', 'Lỗi');
                }
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Có lỗi xảy ra', 'Lỗi hệ thống');
            }
        }
    };

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        refetch();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', backgroundColor: '#f8fafc', padding: '16px', gap: '16px' }}>
            <Box className="add-delivery-header">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>Quay lại</Button>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarehouseIcon sx={{ color: primaryColor }} /> Quản lý kho
                    </Typography>
                </Stack>
                <Button variant="primary" onClick={handleOpenAdd}>
                    <AddIcon fontSize="small" sx={{ mr: 0.5 }} /> Thêm kho
                </Button>
            </Box>

            {isLoading && <Loading fullPage message="Đang tải..." />}

            <WarehouseDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleSuccess}
                initialData={editingWarehouse}
            />

            <Grid container spacing={3} sx={{ px: 1 }}>
                {(warehouses?.items ?? []).map((wh) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={wh.id}>
                        <Card
                            sx={{
                                borderRadius: '16px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 12px 40px rgba(99, 102, 241, 0.15)`,
                                    borderColor: primaryColor,
                                },
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <CardActionArea onClick={() => handleNavigateStock(wh)} sx={{ p: 0, flex: 1 }}>
                                <Box sx={{
                                    background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                    minHeight: 160,
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box sx={{
                                            width: 48, height: 48, borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <InventoryIcon sx={{ color: '#fff', fontSize: 26 }} />
                                        </Box>
                                        <Box className="d-flex gap-2">
                                            <Chip
                                                size="small"
                                                label={wh.type === 'TYPE_ACCEPTABLE' ? 'Kho hàng' : 'Kho hỏng'}
                                                color={statusColor[wh.type] || 'default'}
                                                sx={{ fontWeight: 600, fontSize: 10 }}
                                            />
                                            <Chip
                                                size="small"
                                                label={wh.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng'}
                                                color={statusColor[wh.status] || 'default'}
                                                sx={{ fontWeight: 600, fontSize: 10 }}
                                            />
                                            
                                        </Box>
                                    </Stack>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            {wh.cid}
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, mt: 0.5 }}>
                                            {wh.name}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" fontSize={12}
                                        sx={{
                                            display: '-webkit-box', WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            mt: 'auto'
                                        }}
                                    >
                                        📍 {wh.address || '---'}
                                    </Typography>
                                </Box>
                            </CardActionArea>

                            <Divider />
                            <Box sx={{ p: 1.5, px: 2, backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                                    Quản lý cấu hình
                                </Typography>
                                <Stack direction="row" spacing={0.5}>
                                    <Tooltip title="Chỉnh sửa kho">
                                        <IconButton size="small" onClick={(e) => handleOpenEdit(wh, e)} sx={{ color: primaryColor, bgcolor: `${primaryColor}10`, '&:hover': { bgcolor: `${primaryColor}20` } }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa kho">
                                        <IconButton size="small" color="error" onClick={(e) => handleDelete(wh.id, e)} sx={{ bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.light', color: 'white' } }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                ))}

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                        sx={{
                            borderRadius: '16px',
                            border: '2px dashed rgba(0,0,0,0.12)',
                            boxShadow: 'none',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: primaryColor,
                                background: `${primaryColor}08`,
                            },
                        }}
                    >
                        <CardActionArea onClick={handleOpenAdd} sx={{ p: 0 }}>
                            <Box sx={{
                                p: 3, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                minHeight: 180, gap: 1,
                            }}>
                                <AddIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                                <Typography variant="body2" color="text.disabled" fontWeight={600}>
                                    Thêm kho mới
                                </Typography>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>

        </div>
    );
};

export default React.memo(WarehousePage);
