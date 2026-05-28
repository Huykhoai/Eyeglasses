import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import type { OtkCostItemResponse } from "@/pages/Otk/config/otkTypes";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

export const columnsInventoryReceiptDetail = (page: number, size: number): ColumnDef[] => [
    {
        key: 'stt',
        header: 'STT',
        width: '4vw',
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
        width: '10vw',
        align: 'center',
        render: (item: OtkCostItemResponse) => (
            <span className="badge-chip badge-neutral">{item.cid}</span>
        )
    },
    {
        key: 'name',
        header: 'Tên SP',
        width: '15vw',
        align: 'left',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11}>{item.name}</Typography>
        )
    },
    {
        key: 'contractCid',
        header: 'Mã HĐ',
        width: '10vw',
        align: 'center',
        render: (item: OtkCostItemResponse) => (
            <span className="badge-chip badge-info">{item.contractCid}</span>
        )
    },
    {
        key: 'acceptQty',
        header: 'SL đạt',
        width: '8vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" color="success.main" fontWeight={600}>
                {item.acceptQty}
            </Typography>
        )
    },
    {
        key: 'deniedQty',
        header: 'SL từ chối',
        width: '8vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" color="error.main" fontWeight={600}>
                {item.deniedQty}
            </Typography>
        )
    },
    {
        key: 'unitCost',
        header: 'Giá vốn/SP',
        width: '10vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" fontWeight={700} color="primary">
                {formatPrice(item.unitCost)}
            </Typography>
        )
    },
    {
        key: 'totalCost',
        header: 'Tổng giá trị kho',
        width: '12vw',
        align: 'right',
        render: (item: OtkCostItemResponse) => (
            <Typography variant="body2" fontSize={11} align="right" fontWeight={700} sx={{ color: primaryColor }}>
                {formatPrice(item.totalCost)}
            </Typography>
        )
    }
];
