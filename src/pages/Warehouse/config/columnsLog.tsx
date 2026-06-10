import { TrendingDown, TrendingUp } from "@mui/icons-material";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import type { WarehouseLog } from "./types";
import { formatPrice } from "@/utils/formatPrice";
import type { ColumnDef } from "@/types";

export const columnsLog = (handleViewDetail: (item: WarehouseLog) => void): ColumnDef[] => [
        {
            key: 'time',
            header: 'Thời gian',
            align: 'center',
            render: (row: WarehouseLog) => (
                <Typography variant="body2" fontWeight={500} color="#334155" fontSize={12}>
                    {dayjs(row.time).format('DD/MM/YYYY HH:mm')}
                </Typography>
            )
        },
        {
            key: 'receiptCid',
            header: 'Mã phiếu nhập',
            align: 'center',
            render: (row: WarehouseLog) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10, cursor: 'pointer' }} 
                onClick={() => handleViewDetail(row)}>
                    {row.receiptCid}
                </span>
            )
        },
        {
            key: 'quantityOld',
            header: 'Tồn trước',
            align: 'right',
            render: (row: WarehouseLog) => (
                <Typography variant="body2" color="text.secondary" fontSize={12}>
                    {formatPrice(row.quantityOld)}
                </Typography>
            )
        },
        {
            key: 'quantity',
            header: 'Phát sinh',
            align: 'right',
            render: (row: WarehouseLog) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {row.quantity > 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
                    ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
                    )}
                    <Typography variant="body2" fontWeight={600} color={row.quantity > 0 ? '#10b981' : '#ef4444'} fontSize={12}>
                        {row.quantity > 0 ? '+' : ''}{formatPrice(row.quantity)}
                    </Typography>
                </Box>
            )
        },
        {
            key: 'stockEnd',
            header: 'Tồn cuối',
            align: 'right',
            render: (row: WarehouseLog) => (
                <Typography variant="body2" fontWeight={700} color="#0f172a" fontSize={12}>
                    {formatPrice(row.quantityOld + row.quantity)}
                </Typography>
            )
        },
        {
            key: 'unitPrice',
            header: 'Đơn giá nhập',
            align: 'right',
            render: (row: WarehouseLog) => (
                <Typography variant="body2" fontWeight={500} color="#f59e0b" fontSize={12}>
                    {formatPrice(row.unitPrice)}
                </Typography>
            )
        }
    ];