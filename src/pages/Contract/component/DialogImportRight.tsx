import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import { Box, Checkbox, Grid, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { useFetchItemsFromQuotations } from "../hooks/useFetchItemsFromQuotations";
import Loading from "@/components/ui/Loading/Loading";
import type { Quotation } from "../config/types";
import { columnsTableDialog } from "../config/columnsTableDialog";
import { useBrand } from "@/hooks/UseAllData";
import { filterDialog } from "../config/filterDialog";
import type { SimpleContractItem } from "../config/types";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { useFormContext } from "react-hook-form";
import PurchaseQuotationStatus from "@/utils/PurchaseQuotationEnum";
interface DialogImportRightProps {
    quotationsMap: Map<number, Quotation>;
    initialItems: Map<number, SimpleContractItem>;
    onAddItems: (items: Map<number, SimpleContractItem>) => void;
}
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR;
const DialogImportRight: React.FC<DialogImportRightProps> = ({ quotationsMap, initialItems, onAddItems }) => {
    const { data: brands } = useBrand();
    const { showNotification } = useNotification();
    const { getValues } = useFormContext();
    const [id, initialQtyMap, status] = getValues(["id", "initialQtyMap", "status"]);

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const [filter, setFilter] = useState<Record<string, any>>({});

    const quotationIds = quotationsMap ? Array.from(quotationsMap.keys()).map(Number) : [];
    const { quotationItems, isLoading, totalItems } = useFetchItemsFromQuotations(quotationIds, page, size, filter);
    const categories = useMemo(() => filterDialog(Array.from(quotationsMap.values()), brands || []), [brands, quotationsMap])

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
            const response = await axiosClient.post(`/api/purchase-quotation/get-all-item-by-quotations`, quotationIds);
            return response.data;
        },
        onSuccess: (allItems: SimpleContractItem[]) => {
            const newItems = new Map(initialItems);
            allItems.forEach((item) => {
                if (newItems.has(item.quotationItemId)) return;

                const oldContractQty = initialQtyMap.get(item.quotationItemId) || 0;
                let allowedQty = item.allowedQty || 0;
                const isDraft = [PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING].includes(status)

                if (id && isDraft) {
                    allowedQty += oldContractQty;
                }

                if (allowedQty <= 0) return;
                newItems.set(item.quotationItemId, {
                    quotationItemId: item.quotationItemId,
                    quotationId: item.quotationId,
                    allowedQty: allowedQty,
                    contractQty: allowedQty || 0
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
            onAddItems(new Map<number, SimpleContractItem>());
            return;
        }
        fetchAllItems();
    }, [onAddItems, fetchAllItems]);

    const columns = columnsTableDialog({ id, status, initialQtyMap, initialItems, quotationsMap, onAddItems });
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
                        {(quotationItems && quotationItems.length > 0)
                            ? quotationItems.map((item, index) => {
                                const oldContractQty = initialQtyMap.get(item.id) || 0;
                                let allowedQty = item.allowedQty || 0;
                                const isDraft = [PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING].includes(status)
                                if (id && isDraft) {
                                    allowedQty += oldContractQty;
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

export default React.memo(DialogImportRight);