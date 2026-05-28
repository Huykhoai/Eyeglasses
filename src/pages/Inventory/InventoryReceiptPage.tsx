import React, { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "@/components/ui/Loading/Loading";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { useBase64 } from "@/utils/base64";
import { useFetchInventoryReceipts } from "./hooks/useFetchInventoryReceipts";
import { columnsInventoryReceipt } from "./config/columnsInventoryReceipt";
import type { InventoryReceiptResponse } from "./config/types";
import { getFilters } from "./config/getFilter";
import { useEmployeeAll } from "@/hooks/UseAllData";

const InventoryReceiptPage: React.FC = () => {
    const navigate = useNavigate();
    const { encode } = useBase64();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get('page') || 1;

    const [page, setPage] = useState(Number(pageParam));
    const [size, setSize] = useState(20);
    const [filter, setFilter] = useState<Record<string, any>>(() => {
        const params = Object.fromEntries(searchParams);
        const { page: _p, ...rest } = params;
        return rest;
    });

    const { data: employees } = useEmployeeAll();
    const categories = useMemo(() => getFilters(employees), [employees]);

    const { data, isLoading } = useFetchInventoryReceipts(page, size, filter);

    const handleViewDetail = useCallback((item: InventoryReceiptResponse) => {
        const encodedOtkId = encode(item.otkId);
        const encodedDsId = encode(item.id);
        navigate(`/inventory/receipt/${encodedOtkId}/${encodedDsId}`);
    }, [encode, navigate]);

    const handleFilterChange = useCallback((f: Record<string, any>) => {
        let mapped: Record<string, any> = {};
        Object.entries(f).forEach(([key, value]) => {
            mapped[key] = typeof value === 'object' ? value.id : value;
        });
        setFilter(mapped);
        setSearchParams(mapped, { replace: true });
        setPage(1);
    }, [setSearchParams]);

    const handlePageChange = useCallback((p: number) => {
        setPage(p);
        setSearchParams({ ...filter, page: p.toString() }, { replace: true });
    }, [setSearchParams, filter]);

    const columns = useMemo(() => columnsInventoryReceipt(page, size, handleViewDetail), [page, size, handleViewDetail]);
    return (
        <div className="contract-page-wapper">
            <div className="contract-header">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>Quay lại</Button>
                <div className="quote-filter-section">
                    <MultiFilterBar categories={categories} onFilterChange={handleFilterChange} initialFilters={filter} />
                </div>
                <div style={{ minWidth: 80 }}>
                    <Select value={size} options={[
                        { label: '20', value: 20 }, { label: '50', value: 50 }, { label: '100', value: 100 }
                    ]} onChangeSize={(v) => setSize(Number(v))} />
                </div>
            </div>

            <div className="glass-card">
                {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
                <div className="table-scroll-container" style={{ height: 'calc(100vh - 250px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.items ?? []).length > 0
                                ? (data?.items ?? []).map((item, index) => (
                                    <tr key={item.id || index}>
                                        {columns.map((col) => (
                                            <td key={col.key} style={{ width: col.width, textAlign: col.align }}>
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
                            ))
                            : <tr>
                                <td colSpan={columns.length} align="center">
                                    <Typography variant="body2" fontSize={12} align="center">
                                        Không có dữ liệu
                                    </Typography>
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div>

                {(data?.totalItems || 0) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination totalItems={data?.totalItems || 0} size={size} page={page} onChange={handlePageChange} />
                    </Box>
                )}
            </div>
        </div>
    );
};

export default React.memo(InventoryReceiptPage);
