import {
    Box, Grid, Stack, Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
    Receipt as ReceiptIcon,
    Calculate as CalculateIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "@/components/ui/Loading/Loading";
import { useBase64 } from "@/utils/base64";
import '../../DeliverySchedule/components/AddDeliverySchedule.css';
import { useFetchDeliveryFee } from "@/pages/DeliverySchedule/hooks/useFetchDeliveryFee";
import { useFetchOtkCostItemByOtkId } from "../hooks/useFetchOtkCostItemByOtkId";
import { columnsOtkCostCalculation } from "../config/columnsOtkCostCalculation";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { formatPrice } from "@/utils/formatPrice";
import { getFilterOtkReceipt } from "../config/getFilterOtkReceipt";
import Button from "@/components/common/Button/Button";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

interface FeeRow {
    label: string;
    value: number;
    type: 'fee' | 'tax' | 'total';
    capitalizable: boolean;
}

const OtkCostCalculation = () => {
    const navigate = useNavigate();
    const { decode, encode } = useBase64();
    const [searchParams] = useSearchParams();

    const otkCid = decode(searchParams.get('cid') || '');
    const { id: encodedOtkId, dsId: encodedDsId } = useParams();
    const otkId = Number(decode(encodedOtkId || ''));
    const dsId = Number(decode(encodedDsId || ''));

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [filter, setFilter] = useState<Record<string, any>>({});

    const { data: delivery, isLoading: isLoadingDelivery } = useFetchDeliveryFee(dsId);
    const { data: otkItems, isLoading: isLoadingItems } = useFetchOtkCostItemByOtkId(otkId, page, size, filter);

    const feeRows: FeeRow[] = useMemo(() => {
        if (!delivery) return [];
        return [
            { label: 'Phí bảo hiểm', value: Number(delivery.feeInsurance) || 0, type: 'fee', capitalizable: true },
            { label: 'Phí môi trường', value: Number(delivery.feeEnvironment) || 0, type: 'fee', capitalizable: true },
            { label: 'Phí vận chuyển bộ', value: Number(delivery.feeDelivery) || 0, type: 'fee', capitalizable: true },
            { label: 'Phí vận chuyển biển', value: Number(delivery.feeDeliverySea) || 0, type: 'fee', capitalizable: true },
            { label: 'Phí khác', value: Number(delivery.feeOther) || 0, type: 'fee', capitalizable: true },
            {
                label: `Thuế nhập khẩu ${delivery.isImportTaxPercentage ? `(${delivery.taxImport}%)` : ''}`,
                value: delivery.isImportTaxPercentage
                    ? (Number(delivery.taxImport || 0) / 100) * Number(delivery.totalAmountVnd || 0)
                    : Number(delivery.taxImport || 0),
                type: 'tax',
                capitalizable: true
            },
            {
                label: `Thuế VAT ${delivery.isVatPercentage ? `(${delivery.taxVat}%)` : ''}`,
                value: delivery.isVatPercentage
                    ? (Number(delivery.taxVat || 0) / 100) * Number(delivery.totalAmountVnd || 0)
                    : Number(delivery.taxVat || 0),
                type: 'tax',
                capitalizable: false
            },
            {
                label: `Thuế khác ${delivery.isOtherTaxPercentage ? `(${delivery.taxOther}%)` : ''}`,
                value: delivery.isOtherTaxPercentage
                    ? (Number(delivery.taxOther || 0) / 100) * Number(delivery.totalAmountVnd || 0)
                    : Number(delivery.taxOther || 0),
                type: 'tax',
                capitalizable: false
            },
        ];
    }, [delivery]);

    const columns = useMemo(() => columnsOtkCostCalculation(page, size), [page, size]);
    const categories = useMemo(() => getFilterOtkReceipt(), []);
    const productItems = otkItems?.items || [];
    const totalItems = otkItems?.totalItems || 0;

    const isLoading = isLoadingDelivery || isLoadingItems;


    const handleFilterChange = useCallback((filter: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filter).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        })
        setFilter(mapperFilter);
        setPage(1);
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, [])

    const handleImportToStock = useCallback(() => {
        navigate(`/inventory/receipt/${encodedOtkId}/${encodedDsId}?cid=${encode(otkCid)}`);
    }, [encodedOtkId, encodedDsId, navigate])
    return (
        <Box className="add-delivery-page-wapper">
            <Box className="add-delivery-header">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Tính tiền — {otkCid}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Lịch giao: {delivery?.cid} — {delivery?.name}
                        </Typography>
                    </Box>
                </Stack>
                <Button variant="primary" onClick={handleImportToStock}>
                    Nhập kho
                    <ArrowForwardIcon fontSize="small" />
                </Button>
            </Box>

            {isLoading && <Loading fullPage message="Đang tải dữ liệu tính tiền..." />}

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
                                        {formatPrice(Number(delivery?.totalAmountVnd) || 0)}
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
                                                {formatPrice(row.value)}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                                <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f0fdf4' }}>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700}>Tổng phí phân bổ</Typography></td>
                                    <td><Typography variant="body2" fontSize={12} fontWeight={700} align="right" color="#16a34a">
                                        {formatPrice(delivery?.totalFees || 0)}
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

            <Box className="glass-card">
                <Box className="d-flex align-items-center justify-content-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalculateIcon sx={{ color: primaryColor }} /> Phân bổ chi phí theo sản phẩm ({totalItems} sản phẩm)
                    </Typography>
                    <div style={{ width: '35%' }}>
                        <MultiFilterBar
                            categories={categories}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ minWidth: 80 }}>
                            <Select
                                value={size}
                                options={[
                                    { label: '20', value: 20 },
                                    { label: '50', value: 50 },
                                    { label: '100', value: 100 },
                                ]}
                                onChangeSize={(value) => setSize(Number(value))}
                            />
                        </div>
                        <Pagination
                            totalItems={totalItems}
                            page={page}
                            size={size}
                            onChange={handlePageChange}
                        />
                    </div>

                </Box>
                <div className="table-scroll-container" style={{ flex: 1, height: 'calc(100vh - 250px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={10} fontWeight={700} align="center">
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {productItems.length > 0 ? productItems.map((item, index) => (
                                <tr key={item.id || index}>
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ width: col.width, textAlign: col.align }}>
                                            {col.render ? (
                                                col.render(item, index)
                                            ) : (
                                                <Typography variant="body2" fontSize={11} align={col.align}>
                                                    {(item as any)[col.key] || '-'}
                                                </Typography>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={columns.length} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                            Không có dữ liệu
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </Box>
    );
};

export default OtkCostCalculation;
