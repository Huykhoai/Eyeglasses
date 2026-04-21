import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './QuotationRequest.css';
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilterQuote } from "./config/filterQuote";
import Select from "@/components/common/Select/Select";
import { useFetchPurchaseQuotation } from "./hooks/useFetchPurchaseQuotation";
import type { PurchaseQuotationType } from "./config/types";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { columns } from "./config/columnTable";
import { Tune, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Pagination from "@/components/common/Pagination/Pagination";
import { useBase64 } from "@/utils/base64";
import { useCurrency, useSupplier } from "@/hooks/UseAllData";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import PurchaseQuotationStatus from "@/utils/PurchaseQuotationEnum";
const Quote: React.FC = () => {
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
    });
    const [page, setPage] = useState<number>(Number(pageParam));
    const [size, setSize] = useState<number>(20);

    const { data: suppliers } = useSupplier();
    const { data: currencies } = useCurrency();
    const categories = useMemo(() => getFilterQuote((suppliers || []), (currencies || [])), [suppliers, currencies]);
    const columnOptions = useMemo(() => columns, []);

    const { data: purchaseQuotations, isLoading } = useFetchPurchaseQuotation(page, size, filter);

    const [selectedItem, setSelectedItem] = useState<PurchaseQuotationType | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        });
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

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, item: PurchaseQuotationType) => {
        setSelectedItem(item);
        setAnchorEl(event.currentTarget);
    }, [])

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, [])

    const handleEdit = useCallback(() => {
        if (!selectedItem) return;
        navigate(`/xnk/orders/quotation-request/update/${encode(selectedItem?.id.toString())}`);
    }, [navigate, selectedItem])

    const handleDelete = useCallback(() => {
        setOpenConfirm(true);
    }, [])

    const handleAdd = useCallback(() => {
        navigate('/xnk/orders/quotation-request/add');
    }, [navigate])

    const handleConfirmDelete = useCallback(() => {
        if (!selectedItem) return;
        createMutation.mutate(selectedItem.id);
        setOpenConfirm(false);
        setAnchorEl(null);
    }, [selectedItem])

    const createMutation = useMutation({
        mutationFn: async (id: number) => {
            return axiosClient.delete(`/api/purchase-quotation/${id}`);
        },
        onSuccess: (response: any) => {
            const message = response?.data?.message;
            if (response.status === 400) {
                showNotification('error', message || 'Lỗi khi xóa báo giá', 'Thất bại');
                return;
            }
            showNotification('success', message || 'Xóa báo giá thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['purchase-quotation'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Lỗi khi xóa báo giá';
            showNotification('error', message, 'Thất bại');
        }
    })

    return (
        <div className="quote-page-wapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <div className="quote-header">
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
                    Thêm báo giá
                </Button>
            </div>
            <div className="quote-card">
                <div className="table-scroll-container" style={{ minHeight: 'calc(100vh - 247px)' }}>
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
                            {(purchaseQuotations?.items ?? []).map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>
                                        <Typography variant="body2" align="center" fontSize={12}>
                                            {(page - 1) * size + index + 1}
                                        </Typography>
                                    </td>
                                    {columnOptions.map((col) => (
                                        <td key={col.key} style={{ width: col.width, textAlign: 'center' }}>
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
                                                disabled={createMutation.isPending || PurchaseQuotationStatus.CANCELLED.includes(item.status)}
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
                {(purchaseQuotations?.totalItems ?? 0) > 0 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            totalItems={purchaseQuotations?.totalItems ?? 0}
                            page={page}
                            size={size}
                            onChange={handlePageChange}
                        />
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
                content="Bạn có chắc chắn muốn xóa báo giá này?"
                loading={createMutation.isPending}
            />
        </div>
    );
};

export default Quote;