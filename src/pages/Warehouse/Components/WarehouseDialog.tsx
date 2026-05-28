import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Grid,
    Typography,
    Divider,
    TextField
} from "@mui/material";
import { Warehouse as WarehouseIcon } from "@mui/icons-material";
import Select from "@/components/common/Select/Select";
import Button from "@/components/common/Button/Button";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { WarehouseEnum, WarehouseEnumLabel } from "@/utils/WarehouseEnum";

interface WarehouseDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any | null;
}

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const WarehouseDialog: React.FC<WarehouseDialogProps> = ({ open, onClose, onSuccess, initialData }) => {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: undefined,
        cid: "",
        name: "",
        address: "",
        type: WarehouseEnum.TYPE_ACCEPTABLE
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    id: initialData.id,
                    cid: initialData.cid || "",
                    name: initialData.name || "",
                    address: initialData.address || "",
                    type: initialData.type || WarehouseEnum.TYPE_ACCEPTABLE
                });
            } else {
                setFormData({
                    id: undefined,
                    cid: "",
                    name: "",
                    address: "",
                    type: WarehouseEnum.TYPE_ACCEPTABLE
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.cid.trim()) {
            showNotification('warning', 'Vui lòng nhập đầy đủ mã kho và tên kho!', 'Lỗi nhập liệu');
            return;
        }

        try {
            setLoading(true);
            const url = formData.id ? '/api/warehouse/update' : '/api/warehouse/save';
            const method = formData.id ? 'put' : 'post';

            const res = await axiosClient[method](url, formData);
            if (res.data.status === 200) {
                showNotification('success', res.data.message || 'Thao tác thành công!', 'Thành công');
                onSuccess();
                onClose();
            } else {
                showNotification('error', res.data.message || 'Thao tác thất bại!', 'Lỗi');
            }
        } catch (error: any) {
            showNotification('error', error?.response?.data?.message || 'Có lỗi xảy ra', 'Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{
                p: 3,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                background: `linear-gradient(135deg, ${primaryColor}10, transparent)`
            }}>
                <Box sx={{
                    width: 40, height: 40, borderRadius: '10px',
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 12px ${primaryColor}40`
                }}>
                    <WarehouseIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {initialData ? "Chỉnh sửa kho" : "Thêm kho mới"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Vui lòng nhập thông tin chi tiết của kho lưu trữ
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Mã kho <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField
                            value={formData.cid}
                            onChange={(e) => handleChange("cid", e.target.value)}
                            placeholder="VD: KHO_CHINH"
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Loại kho</Typography>
                        <Select
                            value={formData.type}
                            disabled={!!initialData}
                            options={[
                                { value: WarehouseEnum.TYPE_ACCEPTABLE, label: WarehouseEnumLabel[WarehouseEnum.TYPE_ACCEPTABLE] },
                                { value: WarehouseEnum.TYPE_DEFECTIVE, label: WarehouseEnumLabel[WarehouseEnum.TYPE_DEFECTIVE] }
                            ]}
                            onChangeSize={(v) => handleChange("type", v)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Tên kho <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Nhập tên gọi của kho..."
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Địa chỉ</Typography>
                        <TextField
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Nhập địa chỉ của kho..."
                            fullWidth
                            size="small"
                            multiline
                            rows={3}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, pt: 2, background: '#f8fafc' }}>
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    Trở lại
                </Button>
                <Button variant="primary" onClick={handleSubmit} isLoading={loading}>
                    {initialData ? "Lưu thay đổi" : "Thêm hoàn tất"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WarehouseDialog;
