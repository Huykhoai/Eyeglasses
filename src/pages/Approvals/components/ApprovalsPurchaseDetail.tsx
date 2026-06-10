import { Box, Grid, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import CardComponent from "./CardComponent";
import { formatPrice } from "@/utils/formatPrice";
import type { PurchaseQuotationType, SelectedProduct } from "../../Quote/config/types";
import type { ColumnDef } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Pagination from "@/components/common/Pagination/Pagination";

const ApprovalsPurchaseDetail = ({ data }: { data: PurchaseQuotationType }) => {
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const { showNotification } = useNotification();

    const displayProducts = useMemo(() => {
        return data?.products?.slice((page - 1) * size, page * size);
    }, [data, page, size]);

    const { data: displayedProducts } = useQuery<SelectedProduct[]>({
        queryKey: ['items-detail-quotation', page, size, displayProducts],
        queryFn: async () => {
            try {
                const response = await axiosClient.post(`/api/purchase-quotation/items-detail`, displayProducts);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: displayProducts?.length > 0,
        retry: false
    });

    const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setSize(Number(e.target.value));
    }, [setPage, setSize]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, [setPage]);

    const columns: ColumnDef[] = useMemo(() => [
        {
            key: "index",
            header: "STT",
            align: "center",
            width: "3vw",
            render: (_, index) => {
                const idx = index ?? 0;
                return (
                    <Typography variant="body2" align="center" fontSize={12} noWrap>
                        {(page - 1) * size + idx + 1}
                    </Typography>
                )
            }
        },
        {
            key: "cid",
            header: "Mã sản phẩm",
            align: "center",
            width: "9vw",
            render: (item: SelectedProduct) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
            )
        },
        {
            key: "name",
            header: "Tên sản phẩm",
            align: "left",
            width: "20vw",
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
            )
        },
        {
            key: "quotedQty",
            header: "Số lượng",
            align: "right",
            width: "6vw",
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} align="right">
                    {item?.quotedQty || "-"}
                </Typography>
            )
        },
        {
            key: "quotedPrice",
            header: "Đơn giá",
            align: "right",
            width: "8vw",
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} align="right">
                    {formatPrice(item?.quotedPrice) || "-"}
                </Typography>
            )
        },
        {
            key: "lineTotal",
            header: "Thành tiền",
            align: "right",
            width: "8vw",
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} align="right" color="error">
                    {formatPrice(item?.lineTotal) || "-"}
                </Typography>
            )
        },
    ], [page, size])
    return (
        <Box className="d-flex flex-column card p-3 gap-2">
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardComponent icon="bi bi-hash" title="Mã báo giá" value={data?.cid || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardComponent icon="bi bi-file-earmark-text" title="Tên báo giá" value={data?.name || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardComponent icon="bi bi-currency-dollar" title="Tổng giá trị" value={formatPrice(data?.totalAmount) || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardComponent icon="bi bi-percent" title="Tỷ giá" value={`${formatPrice(data?.currencyValue || 0)} (${data?.currency?.cid || "-"})`} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardComponent icon="bi bi-person" title="Nhà cung cấp" value={data?.supplier?.name || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardComponent icon="bi bi-check-circle" title="Trạng thái" value={data?.status || "-"} />
                </Grid>
            </Grid>
            <div className="card p-3 approval-detail-card-table">
                <div className="table-scroll-container">
                    <table className='table-premium'>
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        style={{
                                            textAlign: col.align,
                                            minWidth: col.width,
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedProducts?.map((item, index) => (
                                <tr key={item.id || index}>
                                    {columns.map((col) => (
                                        <td key={col.key} align={col.align} style={{ maxWidth: col.width }}>
                                            {col.render
                                                ? col.render(item, index)
                                                : (item as any)[col.key] || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data?.products?.length > size && (
                    <div className="d-flex justify-content-between align-items-center"
                        style={{ padding: '0 10px' }}>
                        <Box className="d-flex gap-1 align-items-center">
                            <Typography variant="caption" fontWeight={600} color="text.secondary">Hiển thị: </Typography>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "auto", fontSize: '0.75rem', border: '', background: 'transparent', fontWeight: 700 }}
                                value={size}
                                onChange={handleSizeChange}
                            >
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </Box>
                        <Pagination
                            totalItems={data?.products?.length || 0}
                            page={page}
                            size={size}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </Box>
    );
};

export default React.memo(ApprovalsPurchaseDetail);