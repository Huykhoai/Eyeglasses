import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFetchQuotationBySupplier } from "../hooks/useFetchQuotationBySupplier";
import type { Quotation } from "../config/types";
import { Box, Checkbox, Divider, FormControlLabel, IconButton, Paper, Stack, styled, Typography } from "@mui/material";
import TextField from "@/components/common/TextField/TextField";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import Loading from "@/components/ui/Loading/Loading";
import Pagination from "@/components/common/Pagination/Pagination";
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR;
const QuotationItem = styled(Paper)<{ selected: boolean }>(({ theme, selected }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    cursor: 'pointer',
    borderRadius: '12px',
    border: `1px solid ${selected ? primaryColor : '#f1f5f9'}`,
    backgroundColor: selected ? 'rgba(113, 75, 104, 0.05)' : '#fff',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
        border: `1px solid ${primaryColor}`,
        transform: 'translateY(-2px)'
    }
}));

interface DialogImportLeftProps {
    supplierId: number;
    quotationsMap: Map<number, Quotation>;
    onRemoveItemsByQuotation?: (quotationId: number) => void;
}

const DialogImportLeft: React.FC<DialogImportLeftProps> = ({ supplierId, quotationsMap, onRemoveItemsByQuotation }) => {
    const { setValue } = useFormContext();

    const [page, setPage] = useState(1);
    const size = 20;
    const [type, setType] = useState<boolean>(false);
    const [search, setSearch] = useState('');

    const { data: quotations, isLoading: isLoadingQuotations } = useFetchQuotationBySupplier(
        supplierId, page, size, type, search
    );

    const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setType(e.target.checked);
        setPage(1);
    }, []);

    const handleSelectQuotation = useCallback((quotation: Quotation) => {
        const newMap = new Map(quotationsMap);
        const isSelected = newMap.has(quotation.id);
        if (isSelected) {
            newMap.delete(quotation.id);
            if (onRemoveItemsByQuotation) {
                onRemoveItemsByQuotation(quotation.id);
            }
        } else {
            newMap.set(quotation.id, quotation);
        }
        setValue('quotations', newMap, { shouldDirty: true });
    }, [setValue, quotationsMap, onRemoveItemsByQuotation]);

    return (
        <Box className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isLoadingQuotations && <Loading fullPage message="Đang tải dữ liệu..." />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    name="search"
                    placeholder="Tìm mã đơn hàng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton sx={{
                    bgcolor: primaryColor, color: '#fff',
                    '&:hover': { bgcolor: '#fff', color: primaryColor }
                }} >
                    <SearchIcon />
                </IconButton>
            </Box>
            <FormControlLabel
                control={
                    <Checkbox
                        size="small"
                        checked={type}
                        onChange={handleTypeChange}
                        sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }}
                    />
                }
                label={<Typography variant="body2" color="text.secondary" title="Lọc các đơn hàng chưa về hết">Đơn hàng chưa về hết</Typography>}
                sx={{ ml: 0 }}
            />
            <Divider sx={{ my: 1 }} />
            <Box sx={{ flex: 1, overflowY: 'auto', paddingTop: 0.25 }}>
                {quotations?.items?.map((quotation) => {
                    const isSelected = quotationsMap.has(quotation.id);
                    return (
                        <QuotationItem
                            key={quotation.id}
                            selected={isSelected}
                            onClick={() => handleSelectQuotation(quotation)}
                        >
                            <Stack direction="row" spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
                                <Checkbox
                                    size="small"
                                    checked={isSelected}
                                    sx={{ p: 0.5, color: primaryColor, '&.Mui-checked': { color: primaryColor } }}
                                />
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Box className="d-flex justify-content-between" sx={{ width: '100%' }}>
                                        <Typography variant="subtitle2" fontWeight={600} color="#64748b">{quotation.cid}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>{new Date(quotation.createdAt).toLocaleDateString('vi-VN')}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mt={1}>{quotation.name}</Typography>
                                </Box>
                                <ArrowForwardIosIcon sx={{ fontSize: 14, color: isSelected ? primaryColor : '#cbd5e1', flexShrink: 0 }} />
                            </Stack>
                        </QuotationItem>
                    )
                })}
            </Box>
            {(quotations?.totalItems ?? 0) > size && (
                <Box className="d-flex justify-content-center">
                    <Pagination
                        totalItems={quotations?.totalItems || 0}
                        page={page}
                        size={size}
                        onChange={(page: number) => setPage(page)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default React.memo(DialogImportLeft);