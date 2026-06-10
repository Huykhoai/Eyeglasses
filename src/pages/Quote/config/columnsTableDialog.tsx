import { useMemo } from "react";
import type { ColumnDef } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Box, Checkbox, Typography } from "@mui/material";
import TextField from "@/components/common/TextField/TextField";
import type { SelectedProduct } from "./types";

export const columns = (
    productsMap: Record<number, any>,
    onAddItems: (items: Record<number, any>) => void,
    isAllSelected: boolean,
    isIndeterminate: boolean,
    handleToggleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void
): ColumnDef[] => useMemo(() => {

    const handleToggleSelect = (product: SelectedProduct) => {
        const newSelected = { ...productsMap };
        if (newSelected[product.productId]) {
            delete newSelected[product.productId];
        } else {
            newSelected[product.productId] = {
                productId: product.productId,
                requestQty: 1,
                expectedPrice: product.lastPurchasePrice || product.originalPrice || 0,
                quotedQty: 1,
                quotedPrice: product.lastPurchasePrice || product.originalPrice || 0,
            };
        }
        onAddItems(newSelected);
    };

    const handleUpdateQty = (id: number, qty: number) => {
        const newSelected = { ...productsMap };
        const item = newSelected[id];
        if (item) {
            newSelected[id] = { ...item, requestQty: qty || 0, quotedQty: qty || 0 };
        }
        onAddItems(newSelected);
    };

    const handleUpdatePrice = (id: number, price: number) => {
        const newSelected = { ...productsMap };
        const item = newSelected[id];
        if (item) {
            newSelected[id] = { ...item, expectedPrice: price, quotedPrice: price };
        }
        onAddItems(newSelected);
    };

    const handleUpdateQuoteQty = (id: number, qty: number) => {
        const newSelected = { ...productsMap };
        const item = newSelected[id];
        if (item) {
            newSelected[id] = { ...item, quotedQty: qty || 0 };
        }
        onAddItems(newSelected);
    };

    const handleUpdateQuotePrice = (id: number, price: number) => {
        const newSelected = { ...productsMap };
        const item = newSelected[id];
        if (item) {
            newSelected[id] = { ...item, quotedPrice: price };
        }
        onAddItems(newSelected);
    };
    return [
        {
            key: 'select',
            header: (
                <Checkbox
                    size="small"
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleToggleSelectAll}
                />
            ),
            width: '4vw',
            align: 'center',
            render: (item: SelectedProduct) => (
                <Checkbox
                    size="small"
                    checked={!!productsMap[item.productId]}
                    onChange={() => handleToggleSelect(item)}
                />
            ),
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
            render: (item: SelectedProduct) => {
                const isSelected = !!productsMap[item.productId];
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='requestQty'
                                isNumber
                                value={productsMap[item.productId]?.requestQty}
                                onChange={(e) => handleUpdateQty(item.productId, Number(e.target.value))}
                                props={{ min: 0, style: { textAlign: 'center', width: '5vw', padding: '3px 8px', fontSize: 12 } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.requestQty || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'expectedPrice',
            header: 'Giá dự kiến',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!productsMap[item.productId];
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='expectedPrice'
                                isNumber
                                value={productsMap[item.productId]?.expectedPrice}
                                onChange={(e) => handleUpdatePrice(item.productId, Number(e.target.value))}
                                props={{ min: 0, style: { textAlign: 'center', width: '5vw', padding: '3px 8px', fontSize: 12 } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.expectedPrice || item.lastPurchasePrice || item.originalPrice || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'quotedQty',
            header: 'SL báo giá',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!productsMap[item.productId];
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='quotedQty'
                                isNumber
                                value={productsMap[item.productId]?.quotedQty}
                                onChange={(e) => handleUpdateQuoteQty(item.productId, Number(e.target.value))}
                                props={{ min: 0, style: { textAlign: 'center', width: '5vw', padding: '3px 8px', fontSize: 12 } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.quotedQty || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'quotedPrice',
            header: 'Giá báo giá',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!productsMap[item.productId];
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='quotedPrice'
                                isNumber
                                value={productsMap[item.productId]?.quotedPrice}
                                onChange={(e) => handleUpdateQuotePrice(item.productId, Number(e.target.value))}
                                props={{ min: 0, style: { textAlign: 'center', width: '5vw', padding: '3px 8px', fontSize: 12 } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.quotedPrice || item.lastPurchasePrice || item.originalPrice || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'totalPrice',
            header: 'Tổng tiền',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = productsMap[item.productId];
                return (
                    <Typography variant="body2" fontSize={12} fontWeight={600} color="error">
                        {`$${formatPrice((isSelected?.quotedPrice || 0) * (isSelected?.quotedQty || 0))}`}
                    </Typography>

                )
            },
        }
    ]
}, [productsMap])