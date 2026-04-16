import type { ColumnDef } from "@/types";
import type { SelectedProduct } from "../config/types";
import { Typography, IconButton } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import { Delete as DeleteIcon } from '@mui/icons-material';
import TextField from "@/components/common/TextField/TextField";

export const columns = (
    page: number,
    size: number,
    onUpdateQty: (id: number, qty: number) => void,
    onUpdatePrice: (id: number, price: number) => void,
    onUpdateQuoteQty: (id: number, qty: number) => void,
    onUpdateQuotePrice: (id: number, price: number) => void,
    onDelete: (id: number) => void
): ColumnDef[] => [
        {
            key: 'stt',
            header: 'STT',
            render: (_, index?: number | null) => (page - 1) * size + (index || 0) + 1
        },
        {
            key: 'cid',
            header: 'Mã sản phẩm',
            width: '10vw',
            align: 'center',
            render: (item: SelectedProduct) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
            ),
        },
        {
            key: 'name',
            header: 'Tên đầy đủ',
            width: '15vw',
            render: (item: SelectedProduct) => (
                <Typography variant="subtitle2" fontSize={12} fontWeight={600}
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
            key: 'unit',
            header: 'Đơn vị',
            width: '10%',
            align: 'center',
            render: (item: SelectedProduct) => item.unit,
        },
        {
            key: 'tax',
            header: 'Thuế',
            align: 'right',
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="textSecondary">
                    {formatPrice(item.tax || 0)}%
                </Typography>
            ),
        },
        {
            key: 'originalPrice',
            header: 'Nguyên tệ',
            align: 'right',
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                    {formatPrice(item.originalPrice)}
                </Typography>
            ),
        },
        {
            key: 'requestQty',
            header: 'SL dự kiến',
            align: 'right',
            render: (item: SelectedProduct) => (
                <TextField
                    name='requestQty'
                    type="text"
                    value={item.requestQty}
                    onChange={(e) => onUpdateQty(item.id, Number(e.target.value) || 1)}
                    props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                />
            )

        },
        {
            key: 'expectedPrice',
            header: 'Giá dự kiến',
            align: 'right',
            render: (item: SelectedProduct) => (
                <TextField
                    name='expectedPrice'
                    type="text"
                    value={item.expectedPrice}
                    onChange={(e) => onUpdatePrice(item.id, Number(e.target.value) || 0)}
                    props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                />
            )
        },
        {
            key: 'quotedQty',
            header: 'SL báo giá',
            align: 'right',
            render: (item: SelectedProduct) => (
                <TextField
                    name='quotedQty'
                    value={item.quotedQty}
                    onChange={(e) => onUpdateQuoteQty(item.id, Number(e.target.value) || 0)}
                    props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                />
            )
        },
        {
            key: 'quotedPrice',
            header: 'Giá báo giá',
            align: 'right',
            render: (item: SelectedProduct) => (
                <TextField
                    name='quotedPrice'
                    value={item.quotedPrice}
                    onChange={(e) => onUpdateQuotePrice(item.id, Number(e.target.value) || 0)}
                    props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                />
            )
        },
        {
            key: 'totalPrice',
            header: 'Tổng tiền',
            align: 'right',
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} fontWeight={700} color="error">
                    {`$${formatPrice((item.quotedPrice || 0) * (item.quotedQty || 0))}`}
                </Typography>
            ),
        },
        {
            key: 'action',
            header: 'Hành động',
            align: 'center',
            render: (item: SelectedProduct) => (
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(item.id)}
                    sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    ];