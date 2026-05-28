import React, { useCallback, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Loading from "@/components/ui/Loading/Loading";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import Button from "@/components/common/Button/Button";
import { useBase64 } from "@/utils/base64";
import { cleanParams } from "@/utils/cleanParams";
import type { PaginatedResponse } from "@/types";
import '../DeliverySchedule/components/AddDeliverySchedule.css';
import type { ProductStockResponse } from "./config/types";
import { columnsWarehouseStock } from "./config/columnsWarehouseStock";
import { getFilters } from "./config/getFilter";
import { useBrand, useGroup } from "@/hooks/UseAllData";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const WarehouseStockPage: React.FC = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { decode } = useBase64();
    const [searchParams] = useSearchParams();

    const { data: brands } = useBrand();
    const { data: groups } = useGroup();

    const warehouseName = searchParams.get('name') || '';
    const { warehouseId: encodedId } = useParams();
    const warehouseId = Number(decode(encodedId || ''));

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [filter, setFilter] = useState<Record<string, any>>({});

    const categories = useMemo(() => getFilters(brands || [], groups || []), [groups, brands]);
    const columns = useMemo(() => columnsWarehouseStock(page, size), [page, size]);

    const { data, isLoading } = useQuery<PaginatedResponse<ProductStockResponse>>({
        queryKey: ['warehouse-stock', warehouseId, page, size, filter],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filter, size });
                const res = await axiosClient.get(`/api/warehouse/stock/${warehouseId}/page/${page}`, { params });
                return { items: res.data.data, totalItems: res.data.totalItems };
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Lỗi hệ thống', 'Lỗi');
                throw error;
            }
        },
        enabled: !!warehouseId,
        retry: false,
    });

    const handleFilterChange = useCallback((f: Record<string, any>) => {
        let mapped: Record<string, any> = {};
        Object.entries(f).forEach(([key, value]) => {
            mapped[key] = typeof value === 'object' ? value.id : value;
        });
        setFilter(mapped);
        setPage(1);
    }, []);

    return (
        <Box className="add-delivery-page-wapper">
            <Box className="add-delivery-header">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outline" onClick={() => navigate('/warehouse')}>
                        <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} /> Quay lại
                    </Button>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon sx={{ color: primaryColor }} /> Tồn kho: <span style={{ color: primaryColor }}>{warehouseName}</span>
                    </Typography>
                </Stack>
                <div style={{ width: "15vw", flex: 1}}>
                    <MultiFilterBar categories={categories} onFilterChange={handleFilterChange} initialFilters={filter} />
                </div>
                <div style={{ minWidth: 70 }}>
                    <Select value={size} options={[
                        { label: '20', value: 20 }, { label: '50', value: 50 }, { label: '100', value: 100 }
                    ]} onChangeSize={(v) => setSize(Number(v))} />
                </div>
            </Box>

            <div className="glass-card">
                {isLoading && <Loading fullPage message="Đang tải..." />}
                <div className="table-scroll-container" style={{ height: 'calc(100vh - 200px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.items ?? []).length > 0 ? (
                                (data?.items ?? []).map((item, index) => (
                                    <tr key={item.id || index}>
                                        {columns.map((col) => (
                                            <td key={col.key} style={{ textAlign: col.align as any }}>
                                                {col.render ? (
                                                    col.render(item, index)
                                                ) : (
                                                    <Typography variant="body2" fontSize={12} align={col.align as any}>
                                                        {(item as any)[col.key] || '-'}
                                                    </Typography>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (!isLoading && (
                                <tr>
                                    <td colSpan={columns.length}>
                                        <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 4 }}>
                                            Chưa có sản phẩm nào trong kho
                                        </Typography>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(data?.totalItems || 0) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination totalItems={data?.totalItems || 0} size={size} page={page} onChange={setPage} />
                    </Box>
                )}
            </div>
        </Box>
    );
};

export default React.memo(WarehouseStockPage);
