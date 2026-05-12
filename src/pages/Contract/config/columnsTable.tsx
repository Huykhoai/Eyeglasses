import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import PurchaseQuotationStatus from "@/utils/PurchaseQuotationEnum";
import type { Contract } from "./types";
import { formatPrice } from "@/utils/formatPrice";

export const columns: ColumnDef[] = [
    {
        key: 'cid',
        header: 'Mã hợp đồng',
        width: '5vw',
        align: 'center',
        render: (item: Contract) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
        )
    },
    {
        key: 'name',
        header: 'Tên hợp đồng',
        width: '15vw',
        align: 'left',
        render: (item: Contract) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.name}
            </Typography>
        )
    },
    {
        key: 'supplier',
        header: 'Nhà cung cấp',
        width: '22vw',
        align: 'left',
        render: (item: Contract) => (
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
        render: (item: Contract) => {
            let status = '';
            let color = '';
            switch (item.status) {
                case PurchaseQuotationStatus.APPROVED:
                    status = 'Đã duyệt';
                    color = 'success';
                    break;
                case PurchaseQuotationStatus.PENDING:
                    status = 'Chờ duyệt';
                    color = 'info';
                    break;
                case PurchaseQuotationStatus.REJECTED:
                    status = 'Đã từ chối';
                    color = 'warning';
                    break;
                case PurchaseQuotationStatus.CANCELLED:
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
        key: 'signDate',
        header: 'Ngày ký',
        width: '8vw',
        align: 'center',
        render: (item: Contract) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.signDate ? new Date(item.signDate).toLocaleDateString('vi-VN') : '-'}
            </Typography>
        )
    },
    {
        key: 'currency',
        header: 'Mã tiền tệ',
        width: '7vw',
        align: 'center',
        render: (item: Contract) => (
            <Typography className="badge-chip badge-neutral" fontSize={11} align="center">
                {item?.currency?.cid || '-'}
            </Typography>
        )
    },
    {
        key: 'totalAmountForeign',
        header: 'Tổng tiền',
        width: '8vw',
        align: 'right',
        render: (item: Contract) => (
            <Typography variant="body2" fontSize={11} align="right" color="error">
                {formatPrice(item.totalAmountForeign)}
            </Typography>
        )
    },
    {
        key: 'note',
        header: 'Ghi chú',
        width: '15vw',
        render: (item: Contract) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.note || '-'}
            </Typography>
        )
    }
];