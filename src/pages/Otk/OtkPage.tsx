import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import {
    Tune as TuneIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBase64 } from "@/utils/base64";
import DeliveryEnum from "@/utils/DeliveryEnum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import type { OtkResponse } from "./config/otkTypes";
import OtkDialog from "./components/OtkDialog";
import { columnsOtkTable } from "./config/columnsOtkTable";
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilterOtk } from "./config/getFilterOtk";
import { useFetchOtk } from "./hooks/useFetchOtk";

const OtkPage: React.FC = () => {
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { encode } = useBase64();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get('page') || 1;

    const [page, setPage] = useState(Number(pageParam));
    const [size, setSize] = useState(20);
    const [filter, setFilter] = useState<Record<string, any>>(() => {
        const params = Object.fromEntries(searchParams);
        const { page: _p, ...rest } = params;
        return rest;
    })

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOtk, setSelectedOtk] = useState<OtkResponse | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const categories = useMemo(() => getFilterOtk(), []);

    const { data: otks, isLoading } = useFetchOtk(page, size, filter);

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

    const handleOpenInspection = useCallback(() => {
        if (!selectedOtk) return;
        const encodedId = encode(selectedOtk.id);
        navigate(`/otk/inspection/${encodedId}`);
        setAnchorEl(null);
    }, [selectedOtk, encode, navigate]);

    const handleOpenCost = useCallback(() => {
        if (!selectedOtk) return;
        const encodedId = encode(selectedOtk.id);
        const deliveryId = encode(selectedOtk?.deliverySchedule?.id || 0);
        navigate(`/otk/cost/${encodedId}/${deliveryId}?cid=${encode(selectedOtk?.cid || '')}`);
        setAnchorEl(null);
    }, [selectedOtk, encode, navigate]);

    const handleOpenEdit = useCallback(() => {
        if (!selectedOtk) return;
        if (selectedOtk.status === DeliveryEnum.APPROVED) {
            showNotification('error', 'Không thể sửa OTK đã duyệt', 'Thất bại');
            return;
        }
        setDialogOpen(true);
        setAnchorEl(null);
    }, [selectedOtk, showNotification]);

    const handleOpenDelete = useCallback(() => {
        if (!selectedOtk) return;
        if (selectedOtk.status === DeliveryEnum.APPROVED) {
            showNotification('error', 'Không thể xóa OTK đã duyệt', 'Thất bại');
            return;
        }
        setDeleteDialogOpen(true);
        setAnchorEl(null);
    }, [selectedOtk, showNotification]);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedOtk(null);
        setAnchorEl(null);
    }, []);

    const handleViewDelivery = useCallback((id: number) => {
        const encodedId = encode(id);
        navigate(`/xnk/delivery-schedule/update/${encodedId}`);
    }, [encode, navigate]);

    const columns = useMemo(() => columnsOtkTable(page, size, handleViewDelivery), [page, size, handleViewDelivery]);

    const handleFilterChange = useCallback((filter: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filter).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        })
        setFilter(mapperFilter);
        setSearchParams(mapperFilter, { replace: true });
        setPage(1);
    }, [setSearchParams])

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
        setSearchParams({
            ...filter,
            page: page.toString()
        }, { replace: true });
    }, [setSearchParams, filter])

    const handleAdd = useCallback(() => {
        setSelectedOtk(null);
        setDialogOpen(true);
    }, []);

    return (
        <div className="contract-page-wapper">
            <div className="contract-header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại
                </Button>
                <div className="quote-filter-section">
                    <MultiFilterBar
                        categories={categories}
                        onFilterChange={handleFilterChange}
                        initialFilters={filter}
                    />
                </div>
                <div style={{ minWidth: 80 }}>
                    <Select
                        value={size}
                        options={[
                            { label: '20', value: 20 },
                            { label: '50', value: 50 },
                            { label: '100', value: 100 },
                        ]}
                        onChangeSize={(value) => setSize(Number(value))}
                    />
                </div>
                <Button
                    variant="primary"
                    onClick={handleAdd}
                >
                    Thêm OTK
                </Button>
            </div>

            <div className="glass-card">
                {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
                <div className="table-scroll-container" style={{ height: 'calc(100vh - 290px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
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
                            {(otks?.items ?? []).map((item, index) => (
                                <tr key={item.id || index}>
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ width: col.width, textAlign: col.align }}>
                                            {col.render ? (
                                                col.render(item)
                                            ) : (
                                                <Typography variant="body2" fontSize={12} align={col.align}>
                                                    {(item as any)[col.key] || '-'}
                                                </Typography>
                                            )}
                                        </td>
                                    ))}
                                    <td style={{ width: '5vw' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <IconButton
                                                disabled={isDeleting}
                                                size="small"
                                                onClick={(e) => handleOpenMenu(e, item)}
                                            >
                                                <TuneIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(otks?.totalItems || 0) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, borderTop: '1px solid #e2e8f0' }}>
                        <Pagination totalItems={otks?.totalItems || 0} size={size} page={page} onChange={handlePageChange} />
                    </Box>
                )}
            </div>

            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '12px',
                        minWidth: '180px',
                        p: 1
                    }
                }}
            >
                <MenuItem onClick={handleOpenInspection} sx={{ borderRadius: '8px', mb: 0.5 }}>
                    <ListItemIcon>
                        <SearchIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={500}>Kiểm tra hàng hóa</Typography>
                </MenuItem>
                <Tooltip title={DeliveryEnum.APPROVED.includes(selectedOtk?.status || '') ? '' : 'Phiếu OTK cần duyệt'}>
                    <span>
                        <MenuItem
                            onClick={handleOpenCost}
                            disabled={!DeliveryEnum.APPROVED.includes(selectedOtk?.status || '')}
                            sx={{ borderRadius: '8px', mb: 0.5 }}
                        >
                            <ListItemIcon>
                                <CalculateIcon fontSize="small" color={DeliveryEnum.APPROVED.includes(selectedOtk?.status || '')
                                    ? 'success' : 'disabled'} />
                            </ListItemIcon>
                            <Typography variant="body2" fontWeight={500}>Tính tiền</Typography>
                        </MenuItem>
                    </span>
                </Tooltip>
                <MenuItem onClick={handleOpenEdit} sx={{ borderRadius: '8px', mb: 0.5 }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={500}>Chỉnh sửa</Typography>
                </MenuItem>
                <Divider sx={{ my: 1, opacity: 0.5 }} />
                <MenuItem onClick={handleOpenDelete} sx={{ borderRadius: '8px', color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>Xóa phiếu</Typography>
                </MenuItem>
            </Menu>

            <OtkDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                otkId={selectedOtk?.id || null}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => selectedOtk && deleteOtk(selectedOtk.id)}
                title="Xác nhận xóa phiếu OTK"
                content={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa phiếu "${selectedOtk?.cid}"?`}
                loading={isDeleting}
            />
        </div>
    );
};

export default React.memo(OtkPage);
