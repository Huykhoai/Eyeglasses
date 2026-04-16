import React, { useState, useMemo, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Checkbox,
} from '@mui/material';
import {
    Close as CloseIcon,
    AddShoppingCart as AddIcon,
    Inventory as ProductIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import Button from '@/components/common/Button/Button';
import Loading from '@/components/ui/Loading/Loading';
import MultiFilterBar from '@/components/common/MultiFilterBar/MultiFilterBar';
import { filterDialogProduct } from '../config/filterDialogProduct';
import ProductTypeTabs from '@/pages/Product/components/ProductTypeTabs';
import type { ProductType } from '@/pages/Product/types/product';
import Select from '@/components/common/Select/Select';
import { cleanParams } from '@/utils/cleanParams';
import type { ColumnDef, PaginatedResponse } from '@/types';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import { formatPrice } from '@/utils/formatPrice';
import TextField from '@/components/common/TextField/TextField';
import Pagination from '@/components/common/Pagination/Pagination';
import type { SelectedProduct } from '../config/types';

interface DialogSelectProductProps {
    open: boolean;
    onClose: () => void;
    onSelected: (products: Map<number, SelectedProduct>) => void;
}

const DialogSelectProduct: React.FC<DialogSelectProductProps> = ({ open, onClose, onSelected }) => {
    const filterOptions = useMemo(() => filterDialogProduct, []);
    const { showNotification } = useNotification();

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [productType, setProductType] = useState<ProductType>('LENS');
    const [tempSelected, setTempSelected] = useState<Map<number, SelectedProduct>>(new Map());

    const { data, isLoading } = useQuery<PaginatedResponse<SelectedProduct>>({
        queryKey: ['products-quotation', page, size, filters, productType],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filters, type: productType, size });
                const response = await axiosClient.get(`/api/purchase-quotation/products/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems } as PaginatedResponse<SelectedProduct>;
            } catch (error: any) {
                const message = error?.response?.data?.message || error.message || "Đã có lỗi xảy ra";
                showNotification('error', message, 'Lỗi hệ thống');
                throw error;
            }
        },
        enabled: open,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const products = data?.items || [];
    const totalItems = data?.totalItems || 0;

    const handleFilterChange = useCallback((values: Record<string, any>) => {
        let newFilter: Record<string, any> = {
            type: productType.toLowerCase()
        };
        Object.entries(values).forEach(([key, value]) => {
            if (value !== '') {
                if (typeof value === 'object') {
                    newFilter[key] = value?.id;
                } else {
                    newFilter[key] = value;
                }
            }
        })
        setFilters(newFilter);
        setPage(1);
    }, [productType]);


    const handleTypeChange = useCallback((type: ProductType) => {
        setProductType(type);
        setPage(1);
        setFilters({});
    }, []);

    const handleChangeSize = useCallback((size: number) => {
        setPage(1);
        setSize(size);
    }, []);
    const handleToggleSelect = (product: SelectedProduct) => {
        setTempSelected(prev => {
            const newSelected = new Map(prev);
            if (newSelected.has(product.id)) {
                newSelected.delete(product.id);
            } else {
                newSelected.set(product.id, {
                    ...product,
                    requestQty: 1,
                    expectedPrice: product.lastPurchasePrice || product.originalPrice || 0,
                    quotedQty: 1,
                    quotedPrice: product.lastPurchasePrice || product.originalPrice || 0,
                });
            }
            return newSelected;
        });
    };

    const handleUpdateQty = (id: number, qty: number) => {
        setTempSelected(prev => {
            const newSelected = new Map(prev);
            const item = newSelected.get(id);
            if (item) {
                newSelected.set(id, { ...item, requestQty: qty || 0, quotedQty: qty || 0 });
            }
            return newSelected;
        });
    };

    const handleUpdatePrice = (id: number, price: number) => {
        setTempSelected(prev => {
            const newSelected = new Map(prev);
            const item = newSelected.get(id);
            if (item) {
                newSelected.set(id, { ...item, expectedPrice: price, quotedPrice: price });
            }
            return newSelected;
        });
    };

    const handleUpdateQuoteQty = (id: number, qty: number) => {
        setTempSelected(prev => {
            const newSelected = new Map(prev);
            const item = newSelected.get(id);
            if (item) {
                newSelected.set(id, { ...item, quotedQty: qty || 0 });
            }
            return newSelected;
        });
    };

    const handleUpdateQuotePrice = (id: number, price: number) => {
        setTempSelected(prev => {
            const newSelected = new Map(prev);
            const item = newSelected.get(id);
            if (item) {
                newSelected.set(id, { ...item, quotedPrice: price });
            }
            return newSelected;
        });
    };

    const handleSubmit = () => {
        onSelected(tempSelected);
        setTempSelected(new Map());
        onClose();
    };

    const columns: ColumnDef[] = useMemo(() => [
        {
            key: 'select',
            header: '',
            width: '4vw',
            align: 'center',
            render: (item: SelectedProduct) => (
                <Checkbox
                    checked={!!tempSelected.get(item.id)}
                    onChange={() => handleToggleSelect(item)}
                />
            ),
        },
        {
            key: 'cid',
            header: 'Mã sản phẩm',
            width: '10vw',
            align: 'center',
            render: (item: SelectedProduct) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
            ),
        },
        {
            key: 'name',
            header: 'Tên đầy đủ',
            width: '15vw',
            render: (item: SelectedProduct) => (
                <Typography variant="subtitle2" fontSize={12} fontWeight={600}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'left',
                    }}>
                    {item.name}
                </Typography>
            ),
        },
        {
            key: 'unit',
            header: 'Đơn vị',
            width: '10%',
            align: 'center',
            render: (item: SelectedProduct) => item.unit,
        },
        {
            key: 'tax',
            header: 'Thuế',
            align: 'right',
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="textSecondary">
                    {formatPrice(item.tax || 0)}%
                </Typography>
            ),
        },
        {
            key: 'originalPrice',
            header: 'Nguyên tệ',
            align: 'right',
            render: (item: SelectedProduct) => (
                <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                    {formatPrice(item.originalPrice)}
                </Typography>
            ),
        },
        {
            key: 'requestQty',
            header: 'SL dự kiến',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!tempSelected.get(item.id);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='requestQty'
                                type="text"
                                value={tempSelected.get(item.id)?.requestQty}
                                onChange={(e) => handleUpdateQty(item.id, Number(e.target.value) || 1)}
                                props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.requestQty || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'expectedPrice',
            header: 'Giá dự kiến',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!tempSelected.get(item.id);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='expectedPrice'
                                type="text"
                                value={tempSelected.get(item.id)?.expectedPrice}
                                onChange={(e) => handleUpdatePrice(item.id, Number(e.target.value) || 0)}
                                props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.expectedPrice || item.lastPurchasePrice || item.originalPrice || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'quotedQty',
            header: 'SL báo giá',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!tempSelected.get(item.id);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='quotedQty'
                                type="text"
                                value={tempSelected.get(item.id)?.quotedQty}
                                onChange={(e) => handleUpdateQuoteQty(item.id, Number(e.target.value) || 0)}
                                props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.quotedQty || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'quotedPrice',
            header: 'Giá báo giá',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = !!tempSelected.get(item.id);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        {isSelected ? (
                            <TextField
                                name='quotedPrice'
                                type="text"
                                value={tempSelected.get(item.id)?.quotedPrice}
                                onChange={(e) => handleUpdateQuotePrice(item.id, Number(e.target.value) || 0)}
                                props={{ min: 1, style: { textAlign: 'center', width: '5vw', padding: '5px 10px' } }}
                            />
                        ) : (
                            <Typography variant="body2" fontSize={12} fontWeight={600}>
                                {formatPrice(item.quotedPrice || item.lastPurchasePrice || item.originalPrice || 0)}
                            </Typography>
                        )}
                    </Box>
                )
            },
        },
        {
            key: 'totalPrice',
            header: 'Tổng tiền',
            align: 'right',
            render: (item: SelectedProduct) => {
                const isSelected = tempSelected.get(item.id);
                return (
                    <Typography variant="body2" fontSize={12} fontWeight={600} color="error">
                        {`$${formatPrice((isSelected?.quotedPrice || 0) * (isSelected?.quotedQty || 0))}`}
                    </Typography>

                )
            },
        }
    ], [tempSelected])

    return (
        <Dialog open={open} onClose={onClose} fullWidth PaperProps={{ sx: { borderRadius: '16px', minWidth: '90vw', height: '90vh' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ProductIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>Chọn sản phẩm yêu cầu báo giá</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    marginY: '10px',
                }}>
                    <Box>
                        <Select
                            value={size}
                            options={[
                                { label: '20', value: 20 },
                                { label: '50', value: 50 },
                                { label: '100', value: 100 },
                            ]}
                            onChangeSize={(value) => handleChangeSize(Number(value))}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <MultiFilterBar
                            categories={filterOptions}
                            onFilterChange={handleFilterChange}
                        />
                    </Box>
                    <Box>
                        <ProductTypeTabs
                            value={productType}
                            onChange={handleTypeChange}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}>
                    {isLoading ? <Loading message="Đang tải sản phẩm..." /> : (
                        <div className="table-scroll-container">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.key}
                                                style={{
                                                    minWidth: column.width,
                                                    textAlign: column.align
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontSize={11} fontWeight={700}>
                                                    {column.header}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product: SelectedProduct) => {
                                        return (
                                            <tr key={product.id}>
                                                {columns.map((column) => (
                                                    <td key={column.key} align={column.align} style={{ maxWidth: column.width }}>
                                                        {column.render
                                                            ? column.render(product)
                                                            : <Typography variant="body2" fontSize={12}>{(product as any)[column.key] ?? '-'}</Typography>}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', justifyContent: 'space-between' }}>
                <Pagination
                    totalItems={totalItems}
                    page={page}
                    size={size}
                    onChange={(page) => setPage(page)}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={tempSelected.size === 0}
                        icon={<AddIcon fontSize="small" />}
                    >
                        Thêm ({tempSelected.size}) sản phẩm
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DialogSelectProduct;
