import React, { useState, useMemo, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
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
import type { PaginatedResponse } from '@/types';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import Pagination from '@/components/common/Pagination/Pagination';
import type { SelectedProduct } from '../config/types';
import { useFormContext } from 'react-hook-form';
import { columns } from '../config/columnsTableDialog';

interface DialogSelectProductProps {
    open: boolean;
    onClose: () => void;
}

const DialogSelectProduct: React.FC<DialogSelectProductProps> = ({ open, onClose }) => {
    const { showNotification } = useNotification();
    const { getValues, setValue } = useFormContext();
    const supplier = getValues('supplier');

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [localProducts, setLocalProducts] = useState<Map<number, any>>(getValues('products'));
    const [productType, setProductType] = useState<ProductType>('LENS');

    const filterOptions = useMemo(() => filterDialogProduct, []);
    const { data, isLoading } = useQuery<PaginatedResponse<SelectedProduct>>({
        queryKey: ['products-quotation', page, size, filters, supplier?.id, productType],
        queryFn: async () => {
            try {
                const params = cleanParams({ ...filters, supplier: supplier?.id, type: productType, size });
                const response = await axiosClient.get(`/api/purchase-quotation/products/${page}`, { params });
                return { items: response.data.data, totalItems: response.data.totalItems } as PaginatedResponse<SelectedProduct>;
            } catch (error: any) {
                const message = error?.response?.data?.message || error.message || "Đã có lỗi xảy ra";
                showNotification('error', message, 'Lỗi hệ thống');
                throw error;
            }
        },
        enabled: !!open && !!supplier?.id,
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

    const handleAddItems = useCallback((items: Map<number, any>) => {
        setLocalProducts(items);
    }, []);

    const handleConfirm = useCallback(() => {
        if (localProducts.size === 0) return;
        setValue('products', localProducts, { shouldDirty: true });
        onClose();
    }, [onClose, localProducts, setValue]);

    const columnsTable = columns(localProducts, handleAddItems);

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
                                        {columnsTable.map((column) => (
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
                                            <tr key={product.productId}>
                                                {columnsTable.map((column) => (
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
                        onClick={handleConfirm}
                        disabled={localProducts.size === 0}
                        icon={<AddIcon fontSize="small" />}
                    >
                        Thêm ({localProducts.size}) sản phẩm
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DialogSelectProduct;
