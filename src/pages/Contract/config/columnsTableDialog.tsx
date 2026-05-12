import type { ColumnDef } from "@/types";
import type { Quotation, QuotationItem } from "./types";
import { Box, Checkbox, Typography } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import TextField from "@/components/common/TextField/TextField";
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";
import type { SimpleContractItem } from "./types";
import { useCallback, useMemo } from "react";
interface DialogImportRightProps {
    id: number;
    status: PurchaseQuotationEnum;
    initialQtyMap: Map<number, number>;
    initialItems: Map<number, SimpleContractItem>;
    quotationsMap: Map<number, Quotation>;
    onAddItems: (items: Map<number, SimpleContractItem>) => void;
}
export const columnsTableDialog = ({ id, status, initialQtyMap, initialItems, quotationsMap, onAddItems }: DialogImportRightProps): ColumnDef[] => {

    const isDraft = useMemo(() => ([PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING] as PurchaseQuotationEnum[])
        .includes(status), [status])

    const handleToggleSelect = useCallback((item: QuotationItem) => {
        const currentMap = new Map(initialItems);
        if (currentMap.has(item.id)) {
            currentMap.delete(item.id);
        } else {
            const oldContractQty = initialQtyMap.get(item.id) || 0;
            let allowedQty = item.allowedQty || 0;
            if (id && isDraft) {
                allowedQty += oldContractQty;
            }

            if (allowedQty <= 0) return;

            currentMap.set(item.id, {
                quotationItemId: item.id,
                quotationId: item.quotationId,
                allowedQty: allowedQty,
                contractQty: allowedQty || 1
            });
        }
        onAddItems(currentMap);
    }, [initialItems, onAddItems, id, isDraft, initialQtyMap]);

    const handleUpdateQty = useCallback((id: number, qty: number) => {
        const currentMap = new Map(initialItems);
        const item = currentMap.get(id);

        if (item) {
            const oldContractQty = initialQtyMap.get(id) || 0;
            let allowedQty = item.allowedQty || 0;
            if (id && isDraft) {
                allowedQty += oldContractQty;
            }

            if (allowedQty <= 0) return;
            currentMap.set(id, { ...item, contractQty: Math.max(0, Math.min(qty, allowedQty)) });
        }
        onAddItems(currentMap);
    }, [initialItems, onAddItems, id, isDraft, initialQtyMap]);

    return [
        {
            key: 'select',
            header: '',
            width: '5%',
            align: 'center',
            render: (item: QuotationItem) => {
                let allowedQty = item.allowedQty || 0;
                const isSelected = !!initialItems.get(item.id);
                const oldContractQty = initialQtyMap.get(item.id) || 0;

                if (id && isDraft) {
                    allowedQty += oldContractQty;
                }
                return (
                    <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item)}
                        disabled={allowedQty <= 0}
                    />
                )
            }
        },
        {
            key: 'quotationId',
            header: 'Mã báo giá',
            width: '6%',
            align: 'center',
            render: (item: QuotationItem) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>
                    {quotationsMap.get(item.quotationId)?.cid}
                </span>
            ),
        },
        {
            key: 'cid',
            header: 'Mã sản phẩm',
            width: '6%',
            align: 'center',
            render: (item: QuotationItem) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
            ),
        },
        {
            key: 'name',
            header: 'Tên đầy đủ',
            width: '33%',
            align: 'left',
            render: (item: QuotationItem) => (
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
            key: 'brand',
            header: 'Thương hiệu',
            width: '10%',
            align: 'left',
            render: (item: QuotationItem) => (
                <Typography variant="body2" fontSize={11} align="left">
                    {item?.brand || "-"}
                </Typography>
            )
        },
        {
            key: 'quoPrice',
            header: 'Giá báo giá',
            width: '10%',
            align: 'right',
            render: (item: QuotationItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                    {formatPrice(item.quoPrice)}
                </Typography>
            ),
        },
        {
            key: 'quoQty',
            header: 'Số lượng',
            width: '10%',
            align: 'right',
            render: (item: QuotationItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={600}>
                    {formatPrice(item.quoQty || 0)}
                </Typography>
            ),
        },
        {
            key: 'allocatedQty',
            header: 'Đã phân bổ',
            width: '10%',
            align: 'right',
            render: (item: QuotationItem) => {
                let allocatedQty = item.allocatedQty || 0;
                const oldContractQty = initialQtyMap.get(item.id) || 0;

                if (id && isDraft) {
                    allocatedQty -= oldContractQty;
                }
                return (
                    <Typography variant="body2" fontSize={12} fontWeight={600}>
                        {formatPrice(allocatedQty)}
                    </Typography>
                )
            },
        },
        {
            key: 'action',
            header: 'Thao tác',
            width: '10%',
            align: 'center',
            render: (item: QuotationItem) => {
                const isSelected = !!initialItems.get(item.id);
                const contractQty = initialItems.get(item.id)?.contractQty || 0;
                const oldContractQty = initialQtyMap.get(item.id) || 0;
                let allowedQty = item.allowedQty || 0;
                if (id && isDraft) {
                    allowedQty += oldContractQty;
                }

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='contractQty'
                                isNumber
                                value={contractQty}
                                onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                                props={{ min: 0, max: allowedQty, style: { textAlign: 'center', width: '5vw', padding: '3px 8px' } }}
                            />
                        ) : (
                            <Typography fontWeight="medium" fontSize={13}
                                sx={{
                                    display: "flex",
                                    backgroundColor: "#e8f5e9",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    color: "#2e7d32",
                                    fontWeight: "500",
                                    minWidth: "100%",
                                    justifyContent: 'right'
                                }}
                            >
                                {formatPrice(contractQty)}
                            </Typography>
                        )}
                    </Box>
                )
            }
        }
    ]
}