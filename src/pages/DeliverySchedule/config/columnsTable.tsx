import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import type { DeliverySchedule } from "./types";
import { formatPrice } from "@/utils/formatPrice";
import DeliveryEnum from "@/utils/DeliveryEnum";

export const columnsTable: ColumnDef[] = [
    {
        key: 'deliveryDate',
        header: 'Ngày giao',
        width: '8vw',
        align: 'center',
        render: (item: DeliverySchedule) => {
            let badgeClass = "delivery-badge";
            const deliveryDate = new Date(item.deliveryDate);
            const today = new Date();
            if (deliveryDate > today) {
                badgeClass += " delivery-future";
            } else if (deliveryDate.getTime() === today.getTime()) {
                badgeClass += " delivery-today";
            } else {
                badgeClass += " delivery-past";
            }
            return (
                <Typography variant="body2" fontSize={11} align="center" className={badgeClass}>
                    {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('vi-VN') : '-'}
                </Typography>
            )
        }

    },
    {
        key: 'cid',
        header: 'Mã LGH',
        width: '5vw',
        align: 'center',
        render: (item: DeliverySchedule) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
        )
    },
    {
        key: 'name',
        header: 'Tên lịch giao hàng',
        width: '12vw',
        align: 'left',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.name}
            </Typography>
        )
    },
    {
        key: 'billOfLadingNumber',
        header: 'Mã vận đơn',
        width: '10vw',
        align: 'center',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.billOfLadingNumber}
            </Typography>
        )
    },
    {
        key: 'supplier',
        header: 'Nhà cung cấp',
        width: '18vw',
        align: 'left',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item?.supplier?.name || "-"}
            </Typography>
        )
    },
    {
        key: 'status',
        header: 'Trạng thái',
        width: '8vw',
        align: 'center',
        render: (item: DeliverySchedule) => {
            let status = '';
            let color = '';
            switch (item.status) {
                case DeliveryEnum.COMPLETED:
                    status = 'Hoàn thành';
                    color = 'success';
                    break;
                case DeliveryEnum.PENDING:
                    status = 'Hàng đang về';
                    color = 'info';
                    break;
                case DeliveryEnum.INSPECTING:
                    status = 'Đang kiểm kê';
                    color = 'warning';
                    break;
                case DeliveryEnum.CANCELLED:
                    status = 'Đã hủy';
                    color = 'danger';
                    break;
                default:
                    status = 'Bản nháp';
                    color = 'neutral';
                    break;
            }
            return (
                <span className={`badge-chip badge-${color}`}>
                    {status}
                </span>
            )
        }
    },
    {
        key: 'totalProduct',
        header: 'Tổng sản phẩm',
        width: '8vw',
        align: 'right',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="right">
                {item.totalProduct || 0}
            </Typography>
        )
    },
    {
        key: 'totalAmountForeign',
        header: 'Tổng tiền',
        width: '10vw',
        align: 'right',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="right" color="error">
                {formatPrice(item.totalAmountForeign)}
            </Typography>
        )
    },
    {
        key: 'totalAmountVnd',
        header: 'Tổng tiền (VND)',
        width: '10vw',
        align: 'right',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="right" color="error">
                {formatPrice(item.totalAmountVnd)}
            </Typography>
        )
    },
    {
        key: 'note',
        header: 'Ghi chú',
        width: '12vw',
        render: (item: DeliverySchedule) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.note || '-'}
            </Typography>
        )
    }
];
