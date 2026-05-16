import type { ColumnDef } from "@/types";
import type { SelectedProduct } from "../config/types";
import { Typography, IconButton } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import { Delete as DeleteIcon } from '@mui/icons-material';
import TextField from "@/components/common/TextField/TextField";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";

export const columns = (
    productsMap: Map<number, any>,
    page: number,
    size: number,
    onDelete: (id: number) => void): ColumnDef[] => {

    const { setValue, getValues } = useFormContext();
    const [id, status] = getValues(['id', 'status'])

    const statusAccess = useMemo(() => !id || (status &&
        ([PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING] as PurchaseQuotationEnum[]).includes(status))
    , [status]);

    const handleUpdateQty = (id: number, qty: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            const quantity = qty > 0 ? qty : 1;
            newMap.set(id, { ...item, requestQty: quantity, quotedQty: quantity });
            setValue('products', newMap, { shouldValidate: true });
        }
    };

    const handleUpdatePrice = (id: number, price: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            const priceValue = price > 0 ? price : 1;
            newMap.set(id, { ...item, expectedPrice: priceValue, quotedPrice: priceValue });
            setValue('products', newMap, { shouldValidate: true });
        }
    };

    const handleUpdateQuoteQty = (id: number, qty: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            const quantity = qty > 0 ? qty : 1;
            newMap.set(id, { ...item, quotedQty: quantity });
            setValue('products', newMap, { shouldValidate: true });
        }
    };

    const handleUpdateQuotePrice = (id: number, price: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            const priceValue = price > 0 ? price : 1;
            newMap.set(id, { ...item, quotedPrice: priceValue });
            setValue('products', newMap, { shouldValidate: true });
        }
    };
    return [
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
                    isNumber
                    disabled={!statusAccess}
                    value={productsMap.get(item.productId)?.requestQty || item.requestQty}
                    onChange={(e) => handleUpdateQty(item.productId, Number(e.target.value))}
                    props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
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
                    isNumber
                    disabled={!statusAccess}
                    value={productsMap.get(item.productId)?.expectedPrice || item.expectedPrice}
                    onChange={(e) => handleUpdatePrice(item.productId, Number(e.target.value))}
                    props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
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
                    isNumber
                    disabled={!statusAccess}
                    value={productsMap.get(item.productId)?.quotedQty || item.quotedQty}
                    onChange={(e) => handleUpdateQuoteQty(item.productId, Number(e.target.value))}
                    props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
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
                    isNumber
                    disabled={!statusAccess}
                    value={productsMap.get(item.productId)?.quotedPrice || item.quotedPrice}
                    onChange={(e) => handleUpdateQuotePrice(item.productId, Number(e.target.value))}
                    props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
                />
            )
        },
        {
            key: 'lineTotal',
            header: 'Tổng tiền',
            align: 'right',
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} fontWeight={700} color="error">
                    {`$${formatPrice((productsMap.get(item.productId)?.quotedPrice || item.quotedPrice) * (productsMap.get(item.productId)?.quotedQty || item.quotedQty))}`}
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
                    onClick={() => onDelete(item.productId)}
                    sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    ];
};