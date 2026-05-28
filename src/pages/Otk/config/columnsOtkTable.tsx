import type { ColumnDef } from "@/types";
import { Chip, Typography } from "@mui/material";
import type { OtkResponse } from "./otkTypes";
import { DeliveryEnumLabel, type DeliveryEnumType } from "@/utils/DeliveryEnum";
import dayjs from "dayjs";

const statusColor: Record<string, 'default' | 'warning' | 'success' | 'error' | 'primary'> = {
    NOT_CHECKED: 'default',
    CHECKING: 'warning',
    CHECKED: 'success',
    APPROVED: 'primary',
    REJECTED: 'error',
    CANCELLED: 'error',
};

export const columnsOtkTable = (page: number, size: number, handleViewDelivery: (id: number) => void): ColumnDef[] => [
    {
        key: 'stt',
        header: 'STT',
        width: '3vw',
        align: 'center',
        render: (_: OtkResponse, index?: number | null) => (
            <Typography variant="body2" fontSize={12} align="center">
                {(page - 1) * size + (index ?? 0) + 1}
            </Typography>
        )
    },
    {
        key: 'deliverySchedule',
        header: 'Mã lịch giao hàng',
        width: '8vw',
        align: 'center',
        render: (item: OtkResponse) => (
            <span
                className="badge-chip badge-info"
                style={{ cursor: 'pointer' }}
                onClick={() => handleViewDelivery(item.deliverySchedule?.id || 0)}
            >
                {item.deliverySchedule?.cid || '-'}
            </span>
        )
    },
    {
        key: 'cid',
        header: 'Mã OTK',
        width: '8vw',
        align: 'center',
        render: (item: OtkResponse) => (
            <span className="badge-chip badge-neutral">{item.cid || '-'}</span>
        )
    },
    {
        key: 'inspectionDate',
        header: 'Ngày kiểm tra',
        width: '8vw',
        align: 'left',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.inspectionDate ? dayjs(item.inspectionDate).format('DD/MM/YYYY') : '-'}
            </Typography>
        )
    },
    {
        key: 'employee',
        header: 'Nhân viên',
        width: '10vw',
        align: 'left',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.employee?.name || '-'}
            </Typography>
        )
    },
    {
        key: 'status',
        header: 'Trạng thái',
        width: '7vw',
        align: 'center',
        render: (item: OtkResponse) => (
            <Chip
                size="small"
                label={DeliveryEnumLabel[item.status as DeliveryEnumType] || item.status}
                color={statusColor[item.status] || 'default'}
                sx={{ fontWeight: 600, fontSize: 11 }}
            />
        )
    },
    {
        key: 'totalScheduledQty',
        header: 'SL kiểm',
        width: '5vw',
        align: 'right',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={12} align="right">{item.totalScheduledQty}</Typography>
        )
    },
    {
        key: 'totalAcceptedQty',
        header: 'Đạt',
        width: '4vw',
        align: 'right',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={12} align="right" color="success.main" fontWeight={600}>
                {item.totalAcceptedQty}
            </Typography>
        )
    },
    {
        key: 'totalDeniedQty',
        header: 'Lỗi',
        width: '4vw',
        align: 'right',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={12} align="right" color="error.main" fontWeight={600}>
                {item.totalDeniedQty}
            </Typography>
        )
    },
    {
        key: 'totalExtraQty',
        header: 'Thừa',
        width: '4vw',
        align: 'right',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={12} align="right" color="warning.main">
                {item.totalExtraQty}
            </Typography>
        )
    },
    {
        key: 'totalLostQty',
        header: 'Thiếu',
        width: '4vw',
        align: 'right',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={12} align="right" color="info.main">
                {item.totalLostQty}
            </Typography>
        )
    },
    {
        key: 'note',
        header: 'Ghi chú',
        width: '10vw',
        align: 'left',
        render: (item: OtkResponse) => (
            <Typography variant="body2" fontSize={11} align="left"
                sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                {item.note || '-'}
            </Typography>
        )
    }
];
