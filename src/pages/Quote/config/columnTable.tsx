import type { ColumnDef } from "@/types";
import type { PurchaseQuotationType } from "./types";
import { Typography } from "@mui/material";
import PurchaseQuotationStatus from "@/utils/PurchaseQuotationEnum";

export const columns: ColumnDef[] = [
    {
        key: 'cid',
        header: 'Mã báo giá',
        width: '5vw',
        render: (item: PurchaseQuotationType) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
        )
    },
    {
        key: 'name',
        header: 'Tên báo giá',
        width: '15vw',
        render: (item: PurchaseQuotationType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.name}
            </Typography>
        )
    },
    {
        key: 'supplier',
        header: 'Nhà cung cấp',
        width: '20vw',
        render: (item: PurchaseQuotationType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item?.supplier?.name || "-"}
            </Typography>
        )
    },
    {
        key: 'status',
        header: 'Trạng thái',
        width: '10vw',
        render: (item: PurchaseQuotationType) => {
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
        key: 'requestDate',
        header: 'Ngày yêu cầu',
        width: '10vw',
        render: (item: PurchaseQuotationType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.requestDate ? new Date(item.requestDate).toLocaleString('vi-VN') : '-'}
            </Typography>
        )
    },
    {
        key: 'currency',
        header: 'Mã tiền tệ',
        width: '10vw',
        align: 'center',
        render: (item: PurchaseQuotationType) => (
            <Typography className="badge-chip badge-neutral" fontSize={11} align="center">
                {item?.currency?.cid || '-'}
            </Typography>
        )
    },
    {
        key: 'totalAmount',
        header: 'Tổng tiền',
        width: '10vw',
        render: (item: PurchaseQuotationType) => (
            <Typography variant="body2" fontSize={11} align="right">
                {item.totalAmount ? item.totalAmount.toLocaleString('vi-VN') : '-'}
            </Typography>
        )
    },
    {
        key: 'note',
        header: 'Ghi chú',
        width: '20vw',
        render: (item: PurchaseQuotationType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.note || '-'}
            </Typography>
        )
    }
];