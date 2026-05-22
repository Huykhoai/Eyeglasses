import {
    Box, Grid, IconButton, InputAdornment, Modal, Stack, Typography,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { Close as CloseIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Loading from "@/components/ui/Loading/Loading";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import {
    Notes as NotesIcon,
    EventNote as DateIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';
import Button from "@/components/common/Button/Button";
import type { DeliveryItemDetail } from "../config/otkTypes";
import dayjs from "dayjs";
import { RHFTextField } from "@/components/common/TextField/RHFTextField";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { RHFAutoComplete } from "@/components/common/TextField/RHFComponents";
import { useDeliveryScheduleAll, useEmployeeAll } from "@/hooks/UseAllData";
import { columnsOtkDialog } from "@/pages/Otk/config/columnsOtkDialog";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import DeliveryEnum from "@/utils/DeliveryEnum";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { useFetchOtkById } from "@/pages/Otk/hooks/useFetchOtkById";
import { getFilterDeliveryItem } from "@/pages/DeliverySchedule/config/getFilterDeliveryItem";
import { useFetchDeliveryItem } from "@/pages/DeliverySchedule/hooks/useFetchDeliveryItem";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

interface OtkDialogProps {
    open: boolean;
    onClose: () => void;
    otkId: number | null;
}

const OtkDialog: React.FC<OtkDialogProps> = ({ open, onClose, otkId }) => {
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const { data: employee } = useEmployeeAll();

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [filter, setFilter] = useState<Record<string, string>>({})
    const [openConfirm, setOpenConfirm] = useState(false);

    const { data: otkData } = useFetchOtkById(otkId || null, open);
    const { data: deliverySchedules } = useDeliveryScheduleAll();
    const categories = useMemo(() => getFilterDeliveryItem, []);
    const methods = useForm({
        defaultValues: {
            cid: '',
            deliverySchedule: null,
            inspectionDate: dayjs().format('YYYY-MM-DD'),
            status: DeliveryEnum.NOT_CHECKED,
            note: '',
            employeeAss: null,
            items: new Map<number, any>(),
            initialQty: new Map<number, number>(),
        },
        values: (otkId && otkData) ? {
            ...otkData,
            items: otkData.items || new Map<number, any>(),
            initialQty: otkData.initialQty || new Map<number, number>(),
            employeeAss: otkData.employee,
        } : undefined
    })

    const { control, handleSubmit, getValues, setValue } = methods;
    const currentMap: Map<number, any> = useWatch({ control, name: 'items' });
    const status = useWatch({ control, name: 'status' });
    const initialQtyMap: Map<number, number> = useWatch({ control, name: 'initialQty' });
    const deliverySchedule = useWatch({ control, name: 'deliverySchedule' });

    const { data: deliveryItemsData, isLoading } = useFetchDeliveryItem(deliverySchedule?.id || null, page, size, filter, open);

    const handleFilterChange = useCallback((filter: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filter).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        });
        setFilter(mapperFilter);
        setPage(1);
    }, []);

    const handleAddItems = useCallback((items: Map<number, any>) => {
        setValue('items', items, { shouldDirty: true });
    }, []);

    const onSubmit = (data: any) => {
        mutate({
            id: data.id,
            cid: data.cid,
            deliveryScheduleId: data.deliverySchedule?.id,
            inspectionDate: data.inspectionDate,
            status: data.status,
            note: data.note,
            employeeAssId: data.employeeAss?.id,
            items: Array.from(data.items?.values() || [])
        });
    }

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            if (otkId) {
                return axiosClient.put('/api/otk/update', data);
            }
            return axiosClient.post('/api/otk/add', data);
        },
        onSuccess: (res: any) => {
            const message = res.data.message;
            if (res.data.status === 400) {
                showNotification('error', message, 'Thất bại');
                return;
            }
            queryClient.invalidateQueries({ queryKey: ['otk'] });
            queryClient.invalidateQueries({ queryKey: ['otk-inspection'] });
            queryClient.invalidateQueries({ queryKey: ['delivery'] });
            queryClient.invalidateQueries({ queryKey: ['delivery-items-for-otk', deliverySchedule?.id] });
            showNotification('success', message, 'Thành công');
            setOpenConfirm(false);
            onClose();
        },
        onError: (error: any) => {
            const message = error.response.data.message;
            showNotification('error', message, 'Thất bại');
        }
    });

    const validate = (data: any) => {
        if (!data.cid) {
            showNotification('error', 'Vui lòng nhập mã OTK', 'Thất bại');
            return false;
        }

        if (!data.inspectionDate) {
            showNotification('error', 'Vui lòng chọn ngày kiểm định', 'Thất bại');
            return false;
        }

        if (!data.employeeAss?.id) {
            showNotification('error', 'Vui lòng chọn nhân viên kiểm định', 'Thất bại');
            return false;
        }

        if (data.items.size === 0) {
            showNotification('error', 'Vui lòng chọn ít nhất một sản phẩm', 'Thất bại');
            return false;
        }
        return true;
    }

    const deliveryItems = deliveryItemsData?.items || [];
    const totalItems = deliveryItemsData?.totalItems || 0;

    const checkableItems = useMemo(() => {
        return deliveryItems.filter(item => {
            const oldQty = initialQtyMap.get(item.id) || 0;
            let allowedQty = item.allowedQty || 0;
            const isDraft = otkId && status !== DeliveryEnum.APPROVED;
            if (isDraft) {
                allowedQty += oldQty;
            }
            return allowedQty > 0;
        });
    }, [deliveryItems, initialQtyMap, otkId, status]);

    const isAllSelected = useMemo(() => {
        if (checkableItems.length === 0) return false;
        return checkableItems.every((item) => currentMap.has(item.id));
    }, [checkableItems, currentMap]);

    const isIndeterminate = useMemo(() => {
        if (checkableItems.length === 0) return false;
        const selectedCount = checkableItems.filter(item => currentMap.has(item.id)).length;
        return selectedCount > 0 && selectedCount < checkableItems.length;
    }, [checkableItems, currentMap]);

    const handleToggleSelectAll = useCallback((e: any) => {
        const nextMap = new Map(currentMap);
        if (e.target.checked) {
            checkableItems.forEach((item) => {
                if (!nextMap.has(item.id)) {
                    const oldQty = initialQtyMap.get(item.id) || 0;
                    let allowedQty = item.allowedQty || 0;
                    const isDraft = otkId && status !== DeliveryEnum.APPROVED;
                    if (isDraft) {
                        allowedQty += oldQty;
                    }
                    nextMap.set(item.id, {
                        id: otkId ? currentMap.get(item.id)?.id : null,
                        deliveryItemId: item.id,
                        otkQty: allowedQty
                    });
                }
            });
        } else {
            checkableItems.forEach((item) => {
                nextMap.delete(item.id);
            });
        }
        handleAddItems(nextMap);
    }, [checkableItems, currentMap, handleAddItems, initialQtyMap, otkId, status]);

    const columns = columnsOtkDialog(
        otkId,
        currentMap,
        initialQtyMap,
        status,
        handleAddItems,
        isAllSelected,
        isIndeterminate,
        handleToggleSelectAll
    );

    return (
        <FormProvider {...methods}>
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
                                <InventoryIcon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} color="#fff">Tạo phiếu OTK</Typography>
                            </Box>
                        </Stack>
                        <IconButton onClick={onClose}>
                            <CloseIcon sx={{ color: "#fff" }} />
                        </IconButton>
                    </Box>
                    {isLoading && <Loading fullPage message="Đang tải..." />}
                    <Grid container spacing={2} overflow="auto" p={2} sx={{ flex: 1, minHeight: 0, bgcolor: '#f8fafc' }}>
                        <Grid size={{ xs: 12 }}>
                            <Box className="d-flex flex-column gap-3" sx={{ height: '100%' }}>
                                <Box className="glass-card" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InventoryIcon fontSize="small" color="primary" /> Thông tin phiếu kiểm định
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <RHFTextField
                                                name="cid"
                                                label="Mã OTK"
                                                placeholder="Nhập mã OTK..."
                                                rules={{
                                                    required: 'Vui lòng nhập mã OTK'
                                                }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <InventoryIcon fontSize="small" />
                                                    </InputAdornment>
                                                }
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <RHFTextField
                                                name="inspectionDate"
                                                label="Ngày kiểm định"
                                                type="date"
                                                rules={{
                                                    required: 'Vui lòng chọn ngày kiểm định'
                                                }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <DateIcon fontSize="small" />
                                                    </InputAdornment>
                                                }
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <RHFAutoComplete
                                                name="deliverySchedule"
                                                placeholder="Chọn phiếu giao hàng"
                                                options={deliverySchedules || []}
                                                rules={{
                                                    required: 'Vui lòng chọn phiếu giao hàng'
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <RHFAutoComplete
                                                name="employeeAss"
                                                placeholder="Chọn người kiểm định"
                                                options={employee || []}
                                                rules={{
                                                    required: 'Vui lòng chọn người kiểm định'
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <RHFTextField
                                                name="note"
                                                label="Ghi chú"
                                                placeholder="Nhập ghi chú..."
                                                multiline
                                                rows={1.5}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <NotesIcon fontSize="small" />
                                                    </InputAdornment>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box className="glass-card" sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <InventoryIcon fontSize="small" color="primary" /> Danh sách sản phẩm kiểm định
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 5 }}>
                                            <MultiFilterBar categories={categories} onFilterChange={handleFilterChange} />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }} className="d-flex gap-2 justify-content-end">
                                            <Box>
                                                <Select value={size} options={[
                                                    { label: '20', value: 20 },
                                                    { label: '50', value: 50 },
                                                ]} onChangeSize={(v) => { setSize(Number(v)); setPage(1); }} />
                                            </Box>

                                            <Pagination totalItems={totalItems} size={size} page={page} onChange={setPage} />
                                        </Grid>
                                    </Grid>

                                    <div className="table-scroll-container" style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 270px)' }}>
                                        <table className="table-premium">
                                            <thead>
                                                <tr>
                                                    {columns.map((col) => (
                                                        <th key={col.key} style={{ width: col.width }}>
                                                            {typeof col.header === 'string' ? (
                                                                <Typography variant="subtitle2" fontSize={11} fontWeight={700} align="center">
                                                                    {col.header}
                                                                </Typography>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                                    {col.header}
                                                                </Box>
                                                            )}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deliveryItems.length > 0 ? deliveryItems.map((item: DeliveryItemDetail, index: number) => {
                                                    const oldQty = initialQtyMap.get(item.id) || 0;
                                                    let allowedQty = item.allowedQty || 0;
                                                    const isDraft = otkId && status !== DeliveryEnum.APPROVED;
                                                    if (isDraft) {
                                                        allowedQty += oldQty;
                                                    }
                                                    const isDisabled = allowedQty <= 0;
                                                    return (
                                                        <tr key={item.id || index} {...({ disabled: isDisabled } as any)}>
                                                            {columns.map((col) => (
                                                                <td key={col.key} style={{ textAlign: col.align as any }}>
                                                                    {col.render ? (
                                                                        col.render(item)
                                                                    ) : (
                                                                        <Typography variant="body2" fontSize={12}>
                                                                            {(item as any)[col.key] || '-'}
                                                                        </Typography>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                }) : (
                                                    <tr>
                                                        <td colSpan={columns.length} align="center">
                                                            <Typography variant="body2" color="text.secondary">
                                                                Vui lòng chọn phiếu giao hàng
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box p={2} borderTop="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center" bgcolor="#fff">
                        <Stack direction="row" spacing={3}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Sản phẩm đã chọn</Typography>
                                <Typography sx={{ fontSize: '0.9rem' }} fontWeight={700} color={primaryColor}>{currentMap.size}</Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Button onClick={onClose} variant="outline">Hủy bỏ</Button>
                            <Button variant="primary" onClick={async () => {
                                const data = getValues();
                                if (validate(data)) {
                                    setOpenConfirm(true);
                                }
                            }}>Xác nhận</Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleSubmit(onSubmit)}
                title={`Xác nhận ${otkId ? 'cập nhật' : 'tạo'} phiếu OTK`}
                content={`Bạn có chắc chắn muốn ${otkId ? 'cập nhật' : 'tạo'} phiếu OTK?`}
                loading={isPending}
            />
        </FormProvider>
    );
};

export default React.memo(OtkDialog);
