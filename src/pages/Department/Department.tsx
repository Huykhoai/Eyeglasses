import './Department.css';
import React, { useCallback, useMemo, useState } from "react";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilterDepartment } from "./config/filter";
import Select from "@/components/common/Select/Select";
import DialogDepartment from './components/DialogDepartment';
import type { DepartmentType } from './config/type';
import useDepartmentData from './hooks/useDepartmentData';
import { useColumns } from "./config/columns";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Tune } from '@mui/icons-material';
import Pagination from '@/components/common/Pagination/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import axiosClient from '@/api/axiosClient';
import { useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/components/ui/Notification/NotificationContext';

const Department: React.FC = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
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
    const [selectedItem, setSelectedItem] = useState<DepartmentType | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const categories = useMemo(() => getFilterDepartment(), []);
    const columns = useMemo(() => useColumns, []);
    const { data: departments, isLoading } = useDepartmentData(page, size, filter);

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
    }, [setSearchParams]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, item: DepartmentType) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEditFromMenu = () => {
        setOpenDialog(true);
        handleCloseMenu();
    };
    const handleDeleteFromMenu = () => {
        setOpenConfirm(true);
        handleCloseMenu();
    };
    const confirmDelete = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            await axiosClient.delete(`/api/department/delete/${selectedItem.id}`);
            showNotification('success', 'Xóa phòng ban thành công', 'Thành công');
            setOpenConfirm(false);
            queryClient.invalidateQueries({ queryKey: ['department'] });
            queryClient.invalidateQueries({ queryKey: ['department-all'] });
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
        <div className="department-page-wrapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <div className="department-header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại
                </Button>
                <div className="department-filter-section">
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
                    Thêm phòng ban
                </Button>
            </div>
            <div className='department-card'>
                <div className='table-scroll-container' style={{ minHeight: 'calc(100vh - 240px' }}>
                    <table className='table-premium'>
                        <thead>
                            <tr>
                                <th>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        STT
                                    </Typography>
                                </th>
                                {columns.map((col) => (
                                    <th key={col.key}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
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
                            {departments?.items?.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>
                                        <Typography variant="body2" fontSize={11} align="center">
                                            {(page - 1) * size + index + 1}
                                        </Typography>
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? (
                                                col.render(item)
                                            ) : (
                                                <Typography variant="body2" fontSize={11}>
                                                    {(item as any)[col.key] || '-'}
                                                </Typography>
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <Typography variant="body2" fontSize={11} align="center">
                                            <IconButton
                                                onClick={(e) => handleOpenMenu(e, item)}
                                                size="small"
                                            >
                                                <Tune fontSize="small" />
                                            </IconButton>
                                        </Typography>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(departments?.items?.length || 0) > 0 && (
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        totalItems={departments?.totalItems || 0}
                        page={page}
                        size={size}
                        onChange={(p) => setPage(p)}
                    />
                </div>
                )}
            </div>
            <DialogDepartment
                open={openDialog}
                data={selectedItem}
                onClose={() => {
                    setOpenDialog(false);
                    setSelectedItem(null);
                }}
                onSuccess={() => {
                    setSelectedItem(null);
                    setOpenDialog(false);
                }}
            />
            <ConfirmDialog
                open={openConfirm}
                title="Xác nhận xóa"
                content={`Bạn có chắc chắn muốn xóa phòng ban "${selectedItem?.name}" không? Hành động này không thể hoàn tác.`}
                onClose={() => setOpenConfirm(false)}
                onConfirm={confirmDelete}
                loading={submitting}
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

        </div>
    );
};

export default Department;