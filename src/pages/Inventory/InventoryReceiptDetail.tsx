import React, { useCallback, useMemo, useState } from "react";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import {
    Receipt as ReceiptIcon,
    Calculate as CalculateIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Loading from "@/components/ui/Loading/Loading";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import ConfirmImportDialog from "./components/ConfirmImportDialog";
import Button from "@/components/common/Button/Button";
import { useBase64 } from "@/utils/base64";
import { getFilterOtkReceipt } from "@/pages/Otk/config/getFilterOtkReceipt";
import '../DeliverySchedule/components/AddDeliverySchedule.css';
import { columnsInventoryReceiptDetail } from "./config/columnsInventoryReceiptDetail";
import { useFetchReceipt, useFetchReceiptItems } from "./hooks/useFetchReceipt";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const statusLabel: Record<string, string> = {
    DRAFT: 'Bản nháp',
    IMPORTED: 'Nhập kho',
};

const statusColor: Record<string, 'warning' | 'success' | 'default'> = {
    DRAFT: 'default',
    IMPORTED: 'success',
};

const InventoryReceiptDetail: React.FC = () => {
    const navigate = useNavigate();
    const { decode } = useBase64();
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    const { otkId: encodedOtkId, receiptId: encodedReceiptId } = useParams();
    const otkId = Number(decode(encodedOtkId || ''));
    const receiptId = Number(decode(encodedReceiptId || ''));

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [filter, setFilter] = useState<Record<string, any>>({});
    const [confirmOpen, setConfirmOpen] = useState(false);

    const categories = useMemo(() => getFilterOtkReceipt(), []);
    const columns = useMemo(() => columnsInventoryReceiptDetail(page, size), [page, size]);


    const { data: receiptInfo } = useFetchReceipt(receiptId);
    const { data: receiptItems, isLoading } = useFetchReceiptItems(otkId, page, size, filter);

    const { mutate: confirmImport, isPending: isConfirming } = useMutation({
        mutationFn: (payload: { mainWarehouseId: number, defectWarehouseId: number }) =>
            axiosClient.post(`/api/inventory/receipts/${receiptId}/confirm`, payload),
        onSuccess: (response) => {
            const msg = response.data?.message || 'Nhập kho thành công';
            if (response.data?.status === 400) {
                showNotification('error', msg, 'Thất bại');
                return;
            }
            showNotification('success', msg, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['receipt-info'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-receipts'] });
            setConfirmOpen(false);
        },
        onError: (err: any) => {
            showNotification('error', err?.response?.data?.message || 'Lỗi khi nhập kho', 'Thất bại');
        },
    });

    const handleFilterChange = useCallback((f: Record<string, any>) => {
        let mapped: Record<string, any> = {};
        Object.entries(f).forEach(([key, value]) => {
            mapped[key] = typeof value === 'object' ? value.id : value;
        });
        setFilter(mapped);
        setPage(1);
    }, []);

    const isImported = receiptInfo?.status === 'IMPORTED';

    return (
        <Box className="add-delivery-page-wapper">
            <Box className="add-delivery-header">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                    <Typography variant="h6" fontWeight={700}>
                        Phiếu nhập kho: <span style={{ color: primaryColor }}>{receiptInfo?.cid || '-'}</span>
                    </Typography>
                    {receiptInfo && (
                        <Chip
                            size="small"
                            label={statusLabel[receiptInfo.status] || receiptInfo.status}
                            color={statusColor[receiptInfo.status] || 'default'}
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    {!isImported && (
                        <Button variant="primary" onClick={() => setConfirmOpen(true)}>
                            <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} /> Nhập kho
                        </Button>
                    )}
                </Stack>
            </Box>

            <Box className="glass-card">
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon sx={{ color: primaryColor }} /> Thông tin phiếu nhập kho
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Mã phiếu</Typography>
                        <Typography variant="body2" fontWeight={600}>{receiptInfo?.cid || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Mã OTK</Typography>
                        <Typography variant="body2" fontWeight={600}>{receiptInfo?.otkCid || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Nhân viên</Typography>
                        <Typography variant="body2" fontWeight={600}>{receiptInfo?.employeeName || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Ghi chú</Typography>
                        <Typography variant="body2">{receiptInfo?.note || '-'}</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box className="glass-card" sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalculateIcon sx={{ color: primaryColor }} /> Chi tiết sản phẩm & giá vốn
                    </Typography>
                    <Box flex={1}>
                        <MultiFilterBar categories={categories} onFilterChange={handleFilterChange} initialFilters={filter} />
                    </Box>
                    <div style={{ minWidth: 70 }}>
                        <Select value={size} options={[
                            { label: '20', value: 20 }, { label: '50', value: 50 }, { label: '100', value: 100 }
                        ]} onChangeSize={(v) => setSize(Number(v))} />
                    </div>
                </Stack>

                {isLoading && <Loading fullPage message="Đang tải..." />}
                <div className="table-scroll-container" style={{ height: 'calc(100vh - 250px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={10} fontWeight={700} align="center">
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(receiptItems?.items ?? []).length > 0
                                ? (receiptItems?.items ?? []).map((item, index) => (
                                    <tr key={item.id || index}>
                                        {columns.map((col) => (
                                            <td key={col.key} style={{ width: col.width, textAlign: col.align }}>
                                                {col.render ? (
                                                    col.render(item, index)
                                                ) : (
                                                    <Typography variant="body2" fontSize={11} align={col.align}>
                                                        {(item as any)[col.key] || '-'}
                                                    </Typography>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : <tr>
                                    <td colSpan={columns.length} align="center">
                                        <Typography variant="body2" fontSize={12} align="center" sx={{ py: 4 }} color="text.secondary">
                                            Không có dữ liệu
                                        </Typography>
                                    </td>
                                </tr>}
                        </tbody>
                    </table>
                </div>

                {(receiptItems?.totalItems || 0) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid #e2e8f0' }}>
                        <Pagination totalItems={receiptItems?.totalItems || 0} size={size} page={page} onChange={setPage} />
                    </Box>
                )}
            </Box>

            <ConfirmImportDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={(mainWarehouseId, defectWarehouseId) => confirmImport({ mainWarehouseId, defectWarehouseId })}
                receiptCid={receiptInfo?.cid || ''}
                loading={isConfirming}
            />
        </Box>
    );
};

export default React.memo(InventoryReceiptDetail);
