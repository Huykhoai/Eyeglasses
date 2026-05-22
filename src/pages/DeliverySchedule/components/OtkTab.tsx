import { Box, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import {
    Add as AddIcon,
    Tune as TuneIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useBase64 } from "@/utils/base64";
import DeliveryEnum from "@/utils/DeliveryEnum";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import type { OtkResponse } from "../config/otkTypes";
import OtkDialog from "./OtkDialog";
import Button from "@/components/common/Button/Button";
import { columnsOtkTable } from "../config/columnsOtkTable";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

interface OtkTabProps {
    deliveryScheduleId: number;
}

const OtkTab: React.FC<OtkTabProps> = ({ deliveryScheduleId }) => {
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { encode } = useBase64();

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOtk, setSelectedOtk] = useState<OtkResponse | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const { data } = useQuery({
        queryKey: ['otk', 'list', deliveryScheduleId, page, size],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/otk/delivery/${deliveryScheduleId}/page/${page}?size=${size}`);
            return res.data;
        },
        enabled: !!deliveryScheduleId,
    });

    const otkList: OtkResponse[] = data?.data || [];
    const totalItems: number = data?.totalItems || 0;

    const { mutate: deleteOtk, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => axiosClient.delete(`/api/otk/${id}`),
        onSuccess: (response) => {
            const msg = response.data?.message || 'Xóa thành công';
            if (response.data?.status === 400) {
                showNotification('error', msg, 'Thất bại');
                return;
            }
            showNotification('success', msg, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['otk'] });
            queryClient.invalidateQueries({ queryKey: ['delivery'] });
            queryClient.invalidateQueries({ queryKey: ['delivery-items-for-otk', deliveryScheduleId] });
            setSelectedOtk(null);
            setDeleteDialogOpen(false);
        },
        onError: (err: any) => {
            showNotification('error', err?.response?.data?.message || 'Lỗi khi xóa OTK', 'Thất bại');
        }
    });

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, item: any) => {
        setSelectedOtk(item);
        setAnchorEl(event.currentTarget);
    }, [])

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, [])

    const handleOpenCreate = useCallback(() => {
        setDialogOpen(true);
    }, []);

    const handleOpenInspection = useCallback(() => {
        if (!selectedOtk) return;
        const encodedId = encode(selectedOtk.id);
        navigate(`/xnk/otk/inspection/${encodedId}`);
        setAnchorEl(null);
    }, [selectedOtk, encode, navigate]);

    const handleOpenCost = useCallback(() => {
        if (!selectedOtk) return;
        const encodedId = encode(selectedOtk.id);
        navigate(`/xnk/otk/cost/${encodedId}`);
        setAnchorEl(null);
    }, [selectedOtk, encode, navigate]);

    const handleOpenEdit = useCallback(() => {
        if (!selectedOtk) return;
        if (selectedOtk.status === DeliveryEnum.APPROVED) {
            showNotification('error', 'Không thể sửa OTK đã duyệt', 'Thất bại');
            return;
        }
        setDialogOpen(true);
    }, [selectedOtk]);

    const handleOpenDelete = useCallback(() => {
        if (!selectedOtk) return;
        if (selectedOtk.status === DeliveryEnum.APPROVED) {
            showNotification('error', 'Không thể xóa OTK đã duyệt', 'Thất bại');
            return;
        }
        setDeleteDialogOpen(true);
    }, [selectedOtk]);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedOtk(null);
        setAnchorEl(null);
    }, []);

    const columns = useMemo(() => columnsOtkTable(page, size), [page, size]
    );

    return (
        <Box>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                mb: 1, p: 2, borderRadius: '12px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(113,75,104,0.1)', color: primaryColor, display: 'flex' }}>
                            <VisibilityIcon sx={{ fontSize: 15 }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block' }}>Tổng phiếu OTK</Typography>
                            <Typography variant="subtitle1" fontWeight={600} color={primaryColor}>{totalItems}</Typography>
                        </Box>
                    </Box>
                </Stack>
                <Box className="d-flex gap-2">
                    <Select value={size} options={[
                        { label: '20', value: 20 },
                        { label: '50', value: 50 },
                        { label: '100', value: 100 },
                    ]} onChangeSize={(v) => { setSize(Number(v)); setPage(1); }} />
                    <Button variant="primary" icon={<AddIcon fontSize="small" />} onClick={handleOpenCreate}>
                        Tạo OTK
                    </Button>
                </Box>
            </Box>

            <div className="table-scroll-container" style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 300px)' }}>
                <table className="table-premium">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} style={{ width: col.width }}>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        {col.header}
                                    </Typography>
                                </th>
                            ))}
                            <th style={{ width: '5vw' }}>
                                <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                    Thao tác
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {otkList.length > 0 ? otkList.map((otk, index) => (
                            <tr key={otk.id}>
                                {columns.map((col) => (
                                    <td key={col.key} style={{ textAlign: col.align as any }}>
                                        {col.render ? (
                                            col.render(otk, index)
                                        ) : (
                                            <Typography variant="body2" fontSize={12} align={col.align as any}>
                                                {(otk as any)[col.key] || '-'}
                                            </Typography>
                                        )}
                                    </td>
                                ))}
                                <td style={{ textAlign: 'center', maxWidth: '5vw' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleOpenMenu(e, otk)}
                                        >
                                            <TuneIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                        Chưa có phiếu OTK nào
                                    </Typography>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination totalItems={totalItems} size={size} page={page} onChange={setPage} />
                </Box>
            )}

            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        minWidth: '150px'
                    }
                }}
            >
                <MenuItem onClick={handleOpenInspection} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <SearchIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    Kiểm tra hàng hóa
                </MenuItem>
                <MenuItem
                    onClick={handleOpenCost}
                    disabled={selectedOtk?.status !== DeliveryEnum.APPROVED}
                    sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <CalculateIcon fontSize="small" color={selectedOtk?.status === DeliveryEnum.APPROVED ? 'success' : 'disabled'} />
                    </ListItemIcon>
                    Tính tiền
                </MenuItem>
                <MenuItem onClick={handleOpenEdit} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={handleOpenDelete} sx={{ fontSize: '0.85rem', color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Xóa
                </MenuItem>
            </Menu>
            <OtkDialog
                key={selectedOtk?.id || 'new'}
                open={dialogOpen}
                onClose={handleCloseDialog}
                deliveryScheduleId={deliveryScheduleId}
                otkId={selectedOtk?.id || null}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => selectedOtk && deleteOtk(selectedOtk.id)}
                title="Xác nhận xóa"
                content={`Bạn có chắc chắn muốn xóa phiếu OTK "${selectedOtk?.cid}"?`}
                loading={isDeleting}
            />
        </Box>
    );
};

export default React.memo(OtkTab);
