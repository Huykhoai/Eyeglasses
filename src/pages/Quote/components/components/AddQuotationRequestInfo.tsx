import { Box, Divider, Grid, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
    Description as FormIcon,
    EventNote as DateIcon,
    Autorenew as AutorenewIcon,
    RequestQuote as RequestQuoteIcon,
    CurrencyExchange as CurrencyIcon,
} from '@mui/icons-material';
import { RHFAutoComplete } from "@/components/common/TextField/RHFComponents";
import { useCurrency, useSupplier } from "@/hooks/UseAllData";
import type { EntityType } from "@/pages/Employee/config/type";
import { RHFTextField } from "@/components/common/TextField/RHFTextField";
import PurchaseQuotationStatus, { type PurchaseQuotationEnum } from "@/utils/PurchaseQuotationEnum";

const AddQuotationRequestInfo: React.FC<{ generateCID: () => string }> = ({ generateCID }) => {
    const { setValue, getValues } = useFormContext();
    const [id, status] = getValues(['id', 'status']);
    const { data: suppliers } = useSupplier();
    const { data: currencies } = useCurrency();

    const statusAccess = useMemo(() => !id || (status &&
        ([PurchaseQuotationStatus.DRAFT, PurchaseQuotationStatus.PENDING, PurchaseQuotationStatus.REJECTED] as PurchaseQuotationEnum[]).includes(status))
    , [status]);

    const getNameEmployee = useCallback((empl: EntityType) => {
        if (!empl) return '--';
        return empl?.name || '';
    }, []);

    const handleRegenerateCID = () => {
        setValue('cid', generateCID(), { shouldValidate: true });
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 4, height: 16, bgcolor: '#6366f1', borderRadius: 1 }} />
                        THÔNG TIN ĐỊNH DANH
                    </Typography>

                    <Stack spacing={3} sx={{ px: 4, py: 2, borderRadius: '24px', border: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Mã phiếu yêu cầu báo giá</Typography>
                            <RHFTextField
                                name='cid'
                                placeholder='Nhập mã phiếu yêu cầu báo giá...'
                                disabled={!!id}
                                startAdornment={<InputAdornment position="start"><RequestQuoteIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>}
                                endAdornment={
                                    <IconButton onClick={handleRegenerateCID} disabled={!!id} size="small" sx={{ color: '#6366f1' }}>
                                        <AutorenewIcon fontSize="small" />
                                    </IconButton>
                                }
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Tên yêu cầu / Dự án *</Typography>
                            <RHFTextField
                                name='name'
                                placeholder="Nhập tên yêu cầu báo giá..."
                                disabled={!statusAccess}
                                startAdornment={<InputAdornment position="start"><FormIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Ngày tạo phiếu</Typography>
                            <RHFTextField
                                name='requestDate'
                                type="datetime-local"
                                rules={{ required: 'Vui lòng chọn ngày tạo phiếu' }}
                                disabled={!statusAccess}
                                startAdornment={<InputAdornment position="start"><DateIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Hạn cuối nhận báo giá</Typography>
                            <RHFTextField
                                name='expectedDate'
                                type="date"
                                rules={{ required: 'Vui lòng chọn hạn cuối nhận báo giá' }}
                                disabled={!statusAccess}
                                startAdornment={<InputAdornment position="start"><DateIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>}
                            />
                        </Box>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 4, height: 16, bgcolor: '#6366f1', borderRadius: 1 }} />
                        THIẾT LẬP THƯƠNG MẠI
                    </Typography>

                    <Box sx={{ px: 4, py: 2, borderRadius: '24px', border: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Nhà cung cấp mục tiêu</Typography>
                                <RHFAutoComplete
                                    name="supplier"
                                    options={suppliers || []}
                                    placeholder="Chọn nhà cung cấp"
                                    onChangeCallback={() => {
                                        setValue('products', new Map(), { shouldValidate: true });
                                    }}
                                    disabled={!statusAccess}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 7 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Tiền tệ giao dịch</Typography>
                                <RHFAutoComplete
                                    name="currency"
                                    options={currencies || []}
                                    placeholder="Chọn tiền tệ"
                                    onChangeCallback={(val: any) => {
                                        if (val?.value !== undefined) {
                                            setValue('currencyValue', val.value, { shouldValidate: true });
                                        }
                                    }}
                                    disabled={!statusAccess}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Tỉ giá (Exchange Rate)</Typography>
                                <RHFTextField
                                    name='currencyValue'
                                    isNumber
                                    startAdornment={<InputAdornment position="start"><CurrencyIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>}
                                    disabled={!statusAccess}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Ghi chú điều khoản bổ sung</Typography>
                                <RHFTextField
                                    name='note'
                                    placeholder="VD: Điều kiện thanh toán, địa điểm giao hàng..."
                                    multiline
                                    rows={3}
                                    disabled={!statusAccess}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, borderTop: '1px solid #f1f5f9', mt: 1, pt: 1 }}>
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Người thực hiện</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                        <Typography variant="body2" fontWeight={700}>{getNameEmployee(getValues('requestedBy') as EntityType)}</Typography>
                    </Box>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.5 }} />
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Người duyệt</Typography>
                    <Typography variant="body2" fontWeight={700}>{getNameEmployee(getValues('approvedBy') as EntityType)}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.5 }} />
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Thời gian duyệt</Typography>
                    <Typography variant="body2" fontWeight={700}>{getValues('approvedDate') ? new Date(getValues('approvedDate'))?.toLocaleString('vi-VN') : '--'}</Typography>
                </Box>
            </Box>
        </>

    );
};

export default React.memo(AddQuotationRequestInfo);