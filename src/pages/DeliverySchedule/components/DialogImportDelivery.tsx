import { Modal, Box, Stack, Typography, IconButton, Grid, Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useFormContext } from "react-hook-form";
import type { SimpleDeliveryItem } from "../config/types";
import type { Contract } from "@/pages/Contract/config/types";
import DialogImportDeliveryLeft from "./DialogImportDeliveryLeft";
import DialogImportDeliveryRight from "./DialogImportDeliveryRight";

interface DialogImportProps {
    open: boolean;
    onClose: () => void;
    contractsMap: Map<number, Contract>;
}
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const DialogImportDelivery: React.FC<DialogImportProps> = ({ open, onClose, contractsMap }) => {
    const { getValues, setValue } = useFormContext();
    const [cid, supplier, items] = getValues(["cid", "supplier", "items"]);

    const [localItems, setLocalItems] = useState<Map<number, SimpleDeliveryItem>>(new Map(items));

    const handleAddItems = useCallback((items: Map<number, SimpleDeliveryItem>) => {
        setLocalItems(items);
    }, []);

    const handleRemoveItemsByContract = useCallback((contractId: number) => {
        setLocalItems(prev => {
            const newMap = new Map(prev);
            Array.from(newMap.keys()).forEach(key => {
                if (newMap.get(key)?.contractId === contractId) {
                    newMap.delete(key);
                }
            });
            return newMap;
        });
    }, []);

    const areItemsEqual = (map1: Map<number, SimpleDeliveryItem>, map2: Map<number, SimpleDeliveryItem>) => {
        if (map1.size !== map2.size) return false;
        for (const [key, val] of map1) {
            const testVal = map2.get(key);
            if (!testVal || testVal.scheduledQty !== val.scheduledQty) return false;
        }
        return true;
    };
    const handleConfirm = useCallback(() => {
        if (localItems.size === 0) return;

        const isChanged = !areItemsEqual(localItems, items);

        if (isChanged) {
            setValue('items', localItems, { shouldDirty: true });
        }

        onClose();
    }, [onClose, localItems, items, setValue]);
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
                            <Typography variant="subtitle1" fontWeight={700} color="#fff">Chọn sản phẩm từ hợp đồng</Typography>
                            <Typography variant="caption" color="#fff">LGH: {cid || ''} | Nhà cung cấp: {supplier?.name || ''}</Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </Box>
                <Grid container spacing={1} overflow="hidden" p={2} sx={{ flex: 1, minHeight: 0 }}>
                    <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: '1px solid #e2e8f0', borderRadius: '16px', height: '100%' }}>
                        <DialogImportDeliveryLeft
                            supplierId={supplier?.id || 0}
                            contractsMap={contractsMap}
                            onRemoveItemsByContract={handleRemoveItemsByContract}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }} sx={{ borderLeft: '1px solid #e2e8f0', borderRadius: '16px', height: '100%' }}>
                        <DialogImportDeliveryRight contractsMap={contractsMap} initialItems={localItems} onAddItems={handleAddItems} />
                    </Grid>
                </Grid>
                <Box p={2} borderTop="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center" bgcolor="#fff">
                    <Stack direction="row" spacing={3}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Sản phẩm đã chọn</Typography>
                            <Typography sx={{ fontSize: '0.9rem' }} fontWeight={700} color={primaryColor}>{localItems.size}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Từ số lượng hợp đồng</Typography>
                            <Typography sx={{ fontSize: '0.9rem' }} fontWeight={700} color={primaryColor}>
                                {contractsMap.size}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={onClose} variant="text" sx={{ color: '#64748b', fontWeight: 600 }}>Hủy bỏ</Button>
                        <Button
                            variant="contained" className="btn-premium"
                            sx={{ backgroundColor: primaryColor, px: 4, borderRadius: '10px' }}
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

export default React.memo(DialogImportDelivery);
