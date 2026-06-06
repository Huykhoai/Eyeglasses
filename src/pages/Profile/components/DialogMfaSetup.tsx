import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Stack,
    Box
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import Loading from '@/components/ui/Loading/Loading';
import { useAuth } from '@/context/AuthContext';

interface DialogMfaSetupProps {
    open: boolean;
    onClose: () => void;
}

const DialogMfaSetup: React.FC<DialogMfaSetupProps> = ({ open, onClose }) => {
    const { showNotification } = useNotification();
    const { token, login, user } = useAuth();
    const [otp, setOtp] = useState('');

    const { data: stepSetup, isLoading } = useQuery({
        queryKey: ['mfa-setup'],
        queryFn: async () => {
            try {
                const response = await axiosClient.get('/api/account/mfa/setup');
                return response.data;
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin MFA';
                showNotification('error', message, 'Thất bại');
                throw error;
            }
        },
        enabled: open,
    });

    const verifyMutation = useMutation({
        mutationFn: async (otpCode: string) => {
            const response = await axiosClient.post('/api/account/mfa/verify-setup', { otp: otpCode });
            return response.data;
        },
        onSuccess: (data: any) => {
            if (data.status === 400) {
                showNotification('error', data?.message || 'Kích hoạt xác thực 2 lớp thất bại!', 'Thất bại');
                return;
            }
            showNotification('success', data?.message || 'Kích hoạt xác thực 2 lớp thành công!', 'Thành công');
            login(token!, { ...user!, mfaEnabled: true });
            handleClose();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP';
            showNotification('error', message, 'Thất bại');
        }
    });

    const handleClose = () => {
        setOtp('');
        onClose();
    };

    const handleSubmit = () => {
        if (!otp || otp.length < 6) return;
        verifyMutation.mutate(otp);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Cài đặt bảo mật 2 lớp</Typography>
            </DialogTitle>

            <DialogContent>
                {isLoading ? (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <Loading />
                    </Box>
                ) : (
                    <Stack spacing={3} sx={{ mt: 1, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Sử dụng ứng dụng <b>Google Authenticator</b> trên điện thoại để quét mã QR bên dưới, sau đó nhập mã gồm 6 chữ số để hoàn tất cài đặt.
                        </Typography>

                        {stepSetup?.qrCodeUri && (
                            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                                <img src={stepSetup.qrCodeUri} alt="MFA QR Code" style={{ width: 220, height: 220 }} />
                            </Box>
                        )}
                        <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                            Khóa tay: {stepSetup?.secret}
                        </Typography>

                        <TextField
                            fullWidth
                            label="Nhập 6 số từ ứng dụng"
                            variant="outlined"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 600 } }}
                            placeholder="......"
                        />
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                <Button variant="outline" type="button" onClick={handleClose}>Hủy</Button>
                <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    disabled={verifyMutation.isPending || otp.length !== 6 || isLoading}
                >
                    Khởi động
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogMfaSetup;
