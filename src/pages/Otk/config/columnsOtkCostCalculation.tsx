import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import type { OtkCostItemResponse } from "./otkTypes";
import { formatPrice } from "@/utils/formatPrice";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';
const formatNumber = (val: number) => val.toLocaleString('vi-VN', { maximumFractionDigits: 2 });

export const columnsOtkCostCalculation = (page: number, size: number): ColumnDef[] => [
    {
        key: 'stt',
        header: 'STT',
        width: '3vw',
        align: 'center',
        render: (_item: OtkCostItemResponse, index?: number | null) => (
            <Typography variant="body2" fontSize={11} align="center">
                {(page - 1) * size + (index ?? 0) + 1}
            </Typography>
        )
    },
    {
        key: 'cid',
        header: 'Mã SP',
        width: '6vw',
        align: 'center',
        render: (item: OtkCostItemResponse) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>
                {item.cid}
            </span>
        )
    },
    {
        key: 'name',
        header: 'Tên SP',
        width: '15vw',
        align: 'left',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
                {item.name}
            </Typography>
        )
    },
    {
        key: 'contractCid',
        header: 'HĐ',
        width: '5vw',
        align: 'center',
        render: (item: OtkCostItemResponse) => (
            <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>
                {item.contractCid || '-'}
            </span>
        )
    },
    {
        key: 'otkQty',
        header: 'SL OTK',
        width: '5vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right">
                {formatPrice(item.otkQty || 0)}
            </Typography>
        )
    },
    {
        key: 'acceptQty',
        header: 'SL Đạt',
        width: '5vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" fontWeight={600} color="success.main">
                {formatPrice(item.acceptQty)}
            </Typography>
        )
    },
    {
        key: 'deniedQty',
        header: 'SL Lỗi',
        width: '5vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" fontWeight={600} color="error.main">
                {formatPrice(item.deniedQty)}
            </Typography>
        )
    },
    {
        key: 'unitPrice',
        header: 'Đơn giá',
        width: '6vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right">
                {formatNumber(item.unitPrice)}
            </Typography>
        )
    },
    {
        key: 'totalPrice',
        header: 'Giá trị hàng',
        width: '7vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right">
                {formatNumber(item.totalPrice)}
            </Typography>
        )
    },
    {
        key: 'weight',
        header: 'Tỉ trọng',
        width: '5vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" color="text.secondary">
                {(item.weight * 100).toFixed(2)}%
            </Typography>
        )
    },
    {
        key: 'allocatedFee',
        header: 'Chi phí PB',
        width: '6vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" color="#f59e0b" fontWeight={600}>
                {formatNumber(item.allocatedFee)}
            </Typography>
        )
    },
    {
        key: 'unitCost',
        header: 'Giá vốn/SP',
        width: '7vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={12} align="right" fontWeight={700}
                color={item.unitCost > 0 ? primaryColor : 'text.secondary'}>
                {item.acceptQty > 0 ? formatNumber(item.unitCost) : '-'}
            </Typography>
        )
    },
];
