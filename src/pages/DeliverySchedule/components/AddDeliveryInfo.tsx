import { RHFTextField } from "@/components/common/TextField/RHFTextField";
import { Grid, IconButton, InputAdornment, Typography } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import {
    RequestQuote as RequestQuoteIcon,
    Description as FormIcon,
    EventNote as DateIcon,
    LocalShipping as ShippingIcon,
    AssignmentTurnedIn as DeclarationIcon,
    Money as MoneyIcon,
    Autorenew as AutorenewIcon,
    Notes as NotesIcon
} from '@mui/icons-material';
import { RHFAutoComplete } from "@/components/common/TextField/RHFComponents";
import { useFormContext, useWatch } from "react-hook-form";
import { useSupplier } from "@/hooks/UseAllData";
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";

const AddDeliveryInfo = ({ generateCID }: { generateCID: () => string }) => {
    const { setValue, getValues } = useFormContext();
    const [id, status] = getValues(['id', 'status']);
    const [isImportTaxPercentage, isVatPercentage, isOtherTaxPercentage] = useWatch({
        name: ['isImportTaxPercentage', 'isVatPercentage', 'isOtherTaxPercentage']
    });
    const { data: suppliers } = useSupplier();

    const statusAccess = useMemo(() => !id || (status &&
        ([PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING] as PurchaseQuotationEnum[]).includes(status))
        , [id, status]);

    const handleRegenerateCID = useCallback(() => {
        setValue('cid', generateCID(), { shouldValidate: true });
    }, [generateCID, setValue]);

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Mã lịch giao hàng (LGH)
                </Typography>
                <RHFTextField
                    name="cid"
                    placeholder="Nhập mã lịch giao hàng..."
                    disabled={!!id}
                    startAdornment={<InputAdornment position="start"><RequestQuoteIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                    endAdornment={
                        <IconButton onClick={handleRegenerateCID} disabled={!!id} size="small" sx={{ color: '#6366f1' }}>
                            <AutorenewIcon fontSize="small" />
                        </IconButton>
                    }
                />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Tên lịch giao hàng
                </Typography>
                <RHFTextField
                    name="name"
                    placeholder="Nhập tên lịch giao hàng..."
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><FormIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Nhà cung cấp
                </Typography>
                <RHFAutoComplete
                    name="supplier"
                    placeholder="Chọn nhà cung cấp..."
                    options={suppliers || []}
                    disabled={!statusAccess}
                    onChangeCallback={() => {
                        setValue('items', new Map(), { shouldValidate: true });
                        setValue('contracts', new Map(), { shouldValidate: true });
                    }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Mã vận đơn
                </Typography>
                <RHFTextField
                    name="billOfLadingNumber"
                    placeholder="Nhập mã vận đơn..."
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><ShippingIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Số tờ khai hải quan
                </Typography>
                <RHFTextField
                    name="declarationNumber"
                    placeholder="Nhập số tờ khai hải quan..."
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><DeclarationIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Ngày khai hải quan
                </Typography>
                <RHFTextField
                    name="declarationDate"
                    type="date"
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><DateIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Ngày giao hàng thực tế/dự kiến
                </Typography>
                <RHFTextField
                    name="deliveryDate"
                    type="date"
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><DateIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Phí môi trường (VND)
                </Typography>
                <RHFTextField
                    name="feeEnvironment"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Phí bảo hiểm (VND)
                </Typography>
                <RHFTextField
                    name="feeInsurance"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Phí vận chuyển bộ (VND)
                </Typography>
                <RHFTextField
                    name="feeDelivery"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Phí vận chuyển biển (VND)
                </Typography>
                <RHFTextField
                    name="feeDeliverySea"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Phí khác (VND)
                </Typography>
                <RHFTextField
                    name="feeOther"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <div className="d-flex align-items-center justify-content-between form-check form-switch p-0">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                        Thuế nhập khẩu
                    </Typography>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isImportTaxPercentage}
                        disabled={!statusAccess}
                        onChange={() => setValue('isImportTaxPercentage', !isImportTaxPercentage)}
                        style={{ backgroundColor: isImportTaxPercentage ? "#ff9800" : "#ccc" }}
                    />
                </div>
                <RHFTextField
                    name="taxImport"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => setValue('isImportTaxPercentage', !isImportTaxPercentage)}
                                disabled={!statusAccess}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isImportTaxPercentage ? '#6366f1' : '#94a3b8' }}>
                                    {isImportTaxPercentage ? '%' : 'VND'}
                                </Typography>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <div className="d-flex align-items-center justify-content-between form-check form-switch p-0">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                        Thuế VAT
                    </Typography>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isVatPercentage}
                        disabled={!statusAccess}
                        onChange={() => setValue('isVatPercentage', !isVatPercentage)}
                        style={{ backgroundColor: isVatPercentage ? "#ff9800" : "#ccc" }}
                    />
                </div>
                <RHFTextField
                    name="taxVat"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => setValue('isVatPercentage', !isVatPercentage)}
                                disabled={!statusAccess}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isVatPercentage ? '#6366f1' : '#94a3b8' }}>
                                    {isVatPercentage ? '%' : 'VND'}
                                </Typography>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <div className="d-flex align-items-center justify-content-between form-check form-switch p-0">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                        Thuế khác
                    </Typography>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isOtherTaxPercentage}
                        disabled={!statusAccess}
                        onChange={() => setValue('isOtherTaxPercentage', !isOtherTaxPercentage)}
                        style={{ backgroundColor: isOtherTaxPercentage ? "#ff9800" : "#ccc" }}
                    />
                </div>
                <RHFTextField
                    name="taxOther"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="0"
                    startAdornment={<InputAdornment position="start"><MoneyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => setValue('isOtherTaxPercentage', !isOtherTaxPercentage)}
                                disabled={!statusAccess}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isOtherTaxPercentage ? '#6366f1' : '#94a3b8' }}>
                                    {isOtherTaxPercentage ? '%' : 'VND'}
                                </Typography>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    <NotesIcon fontSize="inherit" /> Ghi chú
                </Typography>
                <RHFTextField
                    name="note"
                    placeholder="Nhập ghi chú cho lịch giao hàng này..."
                    multiline
                    rows={3}
                    disabled={!statusAccess}
                />
            </Grid>
        </Grid>
    );
};

export default React.memo(AddDeliveryInfo);
