import {
    Box, Grid, IconButton, Stack, Typography,
} from "@mui/material";
import { useMemo } from "react";
import {
    ArrowBack as ArrowBackIcon,
    Receipt as ReceiptIcon,
    Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import Loading from "@/components/ui/Loading/Loading";
import { useBase64 } from "@/utils/base64";
import type { OtkItemResponse } from "../config/otkTypes";
import '../../DeliverySchedule/components/AddDeliverySchedule.css';

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

interface FeeRow {
    label: string;
    value: number;
    type: 'fee' | 'tax' | 'total';
}

const OtkCostCalculation = () => {
    const navigate = useNavigate();
    const { decode } = useBase64();
    const { id: encodedOtkId, dsId: encodedDsId } = useParams();
    const otkId = Number(decode(encodedOtkId || ''));
    const dsId = Number(decode(encodedDsId || ''));

    // Fetch delivery schedule (for fees/taxes)
    const { data: delivery, isLoading: isLoadingDelivery } = useQuery({
        queryKey: ['delivery-cost', dsId],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/delivery/${dsId}`);
            return res.data;
        },
        enabled: !!dsId,
    });

    // Fetch OTK detail
    const { data: otk, isLoading: isLoadingOtk } = useQuery({
        queryKey: ['otk-cost', otkId],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/otk/${otkId}`);
            return res.data;
        },
        enabled: !!otkId,
    });

    // Fetch OTK items (full detail)
    const { data: otkItems, isLoading: isLoadingItems } = useQuery<OtkItemResponse[]>({
        queryKey: ['otk-cost-items', otkId],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/otk/items/${otkId}`);
            return res.data;
        },
        enabled: !!otkId,
    });

    // Fee table data
    const feeRows: FeeRow[] = useMemo(() => {
        if (!delivery) return [];
        return [
            { label: 'Phí bảo hiểm', value: Number(delivery.feeInsurance) || 0, type: 'fee' },
            { label: 'Phí môi trường', value: Number(delivery.feeEnvironment) || 0, type: 'fee' },
            { label: 'Phí vận chuyển bộ', value: Number(delivery.feeDelivery) || 0, type: 'fee' },
            { label: 'Phí vận chuyển biển', value: Number(delivery.feeDeliverySea) || 0, type: 'fee' },
            { label: 'Phí khác', value: Number(delivery.feeOther) || 0, type: 'fee' },
            {
                label: `Thuế nhập khẩu ${delivery.isImportTaxPercentage ? `(${delivery.taxImport}%)` : ''}`,
                value: Number(delivery.taxImport) || 0,
                type: 'tax'
            },
            {
                label: `Thuế VAT ${delivery.isVatPercentage ? `(${delivery.taxVat}%)` : ''}`,
                value: Number(delivery.taxVat) || 0,
                type: 'tax'
            },
            {
                label: `Thuế khác ${delivery.isOtherTaxPercentage ? `(${delivery.taxOther}%)` : ''}`,
                value: Number(delivery.taxOther) || 0,
                type: 'tax'
            },
        ];
    }, [delivery]);

    const totalFees = useMemo(() => feeRows.filter(r => r.type === 'fee').reduce((s, r) => s + r.value, 0), [feeRows]);

    // Product table with cost allocation
    const productRows = useMemo(() => {
        if (!otkItems || !delivery) return [];

        const totalAmountVnd = Number(delivery.totalAmountVnd) || 1;

        return otkItems.map(item => {
            const accepted = item.acceptedQty || 0;
            const scheduled = item.scheduledQty || 1; // Tránh chia cho 0
            const lineTotalVnd = item.lineTotalVnd || 0;

            // Đơn giá VNĐ quy đổi từ contract (lineTotalVnd / scheduledQty)
            const unitPriceVnd = lineTotalVnd / scheduled;

            // Tỉ trọng giá trị của line này trong tổng lô hàng để phân bổ phí
            const weight = totalAmountVnd > 0 ? lineTotalVnd / totalAmountVnd : 0;
            const allocatedFee = totalFees * weight;

            // Giá trị hàng đạt = Đơn giá VNĐ * SL đạt
            const acceptedValue = unitPriceVnd * accepted;

            // Giá vốn/SP = (Giá trị hàng đạt + Chi phí phân bổ) / SL đạt
            // Lưu ý: Chi phí phân bổ cho line này được gánh toàn bộ bởi số lượng đạt
            const landedCostPerUnit = accepted > 0
                ? (acceptedValue + allocatedFee) / accepted
                : 0;

            return {
                ...item,
                unitPriceVnd,
                accepted,
                acceptedValue,
                weight,
                allocatedFee,
                landedCostPerUnit,
            };
        });
    }, [otkItems, delivery, totalFees]);

    const isLoading = isLoadingDelivery || isLoadingOtk || isLoadingItems;

    if (isLoading) return <Loading fullPage message="Đang tải dữ liệu tính tiền..." />;

    const formatNumber = (val: number) => val.toLocaleString('vi-VN', { maximumFractionDigits: 2 });

    return (
        <Box className="add-delivery-page-wapper">
            {/* Header */}
            <Box className="add-delivery-header">
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Tính tiền — {otk?.cid}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Lịch giao: {delivery?.cid} — {delivery?.name}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Card 1: Fee/Tax table */}
            <Box className="glass-card">
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon sx={{ color: primaryColor }} /> Bảng chi phí lịch giao hàng
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th><Typography variant="subtitle2" fontSize={11} fontWeight={700}>Loại chi phí</Typography></th>
                                    <th><Typography variant="subtitle2" fontSize={11} fontWeight={700} align="right">Giá trị (VNĐ)</Typography></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: `${primaryColor}08` }}>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700}>Tổng giá hàng (VNĐ)</Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right" color={primaryColor}>
                                        {formatNumber(Number(delivery?.totalAmountVnd) || 0)}
                                    </Typography></td>
                                </tr>
                                {feeRows.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Typography variant="body2" fontSize={12}
                                                sx={{ pl: row.type === 'tax' ? 2 : 0 }}>
                                                {row.type === 'tax' ? '🏛 ' : '📦 '}{row.label}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography variant="body2" fontSize={12} align="right"
                                                color={row.value > 0 ? 'text.primary' : 'text.secondary'}>
                                                {formatNumber(row.value)}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                                <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f0fdf4' }}>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700}>Tổng phí phân bổ</Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right" color="#16a34a">
                                        {formatNumber(totalFees)}
                                    </Typography></td>
                                </tr>
                            </tbody>
                        </table>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>📘 Ghi chú cách tính</Typography>
                            <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary">
                                    • Phí được phân bổ theo <b>tỉ trọng giá trị</b> của từng sản phẩm trong tổng lô hàng
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    • <b>Tỉ trọng</b> = (Đơn giá × SL OTK) / Tổng giá hàng VNĐ
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    • <b>Chi phí phân bổ</b> = Tổng phí × Tỉ trọng
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    • <b>Giá vốn/SP</b> = (Giá trị hàng + Chi phí phân bổ) / SL đạt
                                </Typography>
                                <Box sx={{ mt: 1, p: 1, borderRadius: '8px', bgcolor: '#fef3c7', border: '1px solid #fcd34d' }}>
                                    <Typography variant="caption" fontWeight={600} color="#92400e">
                                        ⚠ Mỗi sản phẩm có đơn giá và tỉ giá riêng theo hợp đồng tương ứng
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Card 2: Product cost allocation table */}
            <Box className="glass-card" sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalculateIcon sx={{ color: primaryColor }} /> Phân bổ chi phí theo sản phẩm
                </Typography>
                <div className="table-scroll-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 480px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="center">STT</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="center">Mã SP</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700}>Tên SP</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="center">HĐ</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">SL OTK</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">SL Đạt</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">SL Lỗi</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">Đơn giá</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">Giá trị hàng</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">Tỉ trọng</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">Chi phí PB</Typography></th>
                                <th><Typography variant="subtitle2" fontSize={10} fontWeight={700} align="right">Giá vốn/SP</Typography></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productRows.length > 0 ? productRows.map((row, index) => (
                                <tr key={row.id}>
                                    <td><Typography variant="body2" fontSize={11} align="center">{index + 1}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="center" fontWeight={600} color={primaryColor}>{row.cid}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11}>{row.name}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="center">{row.contractCid || '-'}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right">{row.otkQty || 0}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right" fontWeight={600} color="success.main">{row.accepted}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right" fontWeight={600} color="error.main">{row.deniedQty}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right">{formatNumber(row.unitPriceVnd)}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right">{formatNumber(row.acceptedValue)}</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right" color="text.secondary">{(row.weight * 100).toFixed(2)}%</Typography></td>
                                    <td><Typography variant="body2" fontSize={11} align="right" color="#f59e0b" fontWeight={600}>{formatNumber(row.allocatedFee)}</Typography></td>
                                    <td>
                                        <Typography variant="body2" fontSize={12} align="right" fontWeight={700}
                                            color={row.landedCostPerUnit > 0 ? primaryColor : 'text.secondary'}>
                                            {row.accepted > 0 ? formatNumber(row.landedCostPerUnit) : '-'}
                                        </Typography>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={12} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>Không có dữ liệu</Typography>
                                </td></tr>
                            )}
                        </tbody>
                        {productRows.length > 0 && (
                            <tfoot>
                                <tr style={{ background: `${primaryColor}08`, fontWeight: 700 }}>
                                    <td colSpan={4}><Typography variant="body2" fontSize={12} fontWeight={700}>Tổng cộng</Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right">
                                        {productRows.reduce((s, r) => s + (r.otkQty || 0), 0)}
                                    </Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right" color="success.main">
                                        {productRows.reduce((s, r) => s + r.accepted, 0)}
                                    </Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right" color="error.main">
                                        {productRows.reduce((s, r) => s + r.deniedQty, 0)}
                                    </Typography></td>
                                    <td></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right">
                                        {formatNumber(productRows.reduce((s, r) => s + r.acceptedValue, 0))}
                                    </Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right">100%</Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right" color="#f59e0b">
                                        {formatNumber(productRows.reduce((s, r) => s + r.allocatedFee, 0))}
                                    </Typography></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </Box>
        </Box>
    );
};

export default OtkCostCalculation;
