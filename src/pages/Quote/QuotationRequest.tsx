import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './QuotationRequest.css';
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilterQuote } from "./config/filterQuote";
import Select from "@/components/common/Select/Select";
import { useFetchPurchaseQuotation } from "./hooks/useFetchPurchaseQuotation";
import type { PurchaseQuotationType } from "./config/types";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { columns } from "./config/columnTable";
import { Tune, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Pagination from "@/components/common/Pagination/Pagination";

const Quote: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlFilters = useMemo(() => {
        const obj: Record<string, any> = {};
        Object.entries(searchParams).forEach(([key, value]) => {
            obj[key] = value;
        })
        return obj;
    }, [searchParams]);

    const [filter, setFilter] = useState<Record<string, any>>(urlFilters);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const categories = useMemo(() => getFilterQuote(), []);
    const columnOptions = useMemo(() => columns, []);

    const { data: purchaseQuotations, isLoading } = useFetchPurchaseQuotation(page, size, filter);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PurchaseQuotationType | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        });
        setFilter(mapperFilter);
        setSearchParams(mapperFilter, { replace: true });
        setPage(1);
    }, [setSearchParams])

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, item: PurchaseQuotationType) => {
        setSelectedItem(item);
        setAnchorEl(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleEdit = () => {
        navigate(`/xnk/orders/quotation-request/edit/${selectedItem?.id}`);
    }

    const handleDelete = () => {
        setOpenConfirm(true);
    }

    const handleAdd = () => {
        navigate('/xnk/orders/quotation-request/add');
    }
    return (
        <div className="quote-page-wapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <div className="quote-header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại
                </Button>
                <div className="quote-filter-section">
                    <MultiFilterBar
                        categories={categories}
                        onFilterChange={handleFilterChange}
                        initialFilters={urlFilters}
                    />
                </div>
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
                <Button
                    variant="primary"
                    onClick={handleAdd}
                >
                    Thêm báo giá
                </Button>
            </div>
            <div className="quote-card">
                <div className="table-scroll-container" style={{ minHeight: 'calc(100vh - 247px)' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        STT
                                    </Typography>
                                </th>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ width: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                                <th>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        Thao tác
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(purchaseQuotations?.items ?? []).map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>
                                        <Typography variant="body2" align="center" fontSize={12}>
                                            {(page - 1) * size + index + 1}
                                        </Typography>
                                    </td>
                                    {columnOptions.map((col) => (
                                        <td key={col.key} style={{ width: col.width, textAlign: 'center' }}>
                                            {col.render ? (
                                                col.render(item)
                                            ) : (
                                                <Typography variant="body2" fontSize={12} align={col.align}>
                                                    {(item as any)[col.key] || '-'}
                                                </Typography>
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <IconButton size="small" onClick={(e) => handleOpenMenu(e, item)}>
                                                <Tune fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(purchaseQuotations?.totalItems ?? 0) > 0 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            totalItems={purchaseQuotations?.totalItems ?? 0}
                            page={page}
                            size={size}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        minWidth: '150px'
                    }
                }}
            >
                <MenuItem onClick={handleEdit} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ fontSize: '0.85rem', color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Xóa
                </MenuItem>
            </Menu>
        </div>
    );
};

export default Quote;