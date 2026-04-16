import { useMemo } from "react";
import { columns } from "../../config/columnsTableItem";
import { Box, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Select from "@/components/common/Select/Select";
import Pagination from "@/components/common/Pagination/Pagination";
import type { SelectedProduct } from "../../config/types";
import { formatPrice } from '@/utils/formatPrice';

const AddQuotationRequestTable = ({
    page,
    size,
    setPage,
    setSize,
}: { page: number, size: number, setPage: (page: number) => void, setSize: (size: number) => void }) => {
    const { setValue, watch } = useFormContext();

    const productsMap = watch('products');
    const selectedProducts: SelectedProduct[] = useMemo(() => Array.from(productsMap.values()), [productsMap]);
    const displayedProducts = useMemo(() => {
        return selectedProducts.slice((page - 1) * size, page * size);
    }, [selectedProducts, page, size]);

    const totalAmount = useMemo(() => {
        return selectedProducts.reduce((sum, item) => sum + ((item.quotedQty || 0) * (item.quotedPrice || 0)), 0);
    }, [selectedProducts]);

    const handleRemoveProduct = (id: number) => {
        const newMap = new Map(productsMap);
        newMap.delete(id);
        setValue('products', newMap, { shouldValidate: true });
    };

    const handleUpdateQty = (id: number, qty: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            newMap.set(id, { ...item, requestQty: qty || 0, quotedQty: qty || 0 });
            setValue('products', newMap, { shouldValidate: true });
        }
    };

    const handleUpdatePrice = (id: number, price: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            newMap.set(id, { ...item, expectedPrice: price, quotedPrice: price });
            setValue('products', newMap, { shouldValidate: true });
        }
    };

    const handleUpdateQuoteQty = (id: number, qty: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            newMap.set(id, { ...item, quotedQty: qty || 0 });
            setValue('products', newMap, { shouldValidate: true });
        }
    };

    const handleUpdateQuotePrice = (id: number, price: number) => {
        const newMap = new Map(productsMap);
        const item = newMap.get(id);
        if (item) {
            newMap.set(id, { ...item, quotedPrice: price });
            setValue('products', newMap, { shouldValidate: true });
        }
    };
    const columnsTable = useMemo(() => columns(
        page, size, handleUpdateQty, handleUpdatePrice, handleUpdateQuoteQty,
        handleUpdateQuotePrice, handleRemoveProduct
    ), [
        page, size, handleUpdateQty, handleUpdatePrice,
        handleUpdateQuoteQty, handleUpdateQuotePrice, handleRemoveProduct
    ]);

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
                        {displayedProducts.length === 0 ? (
                            <tr>
                                <td colSpan={12} align="center" style={{ padding: '0 10px' }}>
                                    <Typography variant="body2" color="text.secondary">Chưa có sản phẩm nào được chọn.</Typography>
                                </td>
                            </tr>
                        ) : displayedProducts.map((item, index) => (
                            <tr key={item.id}>
                                {columnsTable.map((col) => (
                                    <td key={col.key} align={col.align} style={{ maxWidth: col.width }}>
                                        {col.render
                                            ? col.render(item, index)
                                            : <Typography variant="body2" fontSize={12}>{(item as any)[col.key] ?? '-'}</Typography>}
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
                    totalItems={selectedProducts.length}
                    page={page}
                    size={size}
                    onChange={(page) => setPage(page)}
                />
                <Stack spacing={1} sx={{ minWidth: 250, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" textAlign={"center"}>Tổng cộng:</Typography>
                        <Typography color="error" fontSize={15} fontWeight={700}>
                            ${formatPrice(totalAmount)}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </>

    )
}

export default AddQuotationRequestTable;