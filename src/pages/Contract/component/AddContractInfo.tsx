import { RHFTextField } from "@/components/common/TextField/RHFTextField";
import { Grid, IconButton, InputAdornment, Typography } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import {
    RequestQuote as RequestQuoteIcon,
    Description as FormIcon,
    EventNote as DateIcon,
    CurrencyExchange as CurrencyIcon,
    Autorenew as AutorenewIcon,
    Notes as NotesIcon
} from '@mui/icons-material';
import { RHFAutoComplete } from "@/components/common/TextField/RHFComponents";
import { useFormContext } from "react-hook-form";
import { useSupplier } from "@/hooks/UseAllData";
import { useCurrency } from "@/hooks/UseAllData";
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";

const AddContractInfo = ({ generateCID }: { generateCID: () => string }) => {
    const { setValue, getValues } = useFormContext();
    const [id, status] = getValues(['id', 'status']);
    const { data: suppliers } = useSupplier();
    const { data: currencies } = useCurrency();

    const statusAccess = useMemo(() => !id || (status &&
        ([PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING] as PurchaseQuotationEnum[]).includes(status))
    , [status]);

    const handleRegenerateCID = useCallback(() => {
        setValue('cid', generateCID(), { shouldValidate: true });
    }, [generateCID, setValue]);

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Mã hợp đồng
                </Typography>
                <RHFTextField
                    name="cid"
                    placeholder="Nhập mã hợp đồng..."
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
                    Tên hợp đồng
                </Typography>
                <RHFTextField
                    name="name"
                    placeholder="Nhập tên hợp đồng..."
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><FormIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
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
                        setValue('quotations', new Map(), { shouldValidate: true });
                    }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Ngày ký kết
                </Typography>
                <RHFTextField
                    name="signDate"
                    type="date"
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><DateIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Tiền tệ
                </Typography>
                <RHFAutoComplete
                    name="currency"
                    placeholder="Nhập loại tiền tệ..."
                    options={currencies || []}
                    disabled={!statusAccess}
                    onChangeCallback={(value: any) => {
                        if (value?.value !== undefined) {
                            setValue('contractCurrencyValue', value.value, { shouldValidate: true });
                        }
                    }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Tỷ giá quy đổi
                </Typography>
                <RHFTextField
                    name="contractCurrencyValue"
                    type="number"
                    disabled={!statusAccess}
                    placeholder="Nhập tỷ giá quy đổi..."
                    startAdornment={<InputAdornment position="start"><CurrencyIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    Ngày giao hàng dự kiến
                </Typography>
                <RHFTextField
                    name="expectedDeliveryDate"
                    type="date"
                    disabled={!statusAccess}
                    startAdornment={<InputAdornment position="start"><DateIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
                    <NotesIcon fontSize="inherit" /> Ghi chú / Điều khoản bổ sung
                </Typography>
                <RHFTextField
                    name="note"
                    placeholder="Nhập ghi chú hoặc các điều khoản quan trọng khác của hợp đồng..."
                    multiline
                    rows={3}
                    disabled={!statusAccess}
                />
            </Grid>
        </Grid>
    );
};

export default React.memo(AddContractInfo);