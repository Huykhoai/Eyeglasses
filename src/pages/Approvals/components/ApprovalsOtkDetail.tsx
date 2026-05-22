import { Box, Grid, Typography, Divider } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import CardComponent from "./CardComponent";
import type { OtkItemResponse } from "../../DeliverySchedule/config/otkTypes";
import type { ColumnDef } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Pagination from "@/components/common/Pagination/Pagination";

interface OtkDetailData {
    id: number;
    cid: string;
    deliverySchedule: { id: number; name: string };
    employee: { id: number; name: string };
    inspectionDate: string;
    status: string;
    note: string;
    totalScheduledQty: number;
    totalAcceptedQty: number;
    totalDeniedQty: number;
    totalExtraQty: number;
    totalLostQty: number;
    items: { id: number; deliveryItemId: number; otkQty: number }[];
}

const ApprovalsOtkDetail = ({ data }: { data: OtkDetailData }) => {
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const { showNotification } = useNotification();

    const itemDtos = useMemo(() => {
        return data?.items?.slice((page - 1) * size, page * size) || [];
    }, [data, page, size]);

    const { data: displayedItems, isLoading } = useQuery<OtkItemResponse[]>({
        queryKey: ['otk-items-detail-approval', page, size, itemDtos],
        queryFn: async () => {
            try {
                const response = await axiosClient.post(`/api/otk/items-detail`, itemDtos);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm OTK';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: itemDtos.length > 0,
        retry: false
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
            width: "3vw",
            render: (_, index) => (
                <Typography variant="body2" align="center" fontSize={11}>
                    {(page - 1) * size + (index ?? 0) + 1}
                </Typography>
            )
        },
        {
            key: "cid",
            header: "Mã SP",
            align: "center",
            width: "8vw",
            render: (item: OtkItemResponse) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
            )
        },
        {
            key: "name",
            header: "Tên sản phẩm",
            align: "left",
            width: "18vw",
            render: (item: OtkItemResponse) => (
                <Typography variant="subtitle2" fontSize={12} fontWeight={600}
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
            key: "otkQty",
            header: "SL Kiểm",
            align: "right",
            width: "5vw",
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={12} align="right" fontWeight={600}>
                    {item.otkQty}
                </Typography>
            )
        },
        {
            key: "acceptedQty",
            header: "Đạt",
            align: "right",
            width: "5vw",
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={12} align="right" color="success.main" fontWeight={700}>
                    {item.acceptedQty}
                </Typography>
            )
        },
        {
            key: "deniedQty",
            header: "Lỗi",
            align: "right",
            width: "5vw",
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={12} align="right" color="error.main" fontWeight={700}>
                    {item.deniedQty}
                </Typography>
            )
        },
        {
            key: "extraQty",
            header: "Thừa",
            align: "right",
            width: "4vw",
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={12} align="right" color="warning.main">
                    {item.extraQty}
                </Typography>
            )
        },
        {
            key: "lostQty",
            header: "Thiếu",
            align: "right",
            width: "4vw",
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={12} align="right" color="text.secondary">
                    {item.lostQty}
                </Typography>
            )
        },
    ], [page, size]);

    if (!data) return null;

    return (
        <Box className="d-flex flex-column card p-3 gap-3">
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-hash" title="Mã phiếu OTK" value={data.cid || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-truck" title="Lịch giao hàng" value={data.deliverySchedule?.name || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-person" title="Người kiểm" value={data.employee?.name || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-calendar-event" title="Ngày kiểm" value={data.inspectionDate || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-info-circle" title="Trạng thái" value={data.status || "-"} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardComponent icon="bi bi-chat-left-text" title="Ghi chú" value={data.note || "-"} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, textAlign: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>TỔNG SL KIỂM</Typography>
                    <Typography variant="h6" color="primary" fontWeight={800}>{data.totalScheduledQty || 0}</Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(34, 197, 94, 0.05)' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>TỔNG ĐẠT</Typography>
                    <Typography variant="h6" color="success.main" fontWeight={800}>{data.totalAcceptedQty || 0}</Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.05)' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>TỔNG LỖI</Typography>
                    <Typography variant="h6" color="error.main" fontWeight={800}>{data.totalDeniedQty || 0}</Typography>
                </Box>
            </Box>

            <div className="card p-3 approval-detail-card-table" style={{ marginTop: '10px' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className="bi bi-list-check"></i> Chi tiết sản phẩm kiểm tra
                </Typography>
                <div className="table-scroll-container">
                    <table className='table-premium'>
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ textAlign: col.align, minWidth: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700}>
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} align="center">Đang tải...</td></tr>
                            ) : displayedItems?.map((item, index) => (
                                <tr key={item.id || index}>
                                    {columns.map((col) => (
                                        <td key={col.key} align={col.align} style={{ maxWidth: col.width }}>
                                            {col.render ? col.render(item, index) : (item as any)[col.key] || '-'}
                                        </td>
                                    ))}
                                </tr>
                            )) || <tr><td colSpan={8} align="center">Không có dữ liệu</td></tr>}
                        </tbody>
                    </table>
                </div>
                {data?.items?.length > size && (
                    <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0 0 0' }}>
                        <Box className="d-flex gap-1 align-items-center">
                            <Typography variant="caption" fontWeight={600} color="text.secondary">Hiển thị: </Typography>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "auto", fontSize: '0.75rem', border: 'none', background: 'transparent', fontWeight: 700 }}
                                value={size}
                                onChange={handleSizeChange}
                            >
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </Box>
                        <Pagination
                            totalItems={data?.items?.length || 0}
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

export default React.memo(ApprovalsOtkDetail);
