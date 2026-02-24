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

interface ConfigItem {
    id: number;
    cid: string;
    name: string;
    description: string;
    type?: string;
    value?: string;
}

const Config: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotification();
    const { generalCategory, specificCategory } = useConfigData();

    const tabParam = searchParams.get('tab') as 'common' | 'specific' | null;
    const configParam = searchParams.get('type');

    const [activeTab, setActiveTab] = useState<'common' | 'specific'>(tabParam || 'common');
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [selectedConfig, setSelectedConfig] = useState<ConfigCategoryItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<ConfigItem | null>(null);
    const [columns, setColumns] = useState<string[]>(['cid', 'name', 'description']);

    useEffect(() => {
        const params: any = { tab: activeTab };
        if (selectedConfig) {
            params.type = selectedConfig.url.replace('/', '');
        }
        setSearchParams(params, { replace: true });
    }, [activeTab, selectedConfig, setSearchParams]);

    useEffect(() => {
        if (configParam) {
            const categories = activeTab === 'common' ? generalCategory : specificCategory;
            for (const cat of categories) {
                const item = cat.items.find(i => i.url === `/${configParam}`);
                if (item) {
                    setSelectedConfig(item);
                    return;
                }
            }
        }
    }, [configParam, activeTab, generalCategory, specificCategory]);

    const [response, setResponse] = useState<{
        data: ConfigItem[],
        dataAutocomplete: {
            groupType: ConfigItem[],
            frameType: ConfigItem[]
        },
        totalItems: number
    }>({
        data: [],
        dataAutocomplete: {
            groupType: [],
            frameType: []
        },
        totalItems: 0
    });

    const currentCategory = useMemo(() =>
        activeTab === 'common' ? generalCategory : specificCategory,
        [activeTab, generalCategory, specificCategory]);

    const handleSelectConfig = useCallback((config: ConfigCategoryItem) => {
        setSelectedConfig(config);
    }, []);

    const handleSelectItem = useCallback((item: ConfigItem) => {
        setSelectedItem(item);
        setOpenDialog(true);
    }, []);

    const handleDeleteItem = useCallback((id: number) => {
        try {

        } catch (error) {

        }
    }, []);

    useEffect(() => {
        fetchAutocompleteData();
    }, []);

    useEffect(() => {
        if (selectedConfig) {
            fetchConfigData();
        }
    }, [selectedConfig, page, size]);

    const fetchConfigData = async () => {
        try {
            const cleanQuery = cleanParams({ search, size });
            const res = await axiosClient.get(`/api${selectedConfig?.url}/page/${page}`, { params: cleanQuery });

            if (res.data.data?.length > 0) {
                const firstItem = res.data.data[0];
                const keys = Object.keys(firstItem);
                setColumns(keys);
            }
            setResponse((prev) => ({
                ...prev,
                data: res.data.data,
                totalItems: res.data.totalItems
            }));
        } catch (error) {
            showNotification('error', 'Lấy dữ liệu thất bại', 'Lỗi');
        }
    };

    const fetchAutocompleteData = async () => {
        try {
            const [groupTypeRes, frameTypeRes] = await Promise.all([
                axiosClient.get('/api/group-type/all'),
                axiosClient.get('/api/frame-type/all')
            ])
            setResponse((prev) => ({
                ...prev,
                dataAutocomplete: {
                    groupType: groupTypeRes.data,
                    frameType: frameTypeRes.data
                }
            }))
        } catch (error) {
            showNotification('error', 'Lấy dữ liệu thất bại', 'Lỗi');
        }
    }
    const columnsLabel: { [key: string]: string } = {
        'cid': 'Mã nhận diện',
        'name': 'Tên hiển thị',
        'description': 'Mô tả chi tiết',
        'modifiedAt': 'Thời gian',
        'value': 'Giá trị',
        'type': 'Đơn vị'
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

                            <div style={{ minWidth: "180px" }}>
                                <TreeSelect
                                    data={currentCategory}
                                    onSelect={handleSelectConfig}
                                    placeholder="Chọn danh mục..."
                                />
                            </div>

                            <Button onClick={() => setOpenDialog(true)} icon={<AddIcon fontSize='small' />}>Thêm mới</Button>
                        </div>
                    </header>

                    <div className="table-scroll-container" style={{ height: 'calc(100vh - 248px)' }}>
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
                                                <IconButton onClick={() => handleDeleteItem(item.id)}>
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
                    dataAutocomplete={response.dataAutocomplete}
                    selectedConfig={selectedConfig}
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSuccess={fetchConfigData}
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