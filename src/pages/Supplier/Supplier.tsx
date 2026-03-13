import React, { useCallback, useMemo, useState } from "react";
import './Supplier.css';
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilterSupplier } from "./config/filterSupplier";
import { useSupplierData, type Supplier } from "./hooks/useSupplierData";
import { columns } from "./config/columns";
import { IconButton, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Pagination from "@/components/common/Pagination/Pagination";
import DialogSupplier from "./components/DialogSupplier";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import axiosClient from "@/api/axiosClient";
import { Tune } from "@mui/icons-material";
import HistoryIcon from '@mui/icons-material/History';
import DialogSupplierHistory from "./components/DialogSupplierHistory";
import Select from "@/components/common/Select/Select";
import { useCountry } from "@/hooks/UseAllData";

const Supplier: React.FC = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [searchParams, setSearchParams] = useSearchParams();

    const urlFilters = useMemo(() => {
        const obj: Record<string, any> = {};
        searchParams.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }, [searchParams]);

    const [filter, setFilter] = useState<Record<string, any>>(urlFilters);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Supplier | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const [openHistory, setOpenHistory] = useState(false);

    const { data: countries } = useCountry();
    const categories = useMemo(() => getFilterSupplier(countries), [countries]);

    const { data: suppliers, isLoading, refetch } = useSupplierData(page, size, filter);

    const handleFilterChange = useCallback((filter: Record<string, any>) => {
        let mapperFilter: any = {};
        Object.entries(filter).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id
            } else {
                mapperFilter[key] = value;
            }
        })

        setFilter(mapperFilter);
        setSearchParams(mapperFilter, { replace: true })
        setPage(1);
    }, [setSearchParams]);

    const handleViewHistory = () => {
        setOpenHistory(true);
        handleCloseMenu();
    };

    const handleEditFromMenu = () => {
        setOpenDialog(true);
        handleCloseMenu();
    };

    const handleDeleteFromMenu = () => {
        setOpenConfirm(true);
        handleCloseMenu();
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, item: Supplier) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            await axiosClient.delete(`/api/supplier/delete/${selectedItem.id}`);
            showNotification('success', 'Xóa nhà cung cấp thành công', 'Thành công');
            refetch();
            setOpenConfirm(false);
        } catch (error: any) {
            showNotification('error', error?.response?.data?.message || 'Xóa thất bại', 'Lỗi');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAdd = () => {
        setSelectedItem(null);
        setOpenDialog(true);
    };
    
    return (
        <div className="supplier-page-wrapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <div className="supplier-header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại
                </Button>
                <div className="supplier-filter-section">
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
                    Thêm nhà cung cấp
                </Button>

            </div>
            <div className="supplier-card">
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
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700}>
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
                            {(suppliers?.items ?? []).map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>
                                        <Typography variant="body2" align="center" fontSize={12}>
                                            {(page - 1) * size + index + 1}
                                        </Typography>
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ width: col.width }}>
                                            {col.render ? (
                                                col.render(item)
                                            ) : (
                                                <Typography variant="body2" fontSize={12}>
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
                {(suppliers?.totalItems ?? 0) > 20 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            totalItems={suppliers?.totalItems ?? 0}
                            page={page}
                            size={size}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>

            <DialogSupplier
                open={openDialog}
                data={selectedItem}
                onClose={() => {
                    setOpenDialog(false);
                    setSelectedItem(null);
                }}
                onSuccess={() => {
                    refetch();
                    setSelectedItem(null);
                }}
            />

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
                <MenuItem onClick={handleViewHistory} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <HistoryIcon fontSize="small" sx={{ color: '#7b4b68' }} />
                    </ListItemIcon>
                    Lịch sử thay đổi
                </MenuItem>
                <MenuItem onClick={handleEditFromMenu} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={handleDeleteFromMenu} sx={{ fontSize: '0.85rem', color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Xóa
                </MenuItem>
            </Menu>

            <ConfirmDialog
                open={openConfirm}
                title="Xác nhận xóa"
                content={`Bạn có chắc chắn muốn xóa nhà cung cấp "${selectedItem?.name}" không? Hành động này không thể hoàn tác.`}
                onClose={() => setOpenConfirm(false)}
                onConfirm={confirmDelete}
                loading={submitting}
            />

            <DialogSupplierHistory
                open={openHistory}
                supplierId={selectedItem?.supplierId || null}
                supplierName={selectedItem?.name || ""}
                onClose={() => {
                    setOpenHistory(false);
                    setSelectedItem(null);
                }}
            />
        </div>
    );
};

export default React.memo(Supplier);