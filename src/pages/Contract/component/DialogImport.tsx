import { Modal, Box, Stack, Typography, IconButton, Grid, Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useFormContext } from "react-hook-form";
import DialogImportLeft from "./DialogImportLeft";
import DialogImportRight from "./DialogImportRight";
import type { Quotation, SimpleContractItem } from "../config/types";
interface DialogImportProps {
    open: boolean;
    onClose: () => void;
    quotationsMap: Map<number, Quotation>;
}
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR;

const DialogImport: React.FC<DialogImportProps> = ({ open, onClose, quotationsMap }) => {
    const { getValues, setValue } = useFormContext();
    const [cid, supplier, items] = getValues(["cid", "supplier", "items"]);

    const [localItems, setLocalItems] = useState<Map<number, SimpleContractItem>>(new Map(items));

    const handleAddItems = useCallback((items: Map<number, SimpleContractItem>) => {
        setLocalItems(items);
    }, []);

    const handleRemoveItemsByQuotation = useCallback((quotationId: number) => {
        setLocalItems(prev => {
            const newMap = new Map(prev);
            Array.from(newMap.keys()).forEach(key => {
                if (newMap.get(key)?.quotationId === quotationId) {
                    newMap.delete(key);
                }
            });
            return newMap;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (localItems.size === 0) return;
        setValue('items', localItems, { shouldDirty: true });
        onClose();
    }, [onClose, localItems, setValue]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '95%', maxWidth: '100vw', height: '90vh',
                bgcolor: 'background.paper', borderRadius: '20px', boxShadow: 24,
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center" bgcolor={primaryColor} borderBottom="1px solid #e2e8f0">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ bgcolor: primaryColor, p: 1, borderRadius: '10px', color: '#fff' }}>
                            <ShoppingCartIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="#fff">Chọn sản phẩm cho hợp đồng</Typography>
                            <Typography variant="caption" color="#fff">Hợp đồng: {cid || ''} | Nhà cung cấp: {supplier?.name || ''}</Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </Box>
                <Grid container spacing={1} overflow="hidden" p={1} sx={{ flex: 1, minHeight: 0 }}>
                    <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: '1px solid #e2e8f0', borderRadius: '16px', height: '100%' }}>
                        <DialogImportLeft
                            supplierId={supplier?.id || null}
                            quotationsMap={quotationsMap}
                            onRemoveItemsByQuotation={handleRemoveItemsByQuotation}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }} sx={{ borderLeft: '1px solid #e2e8f0', borderRadius: '16px', height: '100%' }}>
                        <DialogImportRight quotationsMap={quotationsMap} initialItems={localItems} onAddItems={handleAddItems} />
                    </Grid>
                </Grid>
                <Box p={2} borderTop="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center" bgcolor="#fff">
                    <Stack direction="row" spacing={3}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Sản phẩm đã chọn</Typography>
                            <Typography sx={{ fontSize: '0.9rem' }} fontWeight={700} color={primaryColor}>{localItems.size}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Từ số lượng đơn hàng</Typography>
                            <Typography sx={{ fontSize: '0.9rem' }} fontWeight={700} color={primaryColor}>
                                {quotationsMap.size}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={onClose} variant="text" sx={{ color: '#64748b', fontWeight: 600 }}>Hủy bỏ</Button>
                        <Button
                            variant="contained" className="btn-premium"
                            sx={{ backgroundColor: primaryColor, px: 4, borderRadius: '10px' }}
                            disabled={localItems.size === 0}
                            onClick={handleConfirm}
                        >
                            Xác nhận
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default React.memo(DialogImport);