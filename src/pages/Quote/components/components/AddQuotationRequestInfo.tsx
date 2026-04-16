import { Box, Divider, Grid, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";
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
import { useAuth } from "@/context/AuthContext";

const AddQuotationRequestInfo: React.FC<{ generateCID: () => string }> = ({ generateCID }) => {
    const { control, formState: { errors }, setValue } = useFormContext();
    const { data: suppliers } = useSupplier();
    const { data: currencies } = useCurrency();
    const { user } = useAuth();

    const userNameEmployeeRequest = useMemo(() => {
        if (!user?.username) return '';
        const username = user.username.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return username;

    }, [user]);

    const handleRegenerateCID = () => {
        setValue('cid', generateCID(), { shouldValidate: true });
    };
    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 4, height: 16, bgcolor: '#6366f1', borderRadius: 1 }} />
                        THÔNG TIN ĐỊNH DANH
                    </Typography>

                    <Stack spacing={3} sx={{ px: 4, py: 2, borderRadius: '24px', border: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Mã phiếu hệ thống</Typography>
                            <TextField
                                {...control.register('cid')}
                                fullWidth
                                placeholder='Nhập mã phiếu yêu cầu báo giá...'
                                error={!!errors.cid}
                                helperText={errors.cid?.message?.toString()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><RequestQuoteIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleRegenerateCID} size="small" sx={{ color: '#6366f1' }}>
                                                <AutorenewIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { height: '42px', borderRadius: '10px', bgcolor: '#f1f5f9', fontWeight: 700, fontSize: '0.875rem' }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Tên yêu cầu / Dự án *</Typography>
                            <TextField
                                {...control.register('name')}
                                fullWidth
                                placeholder="Nhập tên yêu cầu báo giá..."
                                error={!!errors.name}
                                helperText={errors.name?.message?.toString()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><FormIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
                                    sx: { height: '42px', borderRadius: '10px', fontSize: '0.875rem' }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Ngày tạo phiếu</Typography>
                            <TextField
                                {...control.register('requestDate', { required: 'Vui lòng chọn ngày tạo phiếu' })}
                                type="datetime-local"
                                fullWidth
                                error={!!errors.requestDate}
                                helperText={errors.requestDate?.message?.toString()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><DateIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
                                    sx: { height: '42px', borderRadius: '10px', fontSize: '0.875rem' }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Hạn cuối nhận báo giá</Typography>
                            <TextField
                                {...control.register('expectedDate', { required: 'Vui lòng chọn hạn cuối nhận báo giá' })}
                                type="date"
                                fullWidth
                                error={!!errors.expectedDate}
                                helperText={errors.expectedDate?.message?.toString()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><DateIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
                                    sx: { height: '42px', borderRadius: '10px', fontSize: '0.875rem' }
                                }}
                            />
                        </Box>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                                    getOptionLabel={(option: any) => (option?.cid ? `${option?.cid} - ${option?.name}` : option?.name)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 7 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Tiền tệ giao dịch</Typography>
                                <RHFAutoComplete
                                    name="currency"
                                    options={currencies || []}
                                    placeholder="Chọn tiền tệ"
                                    getOptionLabel={(option: any) => (option?.cid ? `${option?.cid} - ${option?.name}` : option?.name)}
                                    onChangeCallback={(val: any) => {
                                        if (val?.value !== undefined) {
                                            setValue('currencyValue', val.value, { shouldValidate: true });
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Tỉ giá (Exchange Rate)</Typography>
                                <TextField
                                    {...control.register('currencyValue')}
                                    type="number"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><CurrencyIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
                                        sx: { height: '42px', borderRadius: '10px', bgcolor: 'white', fontWeight: 700, fontSize: '0.875rem' }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>Ghi chú điều khoản bổ sung</Typography>
                                <TextField
                                    {...control.register('note')}
                                    placeholder="VD: Điều kiện thanh toán, địa điểm giao hàng..."
                                    multiline
                                    rows={3}
                                    fullWidth
                                    InputProps={{
                                        sx: { borderRadius: '12px', bgcolor: 'white', py: 1.5, fontSize: '0.875rem' }
                                    }}
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
                        <Typography variant="body2" fontWeight={700}>{userNameEmployeeRequest}</Typography>
                    </Box>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.5 }} />
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Người duyệt</Typography>
                    <Typography variant="body2" fontWeight={700}>{userNameEmployeeRequest}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.5 }} />
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Thời gian duyệt</Typography>
                    <Typography variant="body2" fontWeight={700}>{"--"}</Typography>
                </Box>
            </Box>
        </>

    );
};

export default React.memo(AddQuotationRequestInfo);