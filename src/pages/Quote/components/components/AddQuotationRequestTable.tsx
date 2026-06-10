import { useMemo } from "react";
import { columns } from "../../config/columnsTableItem";
import { Box, Stack, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import Select from "@/components/common/Select/Select";
import Pagination from "@/components/common/Pagination/Pagination";
import type { SelectedProduct } from "../../config/types";
import { formatPrice } from '@/utils/formatPrice';
import { useQuery } from "@tanstack/react-query";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import axiosClient from "@/api/axiosClient";

const AddQuotationRequestTable = ({
    page, size,
    setPage, setSize,
}: { page: number, size: number, setPage: (page: number) => void, setSize: (size: number) => void }) => {
    const { setValue } = useFormContext();
    const { showNotification } = useNotification();

    const productsMap = useWatch({ name: 'products' }) || {};
    const selectedProducts: any[] = useMemo(() => Object.values(productsMap), [productsMap])

    const displayProducts = useMemo(() => {
        return selectedProducts.slice((page - 1) * size, page * size);
    }, [selectedProducts, page, size]);

    const idString = useMemo(() =>
        displayProducts.map((item: any) => item.productId).join(',')
        , [displayProducts]);

    const { data: displayedProducts } = useQuery<SelectedProduct[]>({
        queryKey: ['items-detail-quotation', page, size, idString],
        queryFn: async () => {
            try {
                const response = await axiosClient.post(`/api/purchase-quotation/items-detail`, displayProducts);
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!idString,
        retry: false
    });

    const currency = useWatch({ name: 'currency' });
    const currencyValue = useWatch({ name: 'currencyValue' }) || 1;

    const totalAmount = useMemo(() => {
        return selectedProducts.reduce((sum, item) => sum + ((item.quotedQty || 0) * (item.quotedPrice || 0)), 0);
    }, [selectedProducts]);

    const convertedTotal = useMemo(() => totalAmount * currencyValue, [totalAmount, currencyValue]);

    const handleRemoveProduct = (id: number) => {
        const newMap = { ...productsMap };
        delete newMap[id];
        setValue('products', newMap, { shouldValidate: true, shouldDirty: true });
    };

    const columnsTable = columns(productsMap, page, size, handleRemoveProduct);

    return (
        <>
            <div className='table-scroll-container' style={{ minHeight: 'calc(100vh - 235px)' }}>
                <table className='table-premium'>
                    <thead>
                        <tr>
                            {columnsTable.map((col) => (
                                <th
                                    key={col.key}
                                    style={{
                                        textAlign: col.align,
                                        minWidth: col.width,
                                    }}
                                >
                                    <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                        {col.header}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {((displayedProducts as any[])?.length || 0) === 0 ? (
                            <tr>
                                <td colSpan={12} align="center" style={{ padding: '0 10px' }}>
                                    <Typography variant="body2" color="text.secondary">Chưa có sản phẩm nào được chọn.</Typography>
                                </td>
                            </tr>
                        ) : (displayedProducts || []).map((item: any, index: number) => (
                            <tr key={item.id || index}>
                                {(columnsTable || []).map((col) => (
                                    <td key={col.key} align={col.align} style={{ maxWidth: col.width }}>
                                        {col.render
                                            ? col.render(item, index)
                                            : (item as any)[col.key] || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Box sx={{ p: 1, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ maxWidth: '10vw' }}>
                    <Select
                        options={[
                            { label: '10', value: 10 },
                            { label: '20', value: 20 },
                            { label: '50', value: 50 },
                        ]}
                        value={size}
                        onChangeSize={(value: any) => setSize(Number(value))}
                    />
                </Box>
                <Pagination
                    totalItems={selectedProducts?.length || 0}
                    page={page}
                    size={size}
                    onChange={(page) => setPage(page)}
                />
                <Stack spacing={0.5} sx={{ minWidth: 300, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Thành tiền ({currency?.cid || 'USD'}):</Typography>
                        <Typography color="error" fontSize={15} fontWeight={700}>
                            {formatPrice(totalAmount || 0)} {currency?.cid || '$'}
                        </Typography>
                    </Box>
                    {currencyValue > 1 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1.5px dashed #e2e8f0', pt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Quy đổi (VND):</Typography>
                            <Typography color="primary" fontSize={14} fontWeight={600}>
                                {formatPrice(convertedTotal || 0)} VND
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </>
    );
}

export default AddQuotationRequestTable;