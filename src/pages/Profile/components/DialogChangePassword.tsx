import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    InputAdornment,
    Typography,
    Stack
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    LockOutlined as LockIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';

interface DialogChangePasswordProps {
    open: boolean;
    onClose: () => void;
}

const DialogChangePassword: React.FC<DialogChangePasswordProps> = ({ open, onClose }) => {
    const { showNotification } = useNotification();
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const { reset, handleSubmit, formState: { errors }, control } = methods;
    const newPasswordValue = useWatch({ control, name: 'newPassword' });
    const oldPasswordValue = useWatch({ control, name: 'oldPassword' });

    const toggleVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    const handlePrepareConfirm = async () => {
        const isValid = await methods.trigger();
        if (!isValid) return;
        setConfirmOpen(true);
    }
    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await axiosClient.post('/api/account/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
            if (response.data.status === 400) {
                showNotification('error', response.data.message, 'Thất bại');
                return;
            }
            showNotification('success', response.data.message, 'Thành công');
            setConfirmOpen(false);
            handleClose();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
            showNotification('error', message, 'Thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>Đổi mật khẩu</Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt để đảm bảo an toàn.
                        </Typography>

                        <Controller
                            name="oldPassword"
                            control={control}
                            rules={{ required: 'Vui lòng nhập mật khẩu cũ' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Mật khẩu hiện tại"
                                    type={showPasswords.old ? 'text' : 'password'}
                                    error={!!errors.oldPassword}
                                    helperText={errors.oldPassword?.message}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => toggleVisibility('old')} edge="end">
                                                    {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="newPassword"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập mật khẩu mới',
                                minLength: { value: 8, message: 'Tối thiểu 8 ký tự' },
                                pattern: {
                                    value: /^[A-Z](?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{7,}$/,
                                    message: 'Viết hoa chữ đầu và có ít nhất 1 ký tự đặc biệt'
                                },
                                validate: (value) => value !== oldPasswordValue || 'Mật khẩu mới không được trùng với mật khẩu cũ'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Mật khẩu mới"
                                    type={showPasswords.new ? 'text' : 'password'}
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword?.message}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SecurityIcon fontSize="small" /></InputAdornment>,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => toggleVisibility('new')} edge="end">
                                                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                required: 'Vui lòng xác nhận mật khẩu',
                                validate: value => value === newPasswordValue || 'Mật khẩu xác nhận không khớp'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Xác nhận mật khẩu mới"
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => toggleVisibility('confirm')} edge="end">
                                                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button variant="outline" type="button" onClick={handleClose}>Hủy</Button>
                    <Button variant="primary" type="button" onClick={handlePrepareConfirm} disabled={loading}>
                        Cập nhật mật khẩu
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleSubmit(onSubmit)}
                title="Xác nhận thay đổi mật khẩu"
                content="Bạn có chắc chắn muốn thay đổi mật khẩu?"
                loading={loading}
            />
        </FormProvider>

    );
};

export default DialogChangePassword;
