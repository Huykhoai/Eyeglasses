import {
    Box, Checkbox, Chip, Grid, Stack, Tooltip, Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import { useBase64 } from "@/utils/base64";
import { DeliveryEnumLabel, type DeliveryEnumType } from "@/utils/DeliveryEnum";
import DeliveryEnum from "@/utils/DeliveryEnum";
import { type OtkItemResponse } from "../config/otkTypes";
import '../components/AddDeliverySchedule.css';
import { columnsOtkInspection } from "../config/columnsOtkInspection";
import Select from "@/components/common/Select/Select";
import Pagination from "@/components/common/Pagination/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";

const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';

const OtkInspection = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const { decode } = useBase64();
    const { id: encodedId } = useParams();
    const otkId = Number(decode(encodedId || ''));

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [selectedItems, setSelectedItems] = useState<Map<number, any>>(new Map());
    const [confirmDialog, setConfirmDialog] = useState(false);


    const { data: otk, isLoading } = useQuery({
        queryKey: ['otk-inspection', 'info', otkId],
        queryFn: async () => {
            const res = await axiosClient.get(`/api/otk/${otkId}`);
            return res.data;
        },
        enabled: !!otkId,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const displayProducts = useMemo(() => {
        if (!otk || !otk.items) return [];
        return otk.items.slice((page - 1) * size, page * size);
    }, [otk, page, size]);

    const { data: itemsDetail } = useQuery<OtkItemResponse[]>({
        queryKey: ['otk-inspection', 'items-detail', otkId],
        queryFn: async () => {
            try {
                const res = await axiosClient.post(`/api/otk/items-detail`, displayProducts);
                return res.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Lỗi khi lấy chi tiết sản phẩm';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: !!otkId && displayProducts.length > 0,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const checkableItems = useMemo(() => {
        return itemsDetail?.filter(item => item.status !== DeliveryEnum.CHECKED) || [];
    }, [itemsDetail]);

    const isAllSelected = useMemo(() => {
        if (checkableItems.length === 0) return false;
        return checkableItems.every((item) => selectedItems.has(item.deliveryItemId));
    }, [checkableItems, selectedItems]);

    const isIndeterminate = useMemo(() => {
        if (checkableItems.length === 0) return false;
        const selectedCount = checkableItems.filter(item => selectedItems.has(item.deliveryItemId)).length;
        return selectedCount > 0 && selectedCount < checkableItems.length;
    }, [checkableItems, selectedItems]);

    const handleToggleSelect = useCallback((id: number, otkQty: number) => {
        setSelectedItems(prev => {
            const next = new Map(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.set(id, {
                    id,
                    acceptedQty: otkQty,
                    deniedQty: 0,
                    extraQty: 0,
                    lostQty: 0,
                    note: '',
                });
            }
            return next;
        });
    }, []);

    const handleToggleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const currentMap = new Map(selectedItems);
        if (e.target.checked) {
            checkableItems.forEach((item) => {
                currentMap.set(item.deliveryItemId, {
                    id: item.deliveryItemId,
                    acceptedQty: item.otkQty,
                    deniedQty: 0,
                    extraQty: 0,
                    lostQty: 0,
                    note: '',
                });
            });
        } else {
            checkableItems.forEach((item) => {
                currentMap.delete(item.deliveryItemId);
            });
        }
        setSelectedItems(currentMap);
    }, [checkableItems, selectedItems]);

    const handleItemChange = useCallback((item: OtkItemResponse, field: string, value: any) => {
        setSelectedItems(prev => {
            const next = new Map(prev);
            const currentRecord = next.get(item.deliveryItemId);
            if (!currentRecord) return prev;

            let updatedRecord = { ...currentRecord };

            if (field === "note") {
                updatedRecord.note = value;
            } else {
                let parsedValue = parseInt(value) || 0;
                if (parsedValue < 0) parsedValue = 0;

                if (field === "extraQty") {
                    updatedRecord.extraQty = parsedValue;
                    if (parsedValue > 0) updatedRecord.lostQty = 0;
                } else if (field === "lostQty") {
                    updatedRecord.lostQty = Math.min(parsedValue, item.otkQty || 0);
                    if (updatedRecord.lostQty > 0) updatedRecord.extraQty = 0;
                } else if (field === "acceptedQty") {
                    updatedRecord.acceptedQty = parsedValue;
                } else if (field === "deniedQty") {
                    updatedRecord.deniedQty = parsedValue;
                }

                const currentReality = (item.otkQty || 0) + (updatedRecord.extraQty || 0) - (updatedRecord.lostQty || 0);

                if (field === "deniedQty") {
                    updatedRecord.deniedQty = Math.min(updatedRecord.deniedQty, currentReality);
                    updatedRecord.acceptedQty = currentReality - updatedRecord.deniedQty;
                } else {
                    updatedRecord.acceptedQty = Math.min(updatedRecord.acceptedQty, currentReality);
                    updatedRecord.deniedQty = currentReality - updatedRecord.acceptedQty;
                }
            }

            next.set(item.deliveryItemId, updatedRecord);
            return next;
        });
    }, []);

    const totals = useMemo(() => {
        const totalScheduledQty = otk?.totalScheduledQty || 0;
        const totalAcceptedQty = otk?.totalAcceptedQty || 0;
        const totalDeniedQty = otk?.totalDeniedQty || 0;
        const totalExtraQty = otk?.totalExtraQty || 0;
        const totalLostQty = otk?.totalLostQty || 0;
        return { totalScheduledQty, totalAcceptedQty, totalDeniedQty, totalExtraQty, totalLostQty };
    }, [otk]);

    const { mutate: saveInspection, isPending } = useMutation({
        mutationFn: async () => {
            const items = Array.from(selectedItems.values());
            return axiosClient.put(`/api/otk/inspection`, {
                otkId,
                items,
            });
        },
        onSuccess: (response) => {
            const msg = response.data?.message || 'Lưu thành công';
            if (response.data?.status === 400) {
                showNotification('error', msg, 'Thất bại');
                return;
            }
            showNotification('success', msg, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['otk-inspection'] });
            queryClient.invalidateQueries({ queryKey: ['otk'] });
            setConfirmDialog(false);
            setSelectedItems(new Map());
        },
        onError: (err: any) => {
            showNotification('error', err?.response?.data?.message || 'Lỗi khi lưu', 'Thất bại');
        }
    });

    const handleOpenConfirmDialog = () => {
        if (!otk) return;
        if (otk?.status === DeliveryEnum.CHECKED) {
            showNotification('error', 'Không thể sửa OTK đã kiểm tra', 'Thất bại');
            return;
        }
        if (otk?.status === DeliveryEnum.APPROVED || otk?.status === DeliveryEnum.REJECTED) {
            showNotification('error', 'Không thể sửa OTK đã duyệt hoặc từ chối', 'Thất bại');
            return;
        }
        if (selectedItems.size === 0) {
            showNotification('error', 'Vui lòng chọn ít nhất 1 sản phẩm', 'Thất bại');
            return;
        }
        setConfirmDialog(true);
    };
    const columns = useMemo(() => columnsOtkInspection(
        selectedItems,
        handleItemChange,
    ), [selectedItems, handleItemChange]);

    return (
        <Box className="add-delivery-page-wapper">
            {isLoading && <Loading fullPage message="Đang tải phiếu OTK..." />}

            <Box className="add-delivery-header">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                    <Box className="d-flex align-items-center gap-3">
                        <Typography variant="h6" fontWeight={700}>
                            Kiểm tra hàng hóa — {otk?.cid}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                size="small"
                                label={DeliveryEnumLabel[otk?.status as DeliveryEnumType] || otk?.status}
                                color={otk?.status === DeliveryEnum.CHECKED ? 'success' :
                                    otk?.status === DeliveryEnum.CHECKING ? 'warning' : 'default'}
                                sx={{ fontWeight: 600, fontSize: 11 }}
                            />
                        </Stack>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="primary"
                        icon={<CheckCircleIcon fontSize="small" />}
                        onClick={handleOpenConfirmDialog}>
                        Hoàn thành kiểm tra
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box className="glass-card" sx={{ height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: primaryColor }} /> Tổng hợp kết quả
                        </Typography>
                        <Grid container spacing={2} sx={{ height: '80%', alignContent: 'center' }}>
                            {[
                                { label: 'SL kiểm tra', value: totals.totalScheduledQty, color: primaryColor },
                                { label: 'Đạt', value: totals.totalAcceptedQty, color: '#22c55e' },
                                { label: 'Không đạt', value: totals.totalDeniedQty, color: '#ef4444' },
                                { label: 'Thừa', value: totals.totalExtraQty, color: '#f59e0b' },
                                { label: 'Thiếu', value: totals.totalLostQty, color: '#3b82f6' },
                            ].map((stat, idx) => (
                                <Grid size={{ xs: 4, sm: 2.4 }} key={idx}>
                                    <Box sx={{
                                        textAlign: 'center', p: 1.5, borderRadius: '12px',
                                        bgcolor: `${stat.color}10`, border: `1px solid ${stat.color}30`
                                    }}>
                                        <Typography variant="caption" fontWeight={600} color="#64748b">{stat.label}</Typography>
                                        <Typography variant="h5" fontWeight={700} color={stat.color}>{stat.value}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box className="glass-card" sx={{ height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon sx={{ color: '#3b82f6' }} /> Hướng dẫn kiểm tra chất lượng
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <WarningIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.3 }} />
                                <Typography variant="body2" fontSize={12.5} color="#475569">
                                    <b>Số lượng thực tế</b> = Số lượng đặt + Số lượng thừa - Số lượng thiếu
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e', mt: 0.3 }} />
                                <Typography variant="body2" fontSize={12.5} color="#475569">
                                    <b>Số lượng đạt</b> = Số lượng thực tế - Số lượng không đạt + Số lượng đạt của số lượng thừa (nếu có)
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Tooltip title="Sản phẩm lỗi sẽ được nhập kho lỗi riêng">
                                    <WarningIcon sx={{ fontSize: 16, color: '#ef4444', mt: 0.3 }} />
                                </Tooltip>
                                <Typography variant="body2" fontSize={12.5} color="#475569">
                                    <b>Số lượng không đạt</b> = Số lượng thực tế - Số lượng đạt + Số lượng không đạt của số lượng thừa (nếu có)
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <Typography variant="caption" fontWeight={600} color="#15803d">
                                    ✅ Số lượng <b>đạt</b> sẽ được nhập <b>kho Tổng</b> sau khi duyệt
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                                <Typography variant="caption" fontWeight={600} color="#dc2626">
                                    ❌ Số lượng <b>lỗi</b> sẽ được nhập <b>kho Lỗi</b> sau khi duyệt
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>

            <Box className="glass-card" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box className="d-flex align-items-center justify-content-between">
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                        Danh sách sản phẩm kiểm tra ({otk?.items?.length || 0} sản phẩm)
                    </Typography>
                    <Box className="d-flex align-items-center gap-3">
                        <Box>
                            <Select
                                options={[
                                    { label: '20', value: 20 },
                                    { label: '50', value: 50 },
                                    { label: '100', value: 100 },
                                ]}
                                value={size}
                                onChangeSize={(value) => {
                                    setSize(Number(value));
                                    setPage(1);
                                }} />
                        </Box>

                        <Pagination
                            totalItems={otk?.items?.length || 0}
                            size={size}
                            page={page}
                            onChange={(page: number) => setPage(Number(page))} />
                    </Box>
                </Box>
                <div className="table-scroll-container" style={{ flex: 1, overflowY: 'auto', minHeight: '300px' }}>
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th style={{ width: '3vw', textAlign: 'center' }}>
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        onChange={handleToggleSelectAll}
                                    />
                                </th>
                                {columns.map((col) => (
                                    <th key={col.key} style={{ minWidth: col.width }}>
                                        <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                                            {col.header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {itemsDetail && itemsDetail.length > 0 ? itemsDetail.map((item: OtkItemResponse, index: number) => {
                                const isDisabled = item.status === DeliveryEnum.CHECKED;
                                return (
                                    <tr key={item.deliveryItemId} {...({ disabled: isDisabled } as any)}>
                                        <td style={{ width: '3vw', textAlign: 'center' }}>
                                            <Checkbox
                                                checked={selectedItems.has(item.deliveryItemId)}
                                                onChange={() => handleToggleSelect(item.deliveryItemId, item.otkQty)}
                                                disabled={item.status === DeliveryEnum.CHECKED}
                                            />
                                        </td>
                                        {columns.map((col) => {
                                            return (
                                                <td key={col.key} style={{ maxWidth: col.width, textAlign: col.align }}>
                                                    {col.render ? (
                                                        col.render(item, index)
                                                    ) : (
                                                        <Typography variant="body2" fontSize={13} align={col.align as any}>
                                                            {(item as any)[col.key] || '-'}
                                                        </Typography>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={columns.length} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                            Không có sản phẩm
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
            <ConfirmDialog
                open={confirmDialog}
                onClose={() => setConfirmDialog(false)}
                title="Xác nhận hoàn thành kiểm tra"
                content="Bạn có chắc chắn muốn hoàn thành kiểm tra?"
                onConfirm={saveInspection}
                loading={isPending}
            />
        </Box>
    );
};

export default OtkInspection;
