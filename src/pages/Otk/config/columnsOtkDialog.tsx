import { Box, Checkbox, Typography } from "@mui/material";
import type { DeliveryItemDetail } from "./otkTypes";
import type { ColumnDef } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import TextField from "@/components/common/TextField/TextField";
import { useCallback } from "react";
import DeliveryEnum from "@/utils/DeliveryEnum";

export const columnsOtkDialog = (
    otkId: number | null,
    localItems: Map<number, any>,
    initialQtyMap: Map<number, number>,
    status: string,
    onAddItems: (items: Map<number, any>) => void,
    isAllSelected: boolean,
    isIndeterminate: boolean,
    onToggleSelectAll: (e: any) => void
): ColumnDef[] => {
    const isDraft = otkId && status !== DeliveryEnum.APPROVED;
    const handleToggleSelect = useCallback((item: DeliveryItemDetail) => {
        const currentMap = new Map(localItems);
        if (currentMap.has(item.id)) {
            currentMap.delete(item.id);
        } else {
            const oldQty = initialQtyMap.get(item.id) || 0;
            let allowedQty = item.allowedQty || 0;
            if (isDraft) {
                allowedQty += oldQty;
            }
            if (allowedQty <= 0) return;
            currentMap.set(item.id, {
                id: otkId ? localItems.get(item.id)?.id : null,
                deliveryItemId: item.id,
                otkQty: allowedQty
            });
        }
        onAddItems(currentMap);
    }, [otkId, localItems, onAddItems, initialQtyMap, status]);

    const handleUpdateQty = useCallback((item: DeliveryItemDetail, qty: number) => {
        const currentMap = new Map(localItems);
        const currentItem = currentMap.get(item.id);
        if (!currentItem) return;
        const oldQty = initialQtyMap.get(item.id) || 0;
        let allowedQty = item.allowedQty || 0;
        if (isDraft) {
            allowedQty += oldQty;
        }
        if (allowedQty <= 0) return;
        currentMap.set(item.id, { ...currentItem, otkQty: Math.max(0, Math.min(qty, allowedQty)) });
        onAddItems(currentMap);
    }, [otkId, localItems, onAddItems, initialQtyMap, status]);

    return [
        {
            key: 'select',
            header: (
                <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={onToggleSelectAll}
                />
            ),
            align: 'center',
            width: '40px',
            render: (item: DeliveryItemDetail) => {
                const isSelected = localItems.has(item.id);
                const oldQty = initialQtyMap.get(item.id) || 0;
                let allowedQty = item.allowedQty || 0;
                if (isDraft) {
                    allowedQty += oldQty;
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
            key: 'contractCid',
            header: 'Mã hợp đồng',
            align: 'center',
            render: (item: DeliveryItemDetail) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.contract?.cid}</span>
            ),
        },
        {
            key: 'cid',
            header: 'Mã sản phẩm',
            align: 'center',
            render: (item: DeliveryItemDetail) => (
                <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>{item.cid}</span>
            ),
        },
        {
            key: 'name',
            header: 'Tên đầy đủ',
            align: 'left',
            render: (item: DeliveryItemDetail) => (
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
            key: 'scheduleQty',
            header: 'SL hàng về',
            align: 'right',
            render: (item: DeliveryItemDetail) => (
                <Typography variant="body2" fontSize={12} fontWeight={600}>
                    {formatPrice(item.scheduleQty || 0)}
                </Typography>
            ),
        },
        {
            key: 'receivedQty',
            header: 'Đã phân bổ',
            align: 'right',
            render: (item: DeliveryItemDetail) => {
                let receivedQty = item.receivedQty || 0;
                const oldQty = initialQtyMap.get(item.id) || 0;
                if (isDraft) {
                    receivedQty -= oldQty;
                }
                return (
                    <Typography variant="body2" fontSize={12} fontWeight={600}>
                        {formatPrice(receivedQty)}
                    </Typography>
                );
            },
        },
        {
            key: 'otkQty',
            header: 'Thao tác',
            align: 'center',
            render: (item: DeliveryItemDetail) => {
                const isSelected = localItems.has(item.id);
                const otkQty = localItems.get(item.id)?.otkQty || 0;
                const oldQty = initialQtyMap.get(item.id) || 0;
                let allowedQty = item.allowedQty || 0;
                if (isDraft) {
                    allowedQty += oldQty;
                }

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isSelected ? (
                            <TextField
                                name='otkQty'
                                isNumber
                                value={otkQty}
                                onChange={(e) => handleUpdateQty(item, Number(e.target.value))}
                                props={{ min: 0, max: allowedQty, style: { textAlign: 'end', width: '5vw', padding: '3px 8px' } }}
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
                                    width: "5vw",
                                    justifyContent: 'end'
                                }}
                            >
                                {formatPrice(otkQty)}
                            </Typography>
                        )}
                    </Box>
                )
            }
        }
    ];
}