import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import { Box, Checkbox, Grid, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useFetchItemsFromContracts } from "../hooks/useFetchItemsFromContracts";
import Loading from "@/components/ui/Loading/Loading";
import { columnsTableDialog } from "../config/columnsTableDialog";
import type { SimpleDeliveryItem } from "../config/types";
import type { Contract, ContractItem } from "@/pages/Contract/config/types";
import { useFormContext } from "react-hook-form";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { filterDialog } from "../config/getFilterDialog";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import axiosClient from "@/api/axiosClient";
import DeliveryEnum from "@/utils/DeliveryEnum";
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

interface DialogImportDeliveryRightProps {
    contractsMap: Map<number, Contract>;
    initialItems: Map<number, SimpleDeliveryItem>;
    onAddItems: (items: Map<number, SimpleDeliveryItem>) => void;
}

const DialogImportDeliveryRight: React.FC<DialogImportDeliveryRightProps> = ({ contractsMap, initialItems, onAddItems }) => {
    const { getValues } = useFormContext();
    const { showNotification } = useNotification();
    const [id, initialQtyMap, status] = getValues(["id", "initialQtyMap", "status"]);

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const [filter, setFilter] = useState<Record<string, any>>({});


    const contractIds = contractsMap ? Array.from(contractsMap.keys()).map(Number) : [];
    const { contractItems, isLoading, totalItems } = useFetchItemsFromContracts(contractIds, page, size, filter);
    const categories = filterDialog(Array.from(contractsMap.values()), []);
    const handleFilterChange = useCallback((filter: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filter).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        });
        setFilter(mapperFilter);
        setPage(1);
    }, []);

    const { mutate: fetchAllItems, isPending: isFetchingAll } = useMutation({
        mutationFn: async () => {
            const response = await axiosClient.post(`/api/contract/get-all-item-by-contracts`, contractIds);
            return response.data;
        },
        onSuccess: (allItems: SimpleDeliveryItem[]) => {
            const newItems = new Map(initialItems);
            allItems.forEach((item) => {
                if (newItems.has(item.contractItemId)) return;

                const oldContractQty = initialQtyMap.get(item.contractItemId) || 0;
                let allowedQty = item.allowedQty || 0;
                const isDraft = [DeliveryEnum.DRAFT, DeliveryEnum.PENDING].includes(status)

                if (id && isDraft) {
                    allowedQty += oldContractQty;
                }

                if (allowedQty <= 0) return;
                newItems.set(item.contractItemId, {
                    contractItemId: item.contractItemId,
                    contractId: item.contractId,
                    allowedQty: allowedQty,
                    scheduledQty: allowedQty || 0
                });
            });
            onAddItems(newItems);
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
            showNotification('error', message, 'Thất bại');
        }
    });

    const handleSelectAllProduct = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.checked) {
            onAddItems(new Map<number, SimpleDeliveryItem>());
            return;
        }
        fetchAllItems();
    }, [onAddItems, fetchAllItems]);

    const columns = columnsTableDialog({ id, status, initialQtyMap, initialItems, contractsMap, onAddItems });
    return (
        <Box className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {(isLoading || isFetchingAll) && <Loading fullPage message="Đang tải dữ liệu..." />}
            <Grid container spacing={1}>

                <Grid size={{ xs: 12, md: 6 }} >
                    <Box sx={{ flex: 1 }}>
                        <MultiFilterBar categories={categories} onFilterChange={handleFilterChange} />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} className="" >
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: `1px solid #e2e8f0`,
                            padding: '3px 7px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            background: '#ffffff'
                        }}>
                            <Checkbox
                                size="small"
                                sx={{ p: 0.5, color: primaryColor, '&.Mui-checked': { color: primaryColor } }}
                                onChange={handleSelectAllProduct}
                                checked={initialItems.size > 0 && initialItems.size >= totalItems}
                                indeterminate={initialItems.size > 0 && initialItems.size < totalItems}
                            />
                            <Typography color="#1e293b" fontSize="0.9rem" fontWeight={500} noWrap>
                                Tất cả
                            </Typography>
                        </Box>
                        <Box>
                            <Select
                                value={size}
                                options={[
                                    { label: '20', value: 20 },
                                    { label: '50', value: 50 },
                                    { label: '100', value: 100 },
                                ]}
                                onChangeSize={(value) => setSize(Number(value))}
                            />
                        </Box>
                        <Pagination
                            totalItems={totalItems}
                            page={page}
                            size={size}
                            onChange={(page: number) => setPage(page)}
                        />
                    </Box>
                </Grid>
            </Grid>
            <div className="table-scroll-container" style={{ flex: 1, overflowY: 'auto', marginTop: 1 }}>
                <table className="table-premium">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} style={{ minWidth: col.width }}>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                                        {col.header}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(contractItems && contractItems.length > 0)
                            ? contractItems.map((item: ContractItem, index: number) => {
                                const oldQty = initialQtyMap.get(item.id) || 0;
                                let allowedQty = item.allowedQty || 0;
                                const isDraft = [DeliveryEnum.DRAFT, DeliveryEnum.PENDING].includes(status)
                                if (id && isDraft) {
                                    allowedQty += oldQty;
                                }
                                const isDisabled = allowedQty <= 0;
                                return (
                                    <tr key={item.id || index} {...({ disabled: isDisabled } as any)}>
                                        {columns.map((col) => (
                                            <td key={col.key} style={{ maxWidth: col.width, textAlign: col.align }}>
                                                {col.render ? (
                                                    col.render(item)
                                                ) : (
                                                    <Typography variant="body2" fontSize={12} align={col.align}>
                                                        {(item as any)[col.key] || '-'}
                                                    </Typography>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={columns.length} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Không có dữ liệu
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </Box>
    );
};

export default React.memo(DialogImportDeliveryRight);
