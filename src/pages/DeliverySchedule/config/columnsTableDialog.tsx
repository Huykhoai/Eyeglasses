import type { ColumnDef } from "@/types";
import { Box, Checkbox, Typography } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import TextField from "@/components/common/TextField/TextField";
import type { SimpleDeliveryItem } from "./types";
import type { Contract, ContractItem } from "@/pages/Contract/config/types";
import { useCallback, useMemo } from "react";
import DeliveryEnum, { type DeliveryEnumType } from "@/utils/DeliveryEnum";

interface DialogImportRightProps {
    id: number;
    status: DeliveryEnumType;
    initialQtyMap: Map<number, number>;
    initialItems: Map<number, SimpleDeliveryItem>;
    contractsMap: Map<number, Contract>;
    onAddItems: (items: Map<number, SimpleDeliveryItem>) => void;
}

export const columnsTableDialog = ({ id, status, initialQtyMap, initialItems, contractsMap, onAddItems }: DialogImportRightProps): ColumnDef[] => {

    const isDraft = useMemo(() => ([DeliveryEnum.DRAFT, DeliveryEnum.PENDING] as DeliveryEnumType[])
        .includes(status), [status])

    const handleToggleSelect = useCallback((item: ContractItem) => {
        const currentMap = new Map(initialItems);
        const itemId = item.id;
        if (currentMap.has(itemId)) {
            currentMap.delete(itemId);
        } else {
            const oldQty = initialQtyMap.get(itemId) || 0;
            let allowedQty = item.allowedQty || 0;
            if (id && isDraft) {
                allowedQty += oldQty;
            }

            if (allowedQty <= 0) return;

            currentMap.set(itemId, {
                contractItemId: itemId,
                contractId: item.contractId!,
                scheduledQty: allowedQty || 1,
                allowedQty: allowedQty
            });
        }
        onAddItems(currentMap);
    }, [initialItems, onAddItems, id, isDraft, initialQtyMap]);

    const handleUpdateQty = useCallback((itemId: number, qty: number) => {
        const currentMap = new Map(initialItems);
        const item = currentMap.get(itemId);

        if (item) {
            const oldQty = initialQtyMap.get(itemId) || 0;
            let allowedQty = item.allowedQty || 0;
            if (id && isDraft) {
                allowedQty += oldQty;
            }

            if (allowedQty <= 0) return;
            currentMap.set(itemId, { ...item, scheduledQty: Math.max(0, Math.min(qty, allowedQty)) });
        }
        onAddItems(currentMap);
    }, [initialItems, onAddItems, id, isDraft, initialQtyMap]);

    return [
        {
            key: 'select',
            header: '',
            width: '5%',
            align: 'center',
            render: (item: ContractItem) => {
                let allowedQty = item.allowedQty || 0;
                const isSelected = !!initialItems.get(item.id);
                const oldQty = initialQtyMap.get(item.id) || 0;

                if (id && isDraft) {
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
            key: 'contractId',
            header: 'Mã hợp đồng',
            width: '10%',
            align: 'center',
            render: (item: ContractItem) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>
                    {contractsMap.get(item.contractId!)?.cid}
                </span>
            ),
        },
        {
            key: 'cid',
            header: 'Mã SP',
            width: '10%',
            align: 'center',
            render: (item: ContractItem) => (
                <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>{item?.cid}</span>
            ),
        },
        {
            key: 'name',
            header: 'Tên đầy đủ',
            width: '35%',
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
            header: 'Đơn giá',
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
            header: 'Số lượng HĐ',
            width: '10%',
            align: 'right',
            render: (item: ContractItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={600}>
                    {formatPrice(item.contractQty)}
                </Typography>
            ),
        },
        {
            key: 'allocatedQty',
            header: 'Đã phân bổ',
            width: '10%',
            align: 'right',
            render: (item: ContractItem) => {
                let allocatedQty = item.allocatedQty || 0;
                const oldQty = initialQtyMap.get(item.id) || 0;

                if (id && isDraft) {
                    allocatedQty -= oldQty;
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
            header: 'Lịch Giao',
            width: '15%',
            align: 'center',
            render: (item: ContractItem) => {
                const isSelected = !!initialItems.get(item.id);
                const currentQty = initialItems.get(item.id)?.scheduledQty || 0;
                const oldQty = initialQtyMap.get(item.id) || 0;
                let allowedQty = item.allowedQty || 0;
                if (id && isDraft) {
                    allowedQty += oldQty;
                }

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isSelected ? (
                            <TextField
                                name='scheduledQty'
                                isNumber
                                value={currentQty}
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
                                    justifyContent: 'center'
                                }}
                            >
                                {formatPrice(currentQty)}
                            </Typography>
                        )}
                    </Box>
                )
            }
        }
    ]
}
