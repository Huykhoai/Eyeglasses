import React, { useMemo, useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box } from '@mui/material';
import { Close as CloseIcon, History as HistoryIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import Loading from '@/components/ui/Loading/Loading';
import { columnsLog } from '../config/columnsLog';
import type { WarehouseLog } from '../config/types';
import { useNavigate } from 'react-router-dom';
import type { PaginatedResponse } from '@/types';
import Pagination from '@/components/common/Pagination/Pagination';
import { useBase64 } from '@/utils/base64';

interface WarehouseLogDialogProps {
    productStockId: number | null;
    onClose: () => void;
}

const WarehouseLogDialog: React.FC<WarehouseLogDialogProps> = ({ productStockId, onClose }) => {
    const navigate = useNavigate();
    const { encode } = useBase64();

    const [page, setPage] = useState(1);
    const size = 20;

    const { data: logs, isLoading } = useQuery<PaginatedResponse<WarehouseLog>>({
        queryKey: ['warehouse-logs', 'page', page, 'size', size, 'productStockId', productStockId],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/inventory/logs/page/${page}/${productStockId}?size=${size}`);
            return { items: res.data.data, totalItems: res.data.totalItems };
        },
        enabled: !!productStockId,
    });

    const handleViewDetail = useCallback((item: WarehouseLog) => {
        const encodedOtkId = encode(item.otkId);
        const encodedDsId = encode(item.receiptId);
        navigate(`/inventory/receipt/${encodedOtkId}/${encodedDsId}`);
        onClose();
    }, [encode, navigate]);

    const columns = useMemo(() => columnsLog(handleViewDetail), []);
    return (
        <Dialog open={!!productStockId} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', minHeight: 500 } }}>
            <DialogTitle sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon sx={{ color: '#6366f1' }} />
                    <Typography variant="h6" fontWeight={700} color="#1e293b">
                        Lịch sử nhập kho
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, backgroundColor: '#fdfdfd' }}>
                {isLoading && <Loading fullPage message="Đang tải..." />}
                <div className="table-scroll-container" style={{ height: 'calc(100vh - 250px)' }}>
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
                            </tr>
                        </thead>
                        <tbody>
                            {(logs?.items ?? []).length > 0 ? (
                                (logs?.items ?? []).map((item, index) => (
                                    <tr key={item.id || index}>
                                        {columns.map((col) => (
                                            <td key={col.key} style={{ textAlign: col.align as any }}>
                                                {col.render ? (
                                                    col.render(item, index)
                                                ) : (
                                                    <Typography variant="body2" fontSize={12} align={col.align as any}>
                                                        {(item as any)[col.key] || '-'}
                                                    </Typography>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (!isLoading && (
                                <tr>
                                    <td colSpan={columns.length}>
                                        <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 4 }}>
                                            Chưa có sản phẩm nào trong kho
                                        </Typography>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        page={page}
                        size={size}
                        totalItems={logs?.totalItems || 0}
                        onChange={(page) => {
                            setPage(page);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WarehouseLogDialog;
