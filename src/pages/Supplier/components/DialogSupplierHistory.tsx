import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    IconButton,
    Typography,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import Loading from "@/components/ui/Loading/Loading";
import { useSupplierHistory } from '../hooks/useSupplierData';
import type { Supplier } from '../config/type';

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
};

interface DialogSupplierHistoryProps {
    supplierId: number | null;
    supplierName: string | '';
    open: boolean;
    onClose: () => void;
}

const DialogSupplierHistory: React.FC<DialogSupplierHistoryProps> = ({ supplierId, supplierName, open, onClose }) => {
    const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR || '#7b4b68';
    const { data: history, isLoading } = useSupplierHistory(supplierId);

    const historyColumns = [
        {
            key: 'cid',
            header: 'Mã NCC',
            width: '100px',
            render: (item: Supplier) => (
                <Chip label={item.cid} size="small" sx={{ fontWeight: 600, bgcolor: PRIMARY_COLOR + '10', color: PRIMARY_COLOR, borderRadius: '4px' }} />
            ),
        },
        {
            key: 'name',
            header: 'Tên nhà cung cấp',
            width: '200px',
            render: (item: Supplier) => (
                <Typography variant="body2" fontSize={12} fontWeight={500}>
                    {item.name}
                </Typography>
            ),
        },
        {
            key: 'contact',
            header: 'Người liên hệ',
            width: '120px',
            render: (item: Supplier) => (
                <Typography variant="body2" fontSize={12}>
                    {item.contact}
                </Typography>
            ),
        },
        {
            key: 'email_phone',
            header: 'Email & SĐT',
            width: '180px',
            render: (item: Supplier) => (
                <Box>
                    <Typography variant="caption" display="block" fontSize={11}>{item.email}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary" fontSize={11}>{item.phone}</Typography>
                </Box>
            ),
        },
        {
            key: 'bank_account',
            header: 'Ngân hàng & STK',
            width: '180px',
            render: (item: Supplier) => (
                <Box>
                    <Typography variant="caption" display="block" fontSize={11}>{item.advisingBank}</Typography>
                    <Typography variant="caption" display="block" fontWeight={600} fontSize={11}>{item.accountNo}</Typography>
                </Box>
            ),
        },
        {
            key: 'validFrom',
            header: 'Từ ngày',
            width: '130px',
            render: (item: Supplier) => (
                <Typography variant="body2" fontSize={11}>
                    {formatDate(item.validFrom)}
                </Typography>
            ),
        },
        {
            key: 'validTo',
            header: 'Đến ngày',
            width: '130px',
            render: (item: Supplier) => (
                <Box>
                    {!item.validTo ? (
                        <Chip label="Hiện tại" size="small" color="success" sx={{ fontSize: '0.65rem', height: '18px' }} />
                    ) : (
                        <Typography variant="body2" fontSize={11}>
                            {formatDate(item.validTo)}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            key: 'status',
            header: 'Trạng thái',
            width: '100px',
            render: (item: Supplier) => (
                <Box>
                    {!item.validTo ? (
                        <Chip label="Đang áp dụng" size="small" color="primary" variant="outlined" sx={{ fontSize: '0.65rem', height: '18px' }} />
                    ) : (
                        <Chip label="Lịch sử" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: '18px' }} />
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '12px', overflow: 'hidden' }
            }}
        >
            <DialogTitle sx={{
                p: 2,
                bgcolor: PRIMARY_COLOR,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
            }}>
                <HistoryIcon fontSize="medium" />
                <Typography variant="h6" fontSize="1.1rem" fontWeight={600} sx={{ flexGrow: 1, letterSpacing: '0.5px' }}>
                    Lịch sử thay đổi: {supplierName}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, bgcolor: '#f8fafc', position: 'relative', minHeight: '60vh' }}>
                {isLoading ? (
                    <Loading message="Đang tải lịch sử..." />
                ) : history && history.length > 0 ? (
                    <Box className="table-scroll-container" sx={{ overflowX: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    {historyColumns.map((col) => (
                                        <th key={col.key} style={{ width: col.width }}>
                                            <Typography variant="subtitle2" fontSize={11} fontWeight={700}>
                                                {col.header}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, index) => (
                                    <tr key={item.id || index}>
                                        {historyColumns.map((col) => (
                                            <td key={col.key} style={{ width: col.width }}>
                                                {col.render(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">Không tìm thấy lịch sử thay đổi</Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(DialogSupplierHistory);
