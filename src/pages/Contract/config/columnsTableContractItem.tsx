import type { ColumnDef } from "@/types"
import type { ContractItem, Quotation, SimpleContractItem } from "./types"
import { Typography } from "@mui/material"
import { formatPrice } from "@/utils/formatPrice"
import { useBase64 } from "@/utils/base64"

export const columnsTableContractItem = (
    page: number, size: number,
    quotationsMap: Map<number, Quotation>, itemsMap: Map<number, SimpleContractItem>
): ColumnDef[] => [
    {
        key: 'stt',
        header: 'STT',
        render: (_, index?: number | null) => (page - 1) * size + (index || 0) + 1
    },
    {
        key: 'quotationId',
        header: 'Mã báo giá',
        width: '6%',
        align: 'center',
        render: (item: ContractItem) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10, cursor: 'pointer' }}>
                <a href={`/xnk/orders/quotation-request/update/${useBase64().encode(item.quotationId)}`}>
                    {quotationsMap.get(item.quotationId)?.cid}
                </a>
            </span>
        ),
    },
    {
        key: 'cid',
        header: 'Mã sản phẩm',
        width: '6%',
        align: 'center',
        render: (item: ContractItem) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
        ),
    },
    {
        key: 'name',
        header: 'Tên đầy đủ',
        width: '33%',
        align: 'left',
        render: (item: ContractItem) => (
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
        key: 'quoPrice',
        header: 'Giá báo giá',
        width: '10%',
        align: 'right',
        render: (item: ContractItem) => (
            <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                {formatPrice(item.quoPrice)}
            </Typography>
        ),
    },
    {
        key: 'contractQty',
        header: 'Số lượng',
        width: '10%',
        align: 'right',
        render: (item: ContractItem) => (
            <Typography variant="body2" fontSize={12} fontWeight={600}>
                {itemsMap.get(item.quotationItemId)?.contractQty || item.contractQty || 0}
            </Typography>
        ),
    },
    {
        key: 'lineTotal',
        header: 'Thành tiền',
        width: '10%',
        align: 'right',
        render: (item: ContractItem) => {
            const currentQty = itemsMap.get(item.quotationItemId)?.contractQty || item.contractQty || 0;
            return (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="error">
                    {formatPrice(item.quoPrice * currentQty)}
                </Typography>
            );
        },
    },
]