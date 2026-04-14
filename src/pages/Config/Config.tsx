import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import Pagination from '@/components/common/Pagination/Pagination';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TreeSelect from '@/components/common/TreeSelect/TreeSelect';
import { useConfigData } from './hooks/useConfigData';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import './Config.css';
import { type ConfigCategoryItem } from './hooks/useConfigData';
import axiosClient from '@/api/axiosClient';
import { cleanParams } from '@/utils/cleanParams';
import { IconButton, Typography } from '@mui/material';
import DialogCreateConfig from './Component/DialogCreateConfig';
import Loading from '@/components/ui/Loading/Loading';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import Select from '@/components/common/Select/Select';
import { useQueryClient } from '@tanstack/react-query';
import type { ConfigItem } from '@/types';
import { useGroupType } from '@/hooks/UseAllData'
import { useAuth } from '@/context/AuthContext';
import { Roles } from '@/utils/roles';

const Config: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotification();
    const { generalCategory, specificCategory } = useConfigData();
    const { data: groupTypes } = useGroupType()
    const { user } = useAuth();

    const params = Object.fromEntries(searchParams);
    const tabParam = params.tab as 'common' | 'specific' | null;
    const { type: configParam, page: pageParam, search: searchParam } = params;

    const [activeTab, setActiveTab] = useState<'common' | 'specific'>(tabParam || 'common');
    const [search, setSearch] = useState(searchParam || '');
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
    const [size, setSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [openConfigDialog, setOpenConfigDialog] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<ConfigCategoryItem | null>(generalCategory[0].items[0]);
    const [selectedItem, setSelectedItem] = useState<ConfigItem | null>(null);
    const [columns, setColumns] = useState<string[]>(['cid', 'name', 'description']);

    const [response, setResponse] = useState<{
        data: ConfigItem[],
        totalItems: number
    }>({
        data: [],
        totalItems: 0
    });


    useEffect(() => {
        const queryParams = new URLSearchParams();
        queryParams.set('tab', activeTab);
        if (selectedConfig) queryParams.set('type', selectedConfig.url.replace('/', ''));
        if (page > 1) queryParams.set('page', page.toString());
        if (search.trim()) queryParams.set('search', search);

        setSearchParams(queryParams, { replace: true });
    }, [activeTab, selectedConfig, search, page, setSearchParams]);

    useEffect(() => {
        if (configParam) {
            const allItems = [...generalCategory, ...specificCategory].flatMap(cat => cat.items);
            const found = allItems.find(i => i.url === `/${configParam}`);
            if (found) setSelectedConfig(found);
        }

        const p = pageParam ? parseInt(pageParam) : 1;
        if (p !== page) setPage(p);

        if (searchParam !== undefined && searchParam !== search) {
            setSearch(searchParam);
        }
    }, [configParam, activeTab, generalCategory, specificCategory, pageParam, searchParam]);

    
    const currentCategory = useMemo(() =>
        activeTab === 'common' ? generalCategory : specificCategory,
        [activeTab, generalCategory, specificCategory]);

    const roleAccess = useMemo(() => user?.roles?.includes(Roles.ADMIN) || user?.roles?.includes(Roles.MANAGE_XNK), [user]);

    const handleSelectConfig = useCallback((config: ConfigCategoryItem) => {
        setSelectedConfig(config);
        setPage(1);
        setSearch('');
        setSelectedItem(null);
    }, [setSelectedConfig, setPage, setSearch, setSelectedItem]);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
        setSelectedItem(null);
    }, [setOpenDialog, setSelectedItem]);

    const handleOpenDialogDelete = useCallback((item: ConfigItem) => {
        if (!item) return;
        const roleStaff = user?.positions?.includes(Roles.STAFF_DELETE);
        if (!roleAccess && !roleStaff) {
            showNotification(
                'error',
                'Chỉ có Admin và Manager hoặc nhân viên có quyền xóa mới có quyền xóa sản phẩm',
                'Lỗi hệ thống'
            );
            return;
        }
        setSelectedItem(item);
        setOpenConfigDialog(true);
    }, []);

    const handleOpenDialogCreate = useCallback(() => {
        const roleStaff = user?.positions?.includes(Roles.STAFF_ADD);
        if (!roleAccess && !roleStaff) {
            showNotification(
                'error',
                'Chỉ có Admin và Manager hoặc nhân viên có quyền thêm mới mới có quyền thêm mới sản phẩm',
                'Lỗi hệ thống'
            );
            return;
        }
        setSelectedItem(null);
        setOpenDialog(true);
    }, [setOpenDialog, setSelectedItem]);

    const handleSelectItem = useCallback((item: ConfigItem) => {
        if (!item) return;
        const roleStaff = user?.positions?.includes(Roles.STAFF_EDIT);
        if (!roleAccess && !roleStaff) {
            showNotification(
                'error',
                'Chỉ có Admin và Manager hoặc nhân viên có quyền sửa mới có quyền sửa sản phẩm',
                'Lỗi hệ thống'
            );
            return;
        }
        setSelectedItem(item);
        setOpenDialog(true);
    }, [setSelectedItem, setOpenDialog]);

    const handleDeleteItem = useCallback(async () => {
        try {
            const response = await axiosClient.delete(`/api${selectedConfig?.url}/delete/${selectedItem?.id}`);
            showNotification('success', response.data.message, 'Successfully');
            fetchConfigData();
            setOpenConfigDialog(false);
            queryClient.invalidateQueries({
                queryKey: [`${selectedConfig?.url.replace("/", "")}`]
            })
        } catch (error: any) {
            showNotification('error', error.response.data.message || 'Delete failed', 'Error');
        }
    }, [selectedConfig, selectedItem]);

    useEffect(() => {
        if (selectedConfig) {
            fetchConfigData();
        }
    }, [selectedConfig, page, size]);

    const fetchConfigData = async () => {
        try {
            setIsLoading(true);
            const cleanQuery = cleanParams({ search, size });
            const res = await axiosClient.get(`/api${selectedConfig?.url}/page/${page}`, { params: cleanQuery });

            const firstItem = res.data.data[0];
            const keys = Object.keys(firstItem);
            setColumns(keys);
            if (!firstItem.id) {
                setResponse((prev) => ({
                    ...prev,
                    data: [],
                    totalItems: 0
                }));
            } else {
                setResponse((prev) => ({
                    ...prev,
                    data: res.data.data,
                    totalItems: res.data.totalItems
                }));
            }
        } catch (error: any) {
            showNotification('error', error.response.data.message || 'Get data failed', 'Error');
        } finally {
            setIsLoading(false);
        }
    };

    const columnsLabel: { [key: string]: string } = {
        'cid': 'Mã nhận diện',
        'name': 'Tên hiển thị',
        'description': 'Mô tả chi tiết',
        'modifiedAt': 'Thời gian',
        'value': 'Giá trị',
        'type': 'Đơn vị',
        'taxRate': 'Thuế suất',
        'groupTypeDto': 'Loại nhóm'
    };

    const columnsConfig = useMemo(() => {
        return columns.filter(c => c !== 'id' && c !== 'createdAt').map((column) => ({
            header: columnsLabel[column] || column,
            key: column,
            width: column === 'description' ? '15vw' : undefined,
            render: (item: any) => {
                if (column === 'cid') {
                    return (
                        <span className='badge-chip badge-info'>
                            {item[column] || '-'}
                        </span>
                    );
                }

                if (column === 'groupTypeDto') {
                    return (
                        <Typography variant="subtitle1" fontSize={12}>
                            {item[column]?.name || '-'}
                        </Typography>
                    );
                }

                if (column === 'description') {
                    return (
                        <Typography sx={{
                            fontSize: "0.75rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: '#64748b'
                        }}>
                            {item.description || "-"}
                        </Typography>
                    )
                }
                return (
                    <Typography variant="subtitle1" fontSize={12}>
                        {column === 'modifiedAt' ? new Date(item[column]).toLocaleString('vi-VN') : item[column] || '-'}
                    </Typography>
                );
            }
        }));
    }, [columns]);

    return (
        <div className="config-page-wrapper">
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <aside className="config-sidebar">
                <h3 className="sidebar-group-title">Phân loại cấu hình</h3>
                <div className="sidebar-menu">
                    <TabItem
                        active={activeTab === 'common'}
                        icon="shield"
                        label="Thông số chung"
                        onClick={() => setActiveTab('common')}
                    />
                    <TabItem
                        active={activeTab === 'specific'}
                        icon="settings"
                        label="Thông số riêng"
                        onClick={() => setActiveTab('specific')}
                    />
                </div>
            </aside>

            <main className="config-main-content">
                <div className="config-card">
                    <header className="card-header">
                        <div className="header-title-group align-center">
                            <h2>{activeTab === 'common' ? 'Thông số chung' : 'Thông số riêng'}</h2>
                            <p>Đang cấu hình: <span className="status-badge">{selectedConfig?.name || 'Chưa chọn'}</span></p>
                        </div>

                        <div className="header-actions">
                            <div className="modern-search">
                                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nhanh..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchConfigData()}
                                />
                            </div>

                            <div style={{ minWidth: "80px" }}>
                                <Select
                                    value={size}
                                    options={[{ label: "20", value: 20 }, { label: "50", value: 50 }, { label: "100", value: 100 }]}
                                    onChangeSize={(value: string | number) => setSize(Number(value))}
                                />
                            </div>
                            <div style={{ minWidth: "180px" }}>
                                <TreeSelect
                                    data={currentCategory}
                                    onSelect={handleSelectConfig}
                                    value={selectedConfig}
                                    placeholder="Chọn danh mục..."
                                />
                            </div>

                            <Button variant='primary' onClick={handleOpenDialogCreate} icon={<AddIcon fontSize='small' />}>Thêm mới</Button>
                        </div>
                    </header>

                    <div className="table-scroll-container" style={{ height: 'calc(100vh - 230px)' }}>
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th style={{ maxWidth: '5vw' }}>
                                        <Typography variant="subtitle2" fontSize={13} fontWeight={700} align='center'>STT</Typography>
                                    </th>
                                    {columnsConfig.map((column) => (
                                        <th key={column.key}>
                                            <Typography variant="subtitle2" fontSize={13} fontWeight={700} align='center' sx={{ textTransform: 'capitalize' }}>
                                                {column.header}
                                            </Typography>
                                        </th>
                                    ))}
                                    <th>
                                        <Typography variant="subtitle2" fontWeight={700} align='center' sx={{ textTransform: 'capitalize' }}>
                                            Thao tác
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(response?.data || []).map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Typography variant="body2" fontWeight={700} color="textSecondary" align='center' fontSize={12}>
                                                {(page - 1) * size + index + 1}
                                            </Typography>
                                        </td>
                                        {columnsConfig.map((col) => (
                                            <td key={`${index}-${col.key}`} style={{ maxWidth: col.width }}>
                                                {col.render ? col.render(item) : (
                                                    <Typography variant="body2" fontSize={12}>
                                                        {item[col.key as keyof ConfigItem]}
                                                    </Typography>
                                                )}
                                            </td>
                                        ))}
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <IconButton onClick={() => handleSelectItem(item)}>
                                                    <EditIcon fontSize='small' />
                                                </IconButton>
                                                <IconButton onClick={() => handleOpenDialogDelete(item)}>
                                                    <DeleteIcon fontSize='small' color='error' />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            totalItems={response.totalItems}
                            page={page}
                            size={size}
                            onChange={(value) => setPage(value)}
                        />
                    </div>
                </div>
                <DialogCreateConfig
                    data={selectedItem}
                    columns={columns}
                    columnsLabel={columnsLabel}
                    dataAutocomplete={groupTypes}
                    selectedConfig={selectedConfig}
                    open={openDialog}
                    onClose={handleCloseDialog}
                    onSuccess={fetchConfigData}
                />
                <ConfirmDialog
                    open={openConfigDialog}
                    title="Xác nhận"
                    content="Bạn có chắc chắn muốn xóa không?"
                    onClose={() => setOpenConfigDialog(false)}
                    onConfirm={handleDeleteItem}
                    loading={isLoading}
                />
            </main>
        </div>
    );
};


const TabItem: React.FC<{ active: boolean, label: string, icon: string, onClick: () => void }> = ({ active, label, onClick }) => (
    <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <path d="M9 3v18"></path>
        </svg>
        {label}
    </div>
);

export default Config;