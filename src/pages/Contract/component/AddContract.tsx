import Button from "@/components/common/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import './AddContract.css';
import {
    Save as SaveIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    ListAlt as ListAltIcon,
} from '@mui/icons-material';
import { FormProvider, useForm } from "react-hook-form";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { useBase64 } from "@/utils/base64";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import type { PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";
import PurchaseQuotationStatus from "@/utils/PurchaseQuotationEnum";
import AttachmentDisplay from "./AttachmentDisplay";
import AddContractInfo from "./AddContractInfo";
import AddContractTable from "./AddContractTable";
import type { Contract, Quotation, SimpleContractItem } from "../config/types";
import axiosClient from "@/api/axiosClient";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { useFetchContractById } from "../hooks/useFetchContractById";
import Loading from "@/components/ui/Loading/Loading";
import ContractHistory from "./ContractHistory";
import ExcelMenu from "@/components/ui/MenuExcel/ExcelMenu";
import { readContractExcel } from "./contractExcelImportHelper";
import { exportContractToExcel } from "./contractExcelHelper";
import { useSupplier, useCurrency } from "@/hooks/UseAllData";

interface FormContract extends Contract {
    step: number;
    isSideBar: boolean;
}

const THEME_COLORS = {
    primary: "#6366f1",
    completed: "rgba(216, 202, 202, 0.2)",
    inactive: "#e7e9ed",
    danger: "#ef4444"
};
const AddContract = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { decode } = useBase64();
    const queryClient = useQueryClient();

    const { id: encodedId } = useParams();
    const decodedId = decode(encodedId || '');
    const { data: contract } = useFetchContractById(Number(decodedId));
    const [openConfirm, setOpenConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const { data: suppliers } = useSupplier();
    const { data: currencies } = useCurrency();

    const statusAccess = useMemo(() => !decodedId || (contract &&
        [PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING, PurchaseQuotationStatus.REJECTED].includes(contract?.status))
        , [decodedId, contract]);

    const generateCID = useCallback(() => {
        return `CT-${dayjs().format('YYYYMMDD')}-${Math.floor(1000 + Math.random() * 9000)}`;
    }, []);

    const methods = useForm<FormContract>({
        defaultValues: {
            cid: generateCID(),
            name: '',
            note: '',
            status: PurchaseQuotationStatus.DRAFT,
            contractCurrencyValue: 0,
            signDate: '',
            expectedDeliveryDate: '',
            totalAmountForeign: 0,
            totalAmountVnd: 0,
            supplier: null,
            currency: null,
            step: 0,
            isSideBar: true,
            items: {} as Record<number, SimpleContractItem>,
            quotations: {} as Record<number, Quotation>,
            initialQtyMap: {} as Record<number, number>,
        },
        values: (decodedId && contract) ? {
            ...contract,
            isSideBar: true,
            step: contract.status === PurchaseQuotationStatus.PENDING
                ? 1
                : ([PurchaseQuotationStatus.APPROVED, PurchaseQuotationStatus.CANCELLED, PurchaseQuotationStatus.REJECTED] as PurchaseQuotationEnum[])
                    .includes(contract.status)
                    ? 2
                    : 0,
        } : undefined
    });

    const { handleSubmit, watch, getValues, formState: { isDirty } } = methods;

    const steps = ["Tạo mới", "Chờ xét duyệt", getValues('status') === PurchaseQuotationStatus.CANCELLED
        ? "Đã hủy"
        : getValues('status') === PurchaseQuotationStatus.REJECTED
            ? "Đã từ chối"
            : "Đã duyệt"];
    const isSideBar = watch('isSideBar');

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            if (data.id) {
                return axiosClient.put('/api/contract/update', data);
            }
            return axiosClient.post('/api/contract/add', data);
        },
        onSuccess: (response) => {
            const message = response.data.message;
            if (response.data.status === 400) {
                showNotification('error', message, 'Thất bại');
                return;
            }
            showNotification('success', message, 'Thành công');
            setOpenConfirm(false);
            queryClient.invalidateQueries({ queryKey: ['contract'] });
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            navigate('/xnk/contracts');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Lỗi khi lưu hợp đồng';
            showNotification('error', message, 'Thất bại');
        }
    });

    const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const result = await readContractExcel(
                file,
                currencies || [],
                suppliers || [],
                decodedId ? Number(decodedId) : undefined
            );

            if (!result.success) {
                result.errors?.forEach((e: string) => showNotification('error', e, 'Lỗi'));
                return;
            }

            if (result.supplier) methods.setValue('supplier', result.supplier as any, { shouldDirty: true });
            if (result.currency) {
                methods.setValue('currency', result.currency as any, { shouldDirty: true });
                methods.setValue('contractCurrencyValue', Number(result.currency.value) || 0, { shouldDirty: true });
            }
            if (result.contractName) methods.setValue('name', result.contractName, { shouldDirty: true });
            if (result.note) methods.setValue('note', result.note, { shouldDirty: true });

            if (result.quotations && result.quotations.length > 0) {
                const newQuotations = { ...getValues('quotations') };
                result.quotations.forEach((q: any) => {
                    newQuotations[q.id] = q;
                });
                methods.setValue('quotations', newQuotations, { shouldDirty: true });
            }

            if (result.items && Object.keys(result.items).length > 0) {
                const currentItems = { ...getValues('items') };
                result.items.forEach((item: any) => {
                    currentItems[item.quotationItemId] = {
                        ...currentItems[item.quotationItemId],
                        ...item
                    };
                });
                methods.setValue('items', currentItems, { shouldDirty: true, shouldValidate: true });
            }

            showNotification('success', 'Import dữ liệu từ file Excel hợp đồng thành công', 'Thành công');
            if (result.warnings && result.warnings.length > 0) {
                result.warnings.forEach((w: string) => showNotification('warning', w, 'Cảnh báo'));
            }

        } catch (error) {
            showNotification('error', 'Lỗi khi import file', 'Thất bại');
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleExportExcel = async () => {
        const data = methods.getValues();
        const simpleItems = Object.values(data.items);
        let detailedItems: any[] = [];

        if (simpleItems.length > 0) {
            try {
                setIsExporting(true);
                const res = await axiosClient.post('/api/contract/items-detail', simpleItems);
                detailedItems = res.data;
            } catch (error) {
                showNotification('error', 'Lỗi khi tải chi tiết sản phẩm', 'Lỗi');
                return;
            } finally {
                setIsExporting(false);
            }
        }

        await exportContractToExcel(data, data.quotations, detailedItems);
    };

    const onSubmit = (data: FormContract, status: PurchaseQuotationEnum) => {
        if (!statusAccess) {
            showNotification('error', 'Không thể chỉnh sửa hợp đồng đã được duyệt', 'Thất bại');
            return;
        }

        const mapper: any = {
            id: data.id,
            cid: data.cid,
            name: data.name,
            note: data.note,
            status: status,
            contractCurrencyValue: data.contractCurrencyValue,
            signDate: data.signDate,
            expectedDeliveryDate: data.expectedDeliveryDate,
            supplierId: data.supplier?.id,
            currencyId: data.currency?.id,
            items: Object.values(data.items).map((item: any) => ({
                id: item.id,
                quotationId: item.quotationId,
                quotationItemId: item.quotationItemId,
                contractQty: item.contractQty,
            }))
        }
        mutate(mapper);
    };

    const validate = (data: Contract) => {
        let message = 'Vui lòng nhập đầy đủ thông tin: ';
        if (!data.cid) {
            message += 'Mã hợp đồng, ';
        }
        if (!data.name) {
            message += 'Tên hợp đồng, ';
        }
        if (!data.supplier) {
            message += 'Nhà cung cấp, ';
        }
        if (!data.currency) {
            message += 'Loại tiền, ';
        }
        if (!data.contractCurrencyValue) {
            message += 'Tỷ giá, ';
        }
        if (!data.signDate) {
            message += 'Ngày ký, ';
        }
        if (!data.expectedDeliveryDate) {
            message += 'Ngày dự kiến giao hàng, ';
        }
        if (!data.items || Object.keys(data.items).length === 0) {
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
            <Box className="add-contract-page-wapper" sx={{ overflow: 'hidden' }}>
                {(isPending || isExporting || isImporting) && <Loading fullPage message="Đang xử lý" />}
                <input type="file" ref={fileInputRef} hidden onChange={handleImportExcel} accept=".xlsx,.xls" />
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box className="add-contract-header">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Button variant="outline" onClick={() => navigate(-1)} style={{ padding: '4px 12px', height: '32px' }}>Quay lại</Button>
                                <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', opacity: 0.5 }} />
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <ExcelMenu
                                    title="Nhập xuất"
                                    onImport={() => fileInputRef.current?.click()}
                                    onExport={() => handleExportExcel()}
                                    disabled={!statusAccess}
                                />
                                <Button
                                    variant="outline"
                                    disabled={!statusAccess}
                                    onClick={handleSubmit((data) => onSubmit(data, PurchaseQuotationStatus.DRAFT))}
                                    style={{ height: '40px', padding: '0 24px', borderColor: '#e2e8f0' }}
                                >
                                    Lưu nháp
                                </Button>
                                <Button
                                    variant="primary"
                                    disabled={!statusAccess || !isDirty}
                                    icon={<SaveIcon fontSize="small" />}
                                    onClick={handleSubmit((data) => {
                                        if (validate(data)) {
                                            setOpenConfirm(true);
                                        }
                                    })}
                                    style={{ height: '40px', padding: '0 24px' }}
                                >
                                    Lưu & Phát hành
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                                        ? getValues('status') === PurchaseQuotationStatus.CANCELLED
                                                            ? THEME_COLORS.danger
                                                            : getValues('status') === PurchaseQuotationStatus.REJECTED
                                                                ? THEME_COLORS.danger
                                                                : THEME_COLORS.primary
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
                                                    ? (getValues('status') === PurchaseQuotationStatus.CANCELLED && index === 2
                                                        ? THEME_COLORS.danger
                                                        : getValues('status') === PurchaseQuotationStatus.REJECTED && index === 2
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

                <Grid container spacing={2} sx={{ flexWrap: { sm: 'nowrap', xs: 'wrap' } }} alignItems="flex-start">
                    <Grid size={{ xs: 12, sm: isSideBar ? 8 : 11.3 }} sx={{ transition: 'all 0.3s ease' }}>
                        <Box className="d-flex flex-column gap-3">
                            <Box className="glass-card">
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                                    <ListAltIcon /> Thông tin hợp đồng
                                </Typography>
                                <Divider sx={{ flex: 1, my: 1 }} />
                                <AddContractInfo generateCID={generateCID} />
                            </Box>
                            <Box className="glass-card">
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                                    <ListAltIcon /> Đơn hàng
                                </Typography>
                                <AddContractTable />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: isSideBar ? 4 : 0.7 }}
                        className="d-flex flex-column gap-3 justify-content-end transition-all">
                        <Box className="glass-card"
                            sx={{
                                position: "relative",
                                transition: "all 0.3s ease",
                                width: { xs: "100%", md: isSideBar ? "100%" : "60px" },
                                minHeight: !isSideBar ? "80vh" : "auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-start"
                            }}>
                            <AttachmentDisplay />
                        </Box>
                        <Box className="glass-card"
                            sx={{
                                position: "relative",
                                transition: "all 0.3s ease",
                                width: { xs: "100%", md: isSideBar ? "100%" : "60px" },
                                minHeight: !isSideBar ? "80vh" : "auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-start"
                            }}>
                            {isSideBar && (
                                <ContractHistory contractId={Number(decodedId)} />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleSubmit((data) => {
                    onSubmit(data, PurchaseQuotationStatus.PENDING);
                })}
                title="Xác nhận"
                content={`Bạn có chắc chắn muốn ${decodedId ? 'cập nhật' : 'tạo'} hợp đồng?`}
                loading={isPending}
            />
        </FormProvider>
    );
};

export default AddContract;