import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
} from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import Button from '@/components/common/Button/Button';
import Select from '@/components/common/Select/Select';
import { useWarehouseAll } from '@/hooks/UseAllData';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import type { WarehouseResponse } from '@/pages/Warehouse/WarehousePage';
import { WarehouseEnum } from '@/utils/WarehouseEnum';

interface ConfirmImportDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (mainWarehouseId: number, defectWarehouseId: number) => void;
    loading?: boolean;
    receiptCid: string;
}

const ConfirmImportDialog: React.FC<ConfirmImportDialogProps> = ({
    open,
    onClose,
    onConfirm,
    loading,
    receiptCid
}) => {
    const [mainId, setMainId] = React.useState<number>(1);
    const [defectId, setDefectId] = React.useState<number>(2);

    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const { data: warehouses } = useWarehouseAll();

    const warehouseAcceptableOptions = React.useMemo(() => {
        if (!warehouses) return [];
        return warehouses
            .filter((wh: WarehouseResponse) => wh.type === WarehouseEnum.TYPE_ACCEPTABLE)
            .map((wh: WarehouseResponse) => ({
                value: wh.id,
                label: `${wh.name} (${wh.cid})`
            }));
    }, [warehouses]);

    const warehouseDefectiveOptions = React.useMemo(() => {
        if (!warehouses) return [];
        return warehouses
            .filter((wh: WarehouseResponse) => wh.type === WarehouseEnum.TYPE_DEFECTIVE)
            .map((wh: WarehouseResponse) => ({
                value: wh.id,
                label: `${wh.name} (${wh.cid})`
            }));
    }, [warehouses]);

    useEffect(() => {
        if (open) {
            setMainId(warehouseAcceptableOptions[0]?.value);
            setDefectId(warehouseDefectiveOptions[0]?.value);
        }
    }, [open]);

    const handleConfirm = () => {
        onConfirm(mainId, defectId);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px',} }}>
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #f1f5f9' }}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon color="primary" /> Nhập kho - Phiếu {receiptCid}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ minHeight: '50vh' }}>
                <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
                    Vui lòng chọn đích đến cho các sản phẩm trong phiếu nhập kho. Sản phẩm đạt và sản phẩm lỗi sẽ được lưu trữ tự động vào kho tương ứng.
                </Typography>

                <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Kho nhận Hàng Đạt <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            value={mainId}
                            options={warehouseAcceptableOptions}
                            onChangeSize={(val) => setMainId(Number(val))}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Kho nhận Hàng Lỗi/Hỏng <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            value={defectId}
                            options={warehouseDefectiveOptions}
                            onChangeSize={(val) => setDefectId(Number(val))}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    Hủy bỏ
                </Button>
                <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={loading || !mainId || !defectId}>
                    {loading ? 'Đang xử lý...' : 'Xác nhận nhập kho'}
                </Button>
            </DialogActions>
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title="Xác nhận nhập kho"
                content={`Bạn xác nhận rằng các sản phẩm trong phiếu "${receiptCid}" đã được kiểm tra và sẵn sàng nhập kho? Thao tác này không thể hoàn tác.`}
                loading={loading}
            />
        </Dialog>
    );
};

export default ConfirmImportDialog;
