import type { ColumnDef } from "@/types";
import { Avatar, Typography } from "@mui/material";
import dayjs from "dayjs";
import type { ProductStockResponse } from "./types";
import { formatPrice } from "@/utils/formatPrice";

const url = import.meta.env.VITE_API_URL;

export const columnsWarehouseStock = (
    page: number,
    size: number
): ColumnDef[] => [
        {
            key: 'stt',
            header: 'STT',
            width: '4vw',
            align: 'center',
            render: (_item: ProductStockResponse, index?: number | null) => (
                <Typography variant="body2" fontSize={12} align="center">
                    {(page - 1) * size + (index ?? 0) + 1}
                </Typography>
            )
        },
        {
            key: 'image',
            header: 'Hình ảnh',
            width: '6vw',
            align: 'center',
            render: (item: ProductStockResponse) => (
                <Avatar
                    src={item.imageUrl ? url + item.imageUrl : undefined}
                    alt={item.product?.name || ''}
                    variant="rounded"
                    sx={{ width: 40, height: 40, margin: '0 auto' }}
                />
            )
        },
        {
            key: 'productCid',
            header: 'Mã sản phẩm',
            width: '10vw',
            align: 'center',
            render: (item: ProductStockResponse) => (
                <span className="badge-chip badge-neutral">{item.product?.cid || '-'}</span>
            )
        },
        {
            key: 'productName',
            header: 'Tên sản phẩm',
            width: '20vw',
            align: 'left',
            render: (item: ProductStockResponse) => (
                <Typography variant="body2" fontSize={12}>{item.product?.name || '-'}</Typography>
            )
        },
        {
            key: 'brandName',
            header: 'Thương hiệu',
            width: '10vw',
            align: 'left',
            render: (item: ProductStockResponse) => (
                <Typography variant="body2" fontSize={11}>{item.brand?.name || '-'}</Typography>
            )
        },
        {
            key: 'groupName',
            header: 'Nhóm',
            width: '10vw',
            align: 'left',
            render: (item: ProductStockResponse) => (
                <Typography variant="caption" fontSize={11}>{item.group?.name || '-'}</Typography>
            )
        },
        {
            key: 'quantity',
            header: 'Số lượng tồn',
            width: '8vw',
            align: 'right',
            render: (item: ProductStockResponse) => (
                <Typography variant="body2" fontSize={13} align="right" fontWeight={700} color="primary">
                    {item.quantity?.toLocaleString('vi-VN') || '0'}
                </Typography>
            )
        },
        {
            key: 'costPrice',
            header: 'Giá nhập',
            width: '8vw',
            align: 'right',
            render: (item: ProductStockResponse) => (
                <Typography variant="body2" fontSize={13} align="right" fontWeight={700} color="primary">
                    {formatPrice(item.costPrice)}
                </Typography>
            )
        },
        {
            key: 'lastUpdate',
            header: 'Cập nhật lần cuối',
            width: '12vw',
            align: 'center',
            render: (item: ProductStockResponse) => (
                <Typography variant="body2" fontSize={11} align="center" color="text.secondary">
                    {item.lastUpdate ? dayjs(item.lastUpdate).format('DD/MM/YYYY HH:mm') : '-'}
                </Typography>
            )
        }
    ];
