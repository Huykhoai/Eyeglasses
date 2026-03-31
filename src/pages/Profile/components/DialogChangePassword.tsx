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
import { useForm, Controller } from 'react-hook-form';
import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';

interface DialogChangePasswordProps {
    open: boolean;
    onClose: () => void;
}

const DialogChangePassword: React.FC<DialogChangePasswordProps> = ({ open, onClose }) => {
    const { showNotification } = useNotification();
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const newPasswordValue = watch('newPassword');

    const toggleVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await axiosClient.post('/api/account/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
            showNotification('success', 'Đổi mật khẩu thành công', 'Thành công');
            handleClose();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
            showNotification('error', message, 'Thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Đổi mật khẩu</Typography>
            </DialogTitle>
            
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                }
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
                    <Button variant="primary" type="submit" isLoading={loading} disabled={loading}>
                        Cập nhật mật khẩu
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DialogChangePassword;
