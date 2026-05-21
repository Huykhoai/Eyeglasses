import Button from "@/components/common/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import './AddDeliverySchedule.css';
import {
    Save as SaveIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    ListAlt as ListAltIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import { FormProvider, useForm } from "react-hook-form";
import { Box, Divider, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { useBase64 } from "@/utils/base64";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import AddDeliveryInfo from "./AddDeliveryInfo";
import AddDeliveryTable from "./AddDeliveryTable";
import OtkTab from "./OtkTab";
import type { DeliverySchedule, SimpleDeliveryItem } from "../config/types";
import axiosClient from "@/api/axiosClient";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { useFetchDeliveryById } from "../hooks/useFetchDeliveryById";
import Loading from "@/components/ui/Loading/Loading";
import type { Contract } from "@/pages/Contract/config/types";
import DeliveryEnum, { type DeliveryEnumType } from "@/utils/DeliveryEnum";

interface FormDelivery extends DeliverySchedule {
    step: number;
}

const THEME_COLORS = {
    primary: "#6366f1",
    completed: "rgba(216, 202, 202, 0.2)",
    inactive: "#e7e9ed",
    danger: "#ef4444"
};

const AddDeliverySchedule = () => {
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { decode } = useBase64();

    const { id: encodedId } = useParams();
    const decodedId = decode(encodedId || '');
    const { data: delivery } = useFetchDeliveryById(Number(decodedId));
    const [openConfirm, setOpenConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const statusAccess = useMemo(() => !decodedId || (delivery &&
        ([DeliveryEnum.DRAFT, DeliveryEnum.PENDING] as DeliveryEnumType[]).includes(delivery?.status))
        , [delivery, decodedId]);

    const generateCID = useCallback(() => {
        return `LGH-${dayjs().format('YYMMDD')}-${Math.floor(100 + Math.random() * 900)}`;
    }, []);

    const methods = useForm<FormDelivery>({
        defaultValues: {
            cid: generateCID(),
            name: '',
            note: '',
            status: DeliveryEnum.DRAFT,
            declarationDate: '',
            deliveryDate: '',
            feeEnvironment: 0,
            feeInsurance: 0,
            billOfLadingNumber: '',
            declarationNumber: '',
            totalAmountForeign: 0,
            totalAmountVnd: 0,
            supplier: null,
            step: 0,
            items: new Map<number, SimpleDeliveryItem>(),
            contracts: new Map<number, Contract>(),
            initialQtyMap: new Map<number, number>(),
        },
        values: (decodedId && delivery) ? {
            ...delivery,
            step: delivery.status === DeliveryEnum.PENDING
                ? 1
                : delivery.status === DeliveryEnum.INSPECTING
                    ? 2
                    : delivery.status === DeliveryEnum.COMPLETED || delivery.status === DeliveryEnum.CANCELLED
                        ? 3
                        : 0,
        } : undefined
    });

    const { handleSubmit, getValues, formState: { isDirty } } = methods;

    const steps = ["Tạo mới", "Chờ hàng về", "Đang kiểm kê", getValues('status') === DeliveryEnum.CANCELLED ? "Đã hủy" : "Hoàn thành"];

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            if (data.id) {
                return axiosClient.put('/api/delivery/update', data);
            }
            return axiosClient.post('/api/delivery/add', data);
        },
        onSuccess: (response) => {
            const message = response.data.message;
            if (response.data.status === 400) {
                showNotification('error', message, 'Thất bại');
                return;
            }
            showNotification('success', message, 'Thành công');

            setOpenConfirm(false);
            queryClient.invalidateQueries({ queryKey: ['delivery'] });
            navigate('/xnk/delivery-schedule');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Lỗi khi lưu lịch giao hàng';
            showNotification('error', message, 'Thất bại');
        }
    })

    const onSubmit = (data: FormDelivery, status: DeliveryEnumType) => {
        if (!statusAccess) {
            showNotification('error', 'Không thể chỉnh sửa lịch giao hàng khi đã tạo OTK', 'Thất bại');
            return;
        }

        if (data.id && delivery) {
            if (!isDirty && status === delivery.status) {
                showNotification('info', 'Không có dữ liệu nào thay đổi', 'Thông báo');
                setOpenConfirm(false);
                return;
            }
        }

        const mapper: any = {
            id: data.id,
            cid: data.cid,
            name: data.name,
            note: data.note,
            status: status,
            billOfLadingNumber: data.billOfLadingNumber,
            declarationNumber: data.declarationNumber,
            declarationDate: data.declarationDate,
            deliveryDate: data.deliveryDate,
            feeEnvironment: data.feeEnvironment || 0,
            feeInsurance: data.feeInsurance || 0,
            supplierId: data.supplier?.id,
            items: Array.from(data.items.values()).map((item: any) => ({
                id: item.id,
                contractId: item.contractId,
                contractItemId: item.contractItemId,
                scheduledQty: item.scheduledQty,
            }))
        }
        mutate(mapper);
    };

    const validate = (data: DeliverySchedule) => {
        let message = 'Vui lòng nhập đầy đủ thông tin: ';
        if (!data.cid) {
            message += 'Mã LGH, ';
        }
        if (!data.name) {
            message += 'Tên LGH, ';
        }
        if (!data.supplier) {
            message += 'Nhà cung cấp, ';
        }
        if (!data.declarationNumber) {
            message += 'Số tờ khai, ';
        }
        if (!data.billOfLadingNumber) {
            message += 'Mã vận đơn, ';
        }
        if (!data.declarationDate) {
            message += 'Ngày tờ khai, ';
        }
        if (!data.deliveryDate) {
            message += 'Ngày giao hàng, ';
        }
        if (!data.feeEnvironment && data.feeEnvironment !== 0) {
            message += 'Phí môi trường, ';
        }
        if (!data.feeInsurance && data.feeInsurance !== 0) {
            message += 'Phí bảo hiểm, ';
        }
        if (!data.items || data.items.size === 0) {
            message += 'Danh sách sản phẩm, ';
        }

        if (message !== 'Vui lòng nhập đầy đủ thông tin: ') {
            showNotification('error', message, 'Lỗi dữ liệu');
            return false;
        }
        return true;
    }

    return (
        <FormProvider {...methods}>
            <Box className="add-delivery-page-wapper" sx={{ overflow: 'hidden' }}>
                {isPending && <Loading fullPage message="Đang xử lý" />}
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Box className="add-delivery-header">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Button variant="outline" onClick={() => navigate(-1)} style={{ padding: '4px 12px', height: '32px' }}>Quay lại</Button>
                                <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', opacity: 0.5 }} />
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="primary"
                                    disabled={!statusAccess}
                                    icon={<SaveIcon fontSize="small" />}
                                    onClick={handleSubmit((data) => {
                                        if (validate(data)) {
                                            setOpenConfirm(true);
                                        }
                                    })}
                                    style={{ height: '40px', padding: '0 24px' }}
                                >
                                    Lưu LGH
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 7 }}>
                        <Box className="glass-card" sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2, flexWrap: "wrap" }}>
                            {steps.map((step, index) => {
                                const stepCurrency = getValues('step');
                                const isActive = stepCurrency === index;
                                const isCompleted = stepCurrency > index;
                                const isLast = index === steps.length - 1;
                                return (
                                    <Fragment key={`step-${index}`}>
                                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <Box
                                                className={`step-indicator ${isActive ? 'step-active' : ''}`}
                                                sx={{
                                                    width: '2vw',
                                                    height: '2vw',
                                                    borderRadius: '50%',
                                                    backgroundColor: isActive
                                                        ? getValues('status') === DeliveryEnum.CANCELLED
                                                            ? THEME_COLORS.danger : THEME_COLORS.primary
                                                        : isCompleted ? THEME_COLORS.completed : THEME_COLORS.inactive,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: isActive ? "#ffffff" : "#374151",
                                                    fontWeight: 700,
                                                }}>
                                                {isCompleted ? <CheckCircleOutlineIcon fontSize="small" /> : index + 1}
                                            </Box>
                                            <Typography variant="caption" sx={{
                                                mt: 1,
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive
                                                    ? (getValues('status') === DeliveryEnum.CANCELLED && index === 2
                                                        ? THEME_COLORS.danger
                                                        : THEME_COLORS.primary)
                                                    : "#64748b"
                                            }}>
                                                {step}
                                            </Typography>
                                        </Box>
                                        {!isLast && (
                                            <Box sx={{ flex: 1, height: 4, background: isCompleted ? THEME_COLORS.primary : THEME_COLORS.inactive, borderRadius: 2 }} />
                                        )}
                                    </Fragment>
                                )
                            })}
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ flexWrap: { sm: 'nowrap', xs: 'wrap' }, mt: 1 }} alignItems="flex-start">
                    <Grid size={{ xs: 12 }} sx={{ transition: 'all 0.3s ease' }}>
                        <Box className="d-flex flex-column gap-3">
                            <Box className="glass-card">
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                                    <ListAltIcon /> Thông tin lịch giao hàng
                                </Typography>
                                <Divider sx={{ flex: 1, my: 1 }} />
                                <AddDeliveryInfo generateCID={generateCID} />
                            </Box>
                            <Box className="glass-card">
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
                                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
                                        sx={{
                                            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.9rem' },
                                            '& .Mui-selected': { color: `${THEME_COLORS.primary} !important` },
                                            '& .MuiTabs-indicator': { backgroundColor: THEME_COLORS.primary }
                                        }}>
                                        <Tab icon={<ListAltIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Danh sách sản phẩm" />
                                        <Tab icon={<AssignmentTurnedInIcon sx={{ fontSize: 18 }} />} iconPosition="start"
                                            label={`Phiếu OTK`}
                                            disabled={!decodedId} />
                                    </Tabs>
                                </Box>
                                {activeTab === 0 && <AddDeliveryTable />}
                                {activeTab === 1 && decodedId && (
                                    <OtkTab deliveryScheduleId={Number(decodedId)} />
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleSubmit((data) => {
                    onSubmit(data, DeliveryEnum.PENDING);
                })}
                title="Xác nhận"
                content={`Bạn có chắc chắn muốn ${decodedId ? 'cập nhật' : 'tạo'} lịch giao hàng?`}
                loading={isPending}
            />
        </FormProvider>
    );
};

export default AddDeliverySchedule;