import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, Edit as EditIcon, Delete as DeleteIcon, SettingsEthernet as SettingsEthernetIcon, Tune } from '@mui/icons-material';
import MultiFilterBar, { type FilterItem } from '@/components/common/MultiFilterBar/MultiFilterBar';
import Select from '@/components/common/Select/Select';
import Pagination from '@/components/common/Pagination/Pagination';
import Loading from '@/components/ui/Loading/Loading';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import ProductTypeTabs from './components/ProductTypeTabs';
import AddProductMenu from './components/AddProductMenu';
import { useProductData } from './hooks/useProductData';
import { getColumnsForType } from './config/columnConfig';
import type { ProductType, Product as ProductItem } from './types/product';
import './Product.css';
import Button from '@/components/common/Button/Button';
import { useTouchMoveTable } from '@/utils/touchMoveTable';

const productTypeLabels: Record<ProductType, string> = {
    LENS: 'Mắt kính',
    FRAME: 'Gọng kính',
    ACCESSORY: 'Phụ kiện',
};

const Product: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotification();
    const { tableRef, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchMoveTable();

    const params = Object.fromEntries(searchParams);
    const typeParam = (params.type?.toUpperCase() as ProductType) || 'LENS';
    const pageParam = params.page ? parseInt(params.page) : 1;

    const [productType, setProductType] = useState<ProductType>(typeParam);
    const [showInfo, setShowInfo] = useState<Record<string, boolean>>({});
    const [page, setPage] = useState(pageParam);
    const [size, setSize] = useState(20);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const { data: paginatedProducts, isLoading } = useProductData(productType, page, size, filters);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    const handleToggleInfo = useCallback((key: string) => {
        setShowInfo((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }, [setShowInfo]);

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, item: ProductItem) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(item);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
        setSelectedProduct(null);
    }, []);

    const handleEditFromMenu = useCallback(() => {
        if (selectedProduct) {
            navigate(`/products/update/${selectedProduct.id}`);
        }
        handleCloseMenu();
    }, [selectedProduct, navigate, handleCloseMenu]);

    const handleDeleteFromMenu = useCallback(() => {
        handleCloseMenu();
    }, [selectedProduct, handleCloseMenu]);

    useEffect(() => {
        const qp = new URLSearchParams();
        qp.set('type', productType.toLowerCase());
        if (page > 1) qp.set('page', page.toString());
        setSearchParams(qp, { replace: true });
    }, [productType, page, setSearchParams]);

    const columns = useMemo(() => getColumnsForType(productType), [productType]);

    const filterCategories: FilterItem[] = useMemo(() => {
        const base: FilterItem[] = [
            { key: 'name', label: 'Tên', type: 'text' },
            { key: 'cid', label: 'Mã SP', type: 'text' },
            { key: 'engName', label: 'Tên tiếng Anh', type: 'text' },
            { key: 'brand', label: 'Thương hiệu', type: 'select', options: [] },
        ];

        if (productType === 'LENS') {
            return [
                ...base,
                { key: 'sph', label: 'SPH', type: 'number' },
                { key: 'cyl', label: 'CYL', type: 'number' },
            ];
        }

        if (productType === 'FRAME') {
            return [
                ...base,
                { key: 'model', label: 'Model', type: 'text' },
                { key: 'serial', label: 'Serial', type: 'text' },
            ];
        }

        return base;
    }, [productType]);

    const handleTypeChange = useCallback((type: ProductType) => {
        setProductType(type);
        setPage(1);
        setFilters({});
    }, []);

    const handleFilterChange = useCallback((values: Record<string, any>) => {
        setFilters(values);
        setPage(1);
    }, []);

    const handleAdd = useCallback(() => {
        navigate('/products/add');
    }, []);

    const handleBulkAdd = useCallback(() => {
        showNotification('info', 'Chức năng đang phát triển', 'Thông báo');
    }, [showNotification]);


    return (
        <div className="product-page-wrapper">
            {isLoading && <Loading fullPage message="Đang tải sản phẩm..." />}

            <div className="product-header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại
                </Button>
                <div className="product-filter-section">
                    <MultiFilterBar
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <div className="product-header-actions">
                    <ProductTypeTabs
                        value={productType}
                        onChange={handleTypeChange}
                    />

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

                    <AddProductMenu
                        onAdd={handleAdd}
                        onBulkAdd={handleBulkAdd}
                    />
                </div>
            </div>

            <div className="product-card">
                <div className="product-info-bar">
                    <div className="info-left">
                        Danh sách <strong>{productTypeLabels[productType]}</strong>
                        <span className="product-count-badge">
                            {paginatedProducts?.totalItems} sản phẩm
                        </span>
                    </div>
                </div>

                {(paginatedProducts?.items?.length ?? 0) > 0 ? (
                    <div className="table-scroll-container" style={{ height: 'calc(100vh - 300px)' }}
                        ref={tableRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <table className="table-premium">
                            <thead>
                                {(() => {
                                    const groupedHeaders: { name: string; span: number, isSticky?: boolean, left?: string, zIndex?: number, icon?: boolean }[] = [];
                                    groupedHeaders.push({ name: '', span: 1, isSticky: true, left: '0px', zIndex: 12 });

                                    columns.forEach((col: any) => {
                                        const groupName = col.groupName || 'Thông tin khác';
                                        const isFolded = showInfo[groupName];
                                        if (groupedHeaders.length > 0 && groupedHeaders[groupedHeaders.length - 1].name === groupName) {
                                            if (!isFolded) {
                                                groupedHeaders[groupedHeaders.length - 1].span++;
                                            }
                                        } else {
                                            const icon = groupName === "Thông tin sản phẩm" ? false : true;
                                            groupedHeaders.push({ 
                                                name: groupName, 
                                                span: 1, 
                                                isSticky: col.isSticky, 
                                                left: col.left, 
                                                zIndex: col.zIndex, 
                                                icon: icon 
                                            });
                                        }
                                    });

                                    groupedHeaders.push({ name: 'Công cụ', span: 1, icon: false });

                                    return (
                                        <tr className="group-header-row">
                                            {groupedHeaders.map((group, idx) => (
                                                <th 
                                                    key={idx} 
                                                    colSpan={group.span} 
                                                    style={{ 
                                                        backgroundColor: '#f1f5f9', 
                                                        borderBottom: '2px solid #e2e8f0', 
                                                        position: group.isSticky ? 'sticky' : 'static',
                                                        left: group.left,
                                                        zIndex: group.zIndex,
                                                    }}
                                                >
                                                    <Typography variant="overline" fontSize={10} fontWeight={800} color="primary" 
                                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        {group.name}
                                                        {group.icon && (
                                                            <IconButton size="small" sx={{ p: 0}} onClick={() => handleToggleInfo(group.name)}>
                                                                {showInfo[group.name] ? (
                                                                    <VisibilityOffIcon fontSize="small" />
                                                                ) : (
                                                                    <VisibilityIcon fontSize="small" />
                                                                )}
                                                            </IconButton>
                                                        )}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    );
                                })()}
                                <tr>
                                    <th style={{ width: '50px', position: 'sticky', left: '0px', zIndex: 12 }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                            STT
                                        </Typography>
                                    </th>
                                    {(() => {
                                        const visibleColumns: any[] = [];
                                        let currentGroup = "";
                                        columns.forEach((col: any) => {
                                            const groupName = col.groupName || 'Thông tin khác';
                                            if (showInfo[groupName]) {
                                                if (groupName !== currentGroup) {
                                                    visibleColumns.push({ ...col, header: "...", key: `folded-${groupName}`, isFolded: true });
                                                }
                                            } else {
                                                visibleColumns.push(col);
                                            }
                                            currentGroup = groupName;
                                        });
                                        return visibleColumns.map((col: any) => (
                                            <th 
                                                key={col.key} 
                                                style={{ 
                                                    minWidth: col.isFolded ? '40px' : col.width, 
                                                    textAlign: 'center', 
                                                    position: col.isSticky ? 'sticky' : 'static',
                                                    left: col.left,
                                                    zIndex: col.zIndex,
                                                }}
                                            >
                                                <div className="cell-animate-entrance">
                                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700}>
                                                        {col.header}
                                                    </Typography>
                                                </div>
                                            </th>
                                        ));
                                    })()}
                                    <th style={{ width: '90px' }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                            Thao tác
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(paginatedProducts?.items ?? []).map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td style={{ position: 'sticky', left: '0px', zIndex: 12 }}>
                                            <Typography variant="body2" fontWeight={700} color="textSecondary" align="center" fontSize={12}>
                                                {(page - 1) * size + index + 1}
                                            </Typography>
                                        </td>
                                        {(() => {
                                            const visibleRowContent: any[] = [];
                                            let currentGroup = "";
                                            columns.forEach((col: any) => {
                                                const groupName = col.groupName || 'Thông tin khác';
                                                if (showInfo[groupName]) {
                                                    if (groupName !== currentGroup) {
                                                        visibleRowContent.push({
                                                            key: `folded-cell-${groupName}`,
                                                            isFolded: true,
                                                            isSticky: col.isSticky,
                                                            left: col.left,
                                                            zIndex: col.zIndex
                                                        });
                                                    }
                                                } else {
                                                    visibleRowContent.push(col);
                                                }
                                                currentGroup = groupName;
                                            });

                                            return visibleRowContent.map((col: any) => (
                                                <td 
                                                    key={`${item.id}-${col.key}`} 
                                                    style={{ 
                                                        maxWidth: col.isFolded ? '40px' : col.width, 
                                                        textAlign: col.align || 'center', 
                                                        position: col.isSticky ? 'sticky' : 'static',
                                                        left: col.left,
                                                        zIndex: col.zIndex,
                                                    }}
                                                >
                                                    {col.isFolded ? (
                                                        <div className="folded-icon-entrance" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <SettingsEthernetIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />
                                                        </div>
                                                    ) : (
                                                        <div className="cell-animate-entrance">
                                                            {col.render ? (
                                                                col.render(item)
                                                            ) : (
                                                                <Typography variant="body2" fontSize={12}>{(item as any)[col.key] ?? '-'}</Typography>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            ));
                                        })()}
                                        <td>
                                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
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
                ) : (
                    !isLoading && (
                        <div className="product-empty-state">
                            <div className="empty-icon">📦</div>
                            <div className="empty-title">Chưa có sản phẩm</div>
                            <div className="empty-desc">
                                Hãy thêm sản phẩm {productTypeLabels[productType].toLowerCase()} đầu tiên
                            </div>
                        </div>
                    )
                )}

                {(paginatedProducts?.totalItems ?? 0) > 0 && (
                    <div className="product-pagination">
                        <Pagination
                            totalItems={paginatedProducts?.totalItems ?? 0}
                            page={page}
                            size={size}
                            onChange={(value) => setPage(value)}
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
                }}>
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

export default Product;