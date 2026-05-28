import Button from '@/components/common/Button/Button';
import './DeliverySchedule.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MultiFilterBar from '@/components/common/MultiFilterBar/MultiFilterBar';
import { useBase64 } from '@/utils/base64';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useSupplier } from '@/hooks/UseAllData';
import { getFilterDelivery } from './config/getFilterDelivery';
import Select from '@/components/common/Select/Select';
import { useFetchDelivery } from './hooks/useFetchDelivery';
import { columnsTable } from './config/columnsTable';
import type { DeliverySchedule } from './config/types';
import axiosClient from '@/api/axiosClient';
import PurchaseQuotationStatus from '@/utils/PurchaseQuotationEnum';
import Loading from '@/components/ui/Loading/Loading';
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Tune, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Pagination from '@/components/common/Pagination/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';

const DeliverySchedulePage = () => {
    const navigate = useNavigate();
    const { encode } = useBase64();
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get('page') || 1;

    const [filter, setFilter] = useState<Record<string, any>>(() => {
        const params = Object.fromEntries(searchParams);
        const { page: _p, ...rest } = params;
        return rest;
    })
    const [page, setPage] = useState<number>(Number(pageParam));
    const [size, setSize] = useState<number>(20);

    const { data: suppliers } = useSupplier();
    const categories = useMemo(() => getFilterDelivery(suppliers || []), [suppliers]);
    const columns = useMemo(() => columnsTable, []);
    const { data: deliveries, isLoading } = useFetchDelivery(page, size, filter);

    const [selectedItem, setSelectedItem] = useState<DeliverySchedule | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

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

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, item: any) => {
        setSelectedItem(item);
        setAnchorEl(event.currentTarget);
    }, [])

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, [])

    const handleEdit = useCallback(() => {
        if (!selectedItem || !selectedItem?.id) return;
        navigate(`/xnk/delivery-schedule/update/${encode(selectedItem.id.toString())}`);
    }, [navigate, selectedItem])

    const handleDelete = useCallback(() => {
        setOpenConfirm(true);
    }, [])

    const handleAdd = useCallback(() => {
        navigate("/xnk/delivery-schedule/add")
    }, [navigate])

    const handleConfirmDelete = useCallback(() => {
        if (!selectedItem || !selectedItem.id) return;
        mutation.mutate(selectedItem.id);
        setOpenConfirm(false);
        setAnchorEl(null);
    }, [selectedItem])

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            return axiosClient.delete(`/api/delivery/${id}`);
        },
        onSuccess: (response: any) => {
            const message = response?.data?.message;
            if (response?.data?.status === 400) {
                showNotification('error', message || 'Lỗi khi xóa lịch giao', 'Thất bại');
                return;
            }
            showNotification('success', message || 'Xóa lịch giao thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['delivery'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Lỗi khi xóa lịch giao';
            showNotification('error', message, 'Thất bại');
        }
    })

    return (
        <div className="contract-page-wapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
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
                    Thêm lịch giao hàng
                </Button>
            </div>
            <div className="contract-card">
                <div className="table-scroll-container" style={{ height: 'calc(100vh - 247px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        STT
                                    </Typography>
                                </th>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                                <th>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        Thao tác
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(deliveries?.items ?? []).map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>
                                        <Typography variant="body2" align="center" fontSize={12}>
                                            {(page - 1) * size + index + 1}
                                        </Typography>
                                    </td>
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
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <IconButton
                                                disabled={mutation.isPending || PurchaseQuotationStatus.CANCELLED.includes(item.status || '')}
                                                size="small"
                                                onClick={(e) => handleOpenMenu(e, item)}
                                            >
                                                <Tune fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(deliveries?.totalItems ?? 0) > 0 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", minWidth: '15vw' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box className="delivery-past" sx={{ width: 12, height: 12, p: 0, borderRadius: '3px' }} />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Đã giao</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box className="delivery-today" sx={{ width: 12, height: 12, p: 0, borderRadius: '3px' }} />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Hôm nay</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box className="delivery-future" sx={{ width: 12, height: 12, p: 0, borderRadius: '3px' }} />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Dự kiến</Typography>
                            </Box>
                        </Box>
                        <Pagination
                            totalItems={deliveries?.totalItems ?? 0}
                            page={page}
                            size={size}
                            onChange={handlePageChange}
                        />
                        <div style={{ minWidth: '15vw' }}></div>
                    </div>
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
                        borderRadius: '8px',
                        minWidth: '150px'
                    }
                }}
            >
                <MenuItem onClick={handleEdit} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ fontSize: '0.85rem', color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Xóa
                </MenuItem>
            </Menu>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                content="Bạn có chắc chắn muốn xóa lịch giao hàng này?"
                loading={mutation.isPending}
            />
        </div>
    );
};

export default DeliverySchedulePage;