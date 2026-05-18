import type { ColumnDef } from "@/types"
import type { DeliveryItem, SimpleDeliveryItem } from "./types"
import { Typography } from "@mui/material"
import { formatPrice } from "@/utils/formatPrice"
import type { Contract } from "@/pages/Contract/config/types"

export const columnsTableDeliveryItem = (
    page: number, size: number,
    contractsMap: Map<number, Contract>, itemsMap: Map<number, SimpleDeliveryItem>
): ColumnDef[] => [
        {
            key: 'stt',
            header: 'STT',
            width: '5%',
            render: (_, index?: number | null) => (page - 1) * size + (index || 0) + 1
        },
        {
            key: 'contractId',
            header: 'Mã hợp đồng',
            width: '10%',
            align: 'center',
            render: (item: DeliveryItem) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>
                    {contractsMap.get(item.contractId)?.cid || '-'}
                </span>
            ),
        },
        {
            key: 'cid',
            header: 'Mã sản phẩm',
            width: '10%',
            align: 'center',
            render: (item: DeliveryItem) => (
                <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>{item.cid}</span>
            ),
        },
        {
            key: 'name',
            header: 'Tên đầy đủ',
            width: '30%',
            align: 'left',
            render: (item: DeliveryItem) => (
                <Typography title={item.name} variant="subtitle2" fontSize={12} fontWeight={600}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'left',
                    }}>
                    {item.name}
                </Typography>
            ),
        },
        {
            key: 'unitPrice',
            header: 'Đơn giá',
            width: '10%',
            align: 'right',
            render: (item: DeliveryItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                    {formatPrice(item.unitPrice)}
                </Typography>
            ),
        },
        {
            key: 'scheduledQty',
            header: 'Số lượng',
            width: '10%',
            align: 'right',
            render: (item: DeliveryItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="primary">
                    {itemsMap.get(item.contractItemId)?.scheduledQty || 0}
                </Typography>
            ),
        },
        {
            key: 'lineTotal',
            header: 'Thành tiền',
            width: '15%',
            align: 'right',
            render: (item: DeliveryItem) => {
                const currentQty = itemsMap.get(item.contractItemId)?.scheduledQty || 0;
                const price = item.unitPrice || 0;
                return (
                    <Typography variant="body2" fontSize={12} fontWeight={600} color="error">
                        {formatPrice(price * currentQty)}
                    </Typography>
                );
            },
        },
    ]
