import { Box, Stack, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import {
    Inventory as InventoryIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import AddProductMenu from "@/pages/Product/components/AddProductMenu";
import DialogImportDelivery from "./DialogImportDelivery";
import { useWatch } from "react-hook-form";
import type { SimpleDeliveryItem } from "../config/types";
import type { Contract } from "@/pages/Contract/config/types";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { columnsTableDeliveryItem } from "../config/columnsTableDeliveryItem";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import { useFormContext } from "react-hook-form";
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const AddDeliveryTable = () => {
    const { getValues } = useFormContext();
    const [id, status] = getValues(['id', 'status']);
    const supplier = useWatch({ name: 'supplier' });
    const contractsMap: Map<number, Contract> = useWatch({ name: 'contracts' });
    const items: Map<number, SimpleDeliveryItem> = useWatch({ name: 'items' });

    const { showNotification } = useNotification();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    const columns = useMemo(() => columnsTableDeliveryItem(page, size, contractsMap, items), [page, size, contractsMap, items]);

    const statusAccess = useMemo(() => !id || (status &&
        ([PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING] as PurchaseQuotationEnum[]).includes(status))
        , [status, id]);

    const handleChangePage = useCallback((page: number) => {
        setPage(page);
    }, []);

    const handleChangeSize = useCallback((size: number | string) => {
        setSize(Number(size));
        setPage(1);
    }, []);

    const selectedProducts = useMemo(() => Array.from(items.values()), [items]);
    const displayProducts = useMemo(() => {
        return selectedProducts.slice((page - 1) * size, page * size);
    }, [selectedProducts, page, size]);

    const idString = useMemo(() => {
        return displayProducts.map((item: any) => item.contractItemId).join(',');
    }, [displayProducts]);

    const { data: displayedProducts } = useQuery<any[]>({
        queryKey: ['items-detail-delivery', page, size, idString],
        queryFn: async () => {
            try {
                const response = await axiosClient.post(`/api/delivery/items-detail`, displayProducts);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!idString,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const [openDialog, setOpenDialog] = useState(false);

    const handleImport = useCallback(() => {
        setOpenDialog(true);
    }, []);

    const handleCloseImport = useCallback(() => {
        setOpenDialog(false);
    }, []);

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <Stack direction="row" spacing={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            p: 1,
                            borderRadius: '8px',
                            bgcolor: 'rgba(113, 75, 104, 0.1)',
                            color: primaryColor,
                            display: 'flex'
                        }}>
                            <InventoryIcon sx={{ fontSize: 13 }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block' }}>Tổng hợp đồng</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600} color={primaryColor}>{contractsMap.size}</Typography>
                                {contractsMap.size > 0 && (
                                    <Tooltip
                                        title={
                                            <Box sx={{ p: 0.5 }}>
                                                <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)', pb: 0.5 }}>
                                                    Danh sách mã HĐ:
                                                </Typography>
                                                {Array.from(contractsMap.values()).map((contract, idx) => (
                                                    <Typography key={idx} variant="caption" sx={{ display: 'block', py: 0.2 }}>
                                                        • {contract?.cid || "N/A"}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        }
                                        arrow
                                        placement="top"
                                    >
                                        <VisibilityIcon sx={{ fontSize: 16, color: primaryColor, cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: '1px', height: '40px', bgcolor: '#e2e8f0' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            p: 1,
                            borderRadius: '8px',
                            bgcolor: 'rgba(113, 75, 104, 0.1)',
                            color: primaryColor,
                            display: 'flex'
                        }}>
                            <AddIcon sx={{ fontSize: 15 }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block' }}>Tổng số lượng sản phẩm</Typography>
                            <Typography variant="subtitle1" fontWeight={600} color={primaryColor}>{items.size}</Typography>
                        </Box>
                    </Box>
                </Stack>
                {supplier ? (
                    <Box className="d-flex gap-2">
                        {items.size > 0 && (
                            <Select
                                value={size}
                                options={[
                                    { label: '20', value: 20 },
                                    { label: '50', value: 50 },
                                    { label: '100', value: 100 },
                                ]}
                                onChangeSize={handleChangeSize}
                            />
                        )}
                        <AddProductMenu
                            onAdd={handleImport}
                            onBulkAdd={() => { }}
                            disabled={!statusAccess} />
                    </Box>
                ) : (
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, fontStyle: 'italic' }}>
                        * Vui lòng chọn nhà cung cấp trước
                    </Typography>
                )}
            </Box>
            <div className="table-scroll-container" style={{ flex: 1, overflowY: 'auto', marginTop: 1, minHeight: '300px', maxHeight: '500px' }}>
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
                        {(displayedProducts && displayedProducts.length > 0)
                            ? displayedProducts.map((item, index) => (
                                <tr key={item.id || item.contractItemId || index}>
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ maxWidth: col.width, textAlign: col.align }}>
                                            {col.render ? (
                                                col.render(item, index)
                                            ) : (
                                                <Typography variant="body2" fontSize={12} align={col.align}>
                                                    {(item as any)[col.key] || '-'}
                                                </Typography>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            )) : (
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
            {true && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        totalItems={items.size}
                        size={size}
                        page={page}
                        onChange={handleChangePage}
                    />
                </Box>
            )}
            <DialogImportDelivery
                key={openDialog ? 'open' : 'closed'}
                open={openDialog}
                onClose={handleCloseImport}
                contractsMap={contractsMap}
            />
        </Box>
    );
};

export default React.memo(AddDeliveryTable);
