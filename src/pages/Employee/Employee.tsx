import React, { useCallback, useMemo, useState } from "react";
import { Edit as EditIcon, History as HistoryIcon, PersonAdd as PersonAddIcon, ManageAccounts as ManageAccountsIcon } from '@mui/icons-material';
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import Select from "@/components/common/Select/Select";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Tune } from '@mui/icons-material';
import Pagination from '@/components/common/Pagination/Pagination';
import { getFilterEmployee } from './config/filter';
import { useColumns } from './config/columns';
import { useEmployeeData } from './hooks/useEmployeeData';
import { useDepartmentAll } from "@/hooks/UseAllData";
import type { EmployeeType } from "./config/type";
import DialogEmployeeLog from "./component/DialogEmployeeLog";
import DialogCreateAccount from "./component/DialogCreateAccount";
import DialogUpdateRolePosition from "./component/DialogUpdateRolePosition";
import { useTouchMoveTable } from "@/utils/touchMoveTable";
import { useAuth } from "@/context/AuthContext";
import { Roles } from "@/utils/roles";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { useBase64 } from "@/utils/base64";
import './Employee.css';

const Employee: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { encode } = useBase64();
    const { showNotification } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const { tableRef, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchMoveTable();
    const { data: departments } = useDepartmentAll();

    const params = Object.fromEntries(searchParams);
    const pageParam = params.page ? parseInt(params.page) : 1;
    const [page, setPage] = useState<number>(pageParam);
    const [size, setSize] = useState<number>(20);
    const [filter, setFilter] = useState<Record<string, any>>(() => {
        const { page: _p, ...rest } = params;
        return rest;
    });

    const [selectedItem, setSelectedItem] = useState<EmployeeType | null>(null);
    const [openHistory, setOpenHistory] = useState(false);
    const [openCreateAccount, setOpenCreateAccount] = useState(false);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const categories = useMemo(() => getFilterEmployee(departments || []), [departments]);
    const columns = useMemo(() => useColumns, []);
    const { data: paginatedEmployees, isLoading } = useEmployeeData(page, size, filter);

    const roleAccess = useMemo(() => {
        return [Roles.ADMIN, Roles.MANAGE_HR].some(role => user?.roles?.includes(role));
    }, [user]);

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

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
        setSearchParams({ ...filter, page: page.toString() }, { replace: true });
    }, [filter, setSearchParams]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, item: EmployeeType) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEditFromMenu = () => {
        if (!selectedItem) return;
        const roleStaff = user?.positions?.includes(Roles.STAFF_EDIT);
        if (!roleAccess && !roleStaff) {
            showNotification('error', 'Chỉ có Admin và Manager hoặc nhân viên có quyền sửa nhân viên mới có quyền sửa nhân viên', 'Thất bại');
            return;
        }
        const hashId = encode(selectedItem?.id);
        navigate(`/hr/employees/update/${hashId}`);
        handleCloseMenu();
    };

    const handleViewHistory = () => {
        if (!roleAccess) {
            showNotification('error', 'Chỉ có Admin và Manager mới có quyền xem lịch sử nhân viên', 'Thất bại');
            return;
        }
        setOpenHistory(true);
        handleCloseMenu();
    };
    const handleAdd = () => {
        const roleStaff = user?.positions?.includes(Roles.STAFF_ADD);
        if (!roleAccess && !roleStaff) {
            showNotification('error', 'Chỉ có Admin và Manager hoặc nhân viên có quyền thêm nhân viên mới có quyền thêm nhân viên', 'Thất bại');
            return;
        }
        navigate('/hr/employees/add')
    };

    const handleCreateAccountFromMenu = () => {
        if (!selectedItem) return;
        if (!roleAccess) {
            showNotification('error', 'Chỉ có Admin và Manager mới có quyền tạo tài khoản nhân viên', 'Thất bại');
            return;
        }
        setOpenCreateAccount(true);
        handleCloseMenu();
    };

    const handleUpdateRoleFromMenu = () => {
        if (!selectedItem) return;
        if (!roleAccess) {
            showNotification('error', 'Chỉ có Admin và Manager mới có quyền thay đổi role & chức vụ', 'Thất bại');
            return;
        }
        setOpenUpdateRole(true);
        handleCloseMenu();
    };

    return (
        <div className="employee-page-wrapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <div className="employee-header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại
                </Button>
                <div className="employee-filter-section">
                    <MultiFilterBar
                        categories={categories}
                        onFilterChange={handleFilterChange}
                        initialFilters={filter}
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
                    Thêm nhân viên
                </Button>
            </div>
            <div className='employee-card'>
                <div className='table-scroll-container' 
                    ref={tableRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ minHeight: 'calc(100vh - 249px)' }}>
                    <table className='table-premium'>
                        <thead>
                            {(() => {
                                const groupedHeaders: { name: string; span: number }[] = [];
                                groupedHeaders.push({ name: '', span: 1});

                                columns.forEach((col: any) => {
                                    const groupName = col.groupName || "Thông tin chung";
                                    if(groupedHeaders.length > 0 && groupedHeaders[groupedHeaders.length - 1].name === groupName) {
                                        groupedHeaders[groupedHeaders.length - 1].span++;
                                    } else {
                                        groupedHeaders.push({ name: groupName, span: 1});
                                    }
                                });
                                groupedHeaders.push({ name: 'Công cụ', span: 1 });

                                return (
                                    <tr className="group-header-row">
                                        {groupedHeaders.map((group, idx) => (
                                            <th 
                                                key={idx}
                                                colSpan={group.span}
                                                style={{
                                                    backgroundColor: '#f1f5f9',
                                                    borderBottom: '2px solid #e2e8f0',
                                                    position: idx === groupedHeaders.length - 1 ? 'sticky' : undefined,
                                                    right: idx === groupedHeaders.length - 1 ? 0 : undefined,
                                                    zIndex: idx === groupedHeaders.length - 1 ? 2 : undefined,
                                                }}>
                                                    <Typography variant="overline" fontSize={10} fontWeight={800} color="primary"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: 1
                                                        }}>
                                                        {group.name}
                                                    </Typography>
                                                </th>
                                        ))}
                                    </tr>
                                )
                            })()}
                            <tr>
                                <th>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        STT
                                    </Typography>
                                </th>
                                {columns.map((col) => (
                                    <th 
                                        key={col.key}
                                        style={{
                                            minWidth: col.width,
                                            textAlign: 'center'
                                        }}>
                                            <div className="cell-animate-entrance">
                                                <Typography variant="subtitle2" fontSize={11} fontWeight={700}>
                                                    {col.header}
                                                </Typography>
                                            </div>
                                    </th>
                                ))}
                                <th style={{
                                    position: 'sticky',
                                    right: 0,
                                    zIndex: 2,
                                }}>
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        Thao tác
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEmployees?.items?.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 2} style={{ textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Không có dữ liệu
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (
                                paginatedEmployees?.items?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td align="center">
                                            <Typography variant="body2" fontSize={11}>
                                                {(page - 1) * size + index + 1}
                                            </Typography>
                                        </td>
                                        {columns.map((col) => (
                                            <td key={col.key} align={col.align} style={{ maxWidth: col.width }}>
                                                <div className="cell-animate-entrance">
                                                    {col.render 
                                                    ? col.render(item) 
                                                    : <Typography variant="body2" fontSize={11}>
                                                        {(item as any)[col.key] || '-'}
                                                    </Typography>}
                                                </div>
                                            </td>
                                        ))}
                                        <td align="center" style={{
                                            position: 'sticky',
                                            right: 0,
                                            zIndex: 2,
                                        }}>
                                            <IconButton
                                                onClick={(e) => handleOpenMenu(e, item)}
                                                size="small"
                                            >
                                                <Tune fontSize="small" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {(paginatedEmployees?.totalItems || 0) > 0 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            totalItems={paginatedEmployees?.totalItems || 0}
                            page={page}
                            size={size}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleViewHistory} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <HistoryIcon fontSize="small" sx={{ color: '#7b4b68' }} />
                    </ListItemIcon>
                    Lịch sử thay đổi
                </MenuItem>
                <MenuItem onClick={handleEditFromMenu} sx={{ fontSize: '0.85rem' }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="info"/>
                    </ListItemIcon>
                    <Typography variant="inherit">Chỉnh sửa</Typography>
                </MenuItem>
                {!selectedItem?.hasAccount && (
                    <MenuItem onClick={handleCreateAccountFromMenu} sx={{ fontSize: '0.85rem' }}>
                        <ListItemIcon>
                            <PersonAddIcon fontSize="small" color="success"/>
                        </ListItemIcon>
                        <Typography variant="inherit">Tạo tài khoản</Typography>
                    </MenuItem>
                )}
                {selectedItem?.hasAccount && (
                    <MenuItem onClick={handleUpdateRoleFromMenu} sx={{ fontSize: '0.85rem' }}>
                        <ListItemIcon>
                            <ManageAccountsIcon fontSize="small" color="secondary"/>
                        </ListItemIcon>
                        <Typography variant="inherit">Quyền & Chức vụ</Typography>
                    </MenuItem>
                )}
            </Menu>
            <DialogEmployeeLog
                open={openHistory}
                onClose={() => setOpenHistory(false)}
                employee={selectedItem}
            />
            <DialogCreateAccount
                open={openCreateAccount}
                onClose={() => setOpenCreateAccount(false)}
                employee={selectedItem}
            />
            <DialogUpdateRolePosition 
                open={openUpdateRole}
                onClose={() => setOpenUpdateRole(false)}
                employee={selectedItem}
            />
        </div>
    );
};

export default Employee;