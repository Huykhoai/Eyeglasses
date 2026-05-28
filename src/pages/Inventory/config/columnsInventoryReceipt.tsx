import type { ColumnDef } from "@/types";
import { Chip, IconButton, Typography } from "@mui/material";
import { Visibility as ViewIcon } from '@mui/icons-material';
import dayjs from "dayjs";
import type { InventoryReceiptResponse } from "./types";

const statusColor: Record<string, 'default' | 'warning' | 'success' | 'error' | 'primary'> = {
    DRAFT: 'default',
    IMPORTED: 'success',
};

const statusLabel: Record<string, string> = {
    DRAFT: 'Bản nháp',
    IMPORTED: 'Nhập kho',
};

export const columnsInventoryReceipt = (
    page: number,
    size: number,
    handleViewDetail: (item: InventoryReceiptResponse) => void
): ColumnDef[] => [
        {
            key: 'stt',
            header: 'STT',
            width: '3vw',
            align: 'center',
            render: (_item: InventoryReceiptResponse, index?: number | null) => (
                <Typography variant="body2" fontSize={12} align="center">
                    {(page - 1) * size + (index ?? 0) + 1}
                </Typography>
            )
        },
        {
            key: 'cid',
            header: 'Mã phiếu',
            width: '8vw',
            align: 'center',
            render: (item: InventoryReceiptResponse) => (
                <span className="badge-chip badge-neutral">{item.cid}</span>
            )
        },
        {
            key: 'otkCid',
            header: 'Mã OTK',
            width: '8vw',
            align: 'center',
            render: (item: InventoryReceiptResponse) => (
                <span className="badge-chip badge-info">{item.otkCid}</span>
            )
        },
        {
            key: 'employeeName',
            header: 'Người tạo phiếu',
            width: '10vw',
            align: 'left',
            render: (item: InventoryReceiptResponse) => (
                <Typography variant="body2" fontSize={11}>{item.employeeName}</Typography>
            )
        },
        {
            key: 'receiptDate',
            header: 'Ngày tạo',
            width: '8vw',
            align: 'center',
            render: (item: InventoryReceiptResponse) => (
                <Typography variant="body2" fontSize={11} align="center">
                    {item.receiptDate ? dayjs(item.receiptDate).format('DD/MM/YYYY') : '-'}
                </Typography>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            width: '7vw',
            align: 'center',
            render: (item: InventoryReceiptResponse) => (
                <Chip
                    size="small"
                    label={statusLabel[item.status] || item.status}
                    color={statusColor[item.status] || 'default'}
                    sx={{ fontWeight: 600, fontSize: 10 }}
                />
            )
        },
        {
            key: 'note',
            header: 'Ghi chú',
            width: '12vw',
            align: 'left',
            render: (item: InventoryReceiptResponse) => (
                <Typography variant="body2" fontSize={11} sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {item.note || '-'}
                </Typography>
            )
        },
        {
            key: 'action',
            header: 'Chi tiết',
            width: '5vw',
            align: 'center',
            render: (item: InventoryReceiptResponse) => (
                <IconButton size="small" color="primary" onClick={() => handleViewDetail(item)}>
                    <ViewIcon fontSize="small" />
                </IconButton>
            )
        }
    ];
