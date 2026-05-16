import { Box, Grid, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import CardComponent from "./CardComponent";
import { formatPrice } from "@/utils/formatPrice";
import type { ColumnDef } from "@/types";
import Pagination from "@/components/common/Pagination/Pagination";
import type { Contract, ContractItem } from "../../Contract/config/types";

import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";

const ApprovalsContractDetail = ({ data }: { data: Contract }) => {
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const { showNotification } = useNotification();

    const selectedItems = useMemo(() => {
        const rawItems = Array.isArray(data?.items) ? data.items : Array.from((data?.items as any)?.values() || []);
        return rawItems;
    }, [data]);

    const displayProductsSlice = useMemo(() => {
        return selectedItems.slice((page - 1) * size, page * size);
    }, [selectedItems, page, size]);

    const idString = useMemo(() => {
        return displayProductsSlice.map((item: any) => item.quotationItemId).join(',');
    }, [displayProductsSlice]);

    const { data: displayedProducts, isLoading } = useQuery<ContractItem[]>({
        queryKey: ['items-detail-contract-approval', page, size, idString],
        queryFn: async () => {
            try {
                const response = await axiosClient.post(`/api/contract/items-detail`, displayProductsSlice);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!idString,
        retry: false,
    });

    const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setSize(Number(e.target.value));
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const columns: ColumnDef[] = useMemo(() => [
        {
            key: "index",
            header: "STT",
            align: "center",
            width: "30px",
            render: (_, index) => (
                <Typography variant="body2" align="center">
                    {(page - 1) * size + (index ?? 0) + 1}
                </Typography>
            )
        },
        {
            key: "cid",
            header: "Mã sản phẩm",
            align: "center",
            width: "120px",
            render: (item: ContractItem) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
            )
        },
        {
            key: "name",
            header: "Tên sản phẩm",
            align: "left",
            width: "250px",
            render: (item: ContractItem) => (
                <Typography variant="subtitle2" fontSize={11} fontWeight={600}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textAlign: 'left',
                    }}>
                    {item.name}
                </Typography>
            )
        },
        {
            key: "contractQty",
            header: "Số lượng",
            align: "right",
            width: "80px",
            render: (item: ContractItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={700}>
                    {item?.contractQty || 0}
                </Typography>
            )
        },
        {
            key: "quoPrice",
            header: "Đơn giá",
            align: "right",
            width: "100px",
            render: (item: ContractItem) => (
                <Typography variant="body2" fontSize={12}>
                    {formatPrice(item?.quoPrice) || "0"}
                </Typography>
            )
        },
        {
            key: "lineTotal",
            header: "Thành tiền",
            align: "right",
            width: "120px",
            render: (item: ContractItem) => (
                <Typography variant="body2" fontSize={12} fontWeight={700} color="error">
                    {formatPrice(item?.lineTotal) || "0"}
                </Typography>
            )
        },
    ], [page, size]);

    return (
        <Box className="d-flex flex-column card p-3 gap-2">
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-hash" title="Mã hợp đồng" value={data?.cid || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-file-earmark-text" title="Tên hợp đồng" value={data?.name || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-person" title="Nhà cung cấp" value={data?.supplier?.name || "-"} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-calendar-event" title="Ngày ký" value={data?.signDate ? new Date(data.signDate).toLocaleDateString('vi-VN') : "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-calendar-check" title="Ngày giao dự kiến" value={data?.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toLocaleDateString('vi-VN') : "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-currency-exchange" title="Tỷ giá" value={`${formatPrice(data?.contractCurrencyValue || 0)} (${data?.currency?.name || "-"})`} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-cash-stack" title="Tổng tiền (Nguyên tệ)" value={formatPrice(data?.totalAmountForeign) || "0"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-cash" title="Tổng tiền (VND)" value={formatPrice(data?.totalAmountVnd) || "0"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-info-circle" title="Trạng thái" value={data?.status || "-"} />
                </Grid>

                {data?.note && (
                    <Grid size={{ xs: 12 }}>
                        <CardComponent icon="bi bi-chat-left-text" title="Ghi chú" value={data.note} />
                    </Grid>
                )}
            </Grid>

            <Box className="card p-3 approval-detail-card-table" sx={{ mt: 2, position: 'relative' }}>
                {isLoading && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>Đang tải sản phẩm...</Box>}
                <Box className="table-scroll-container">
                    <table className="table-premium">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ textAlign: col.align, minWidth: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(displayedProducts && displayedProducts.length > 0) ? (
                                displayedProducts.map((item: ContractItem, index: number) => (
                                    <tr key={item.id || index}>
                                        {columns.map((col) => (
                                            <td key={col.key} align={col.align} style={{ maxWidth: col.width }}>
                                                {col.render ? col.render(item, index) : (item as any)[col.key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} align="center">
                                        <Typography variant="body2" py={2} color="text.secondary">Không có sản phẩm nào</Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box>
                {selectedItems.length > size && (
                    <Box className="d-flex justify-content-between align-items-center mt-2 px-2">
                        <Box className="d-flex gap-1 align-items-center">
                            <Typography variant="caption" fontWeight={600} color="text.secondary">Hiển thị: </Typography>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "auto", fontSize: '0.75rem', fontWeight: 700, background: 'transparent' }}
                                value={size}
                                onChange={handleSizeChange}
                            >
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </Box>
                        <Pagination
                            totalItems={selectedItems.length}
                            page={page}
                            size={size}
                            onChange={handlePageChange}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default React.memo(ApprovalsContractDetail);
