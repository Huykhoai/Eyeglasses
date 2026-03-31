import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    Stack,
    Paper,
    Checkbox,
    Chip,
    Tooltip,
    Autocomplete
} from '@mui/material';
import {
    Close as CloseIcon,
    PersonAdd as PersonAddIcon,
    Visibility,
    VisibilityOff,
    VpnKey as VpnKeyIcon,
    AccountCircle as UserIcon,
    Security as RoleIcon,
    AutoFixHigh as AutoIcon,
    ContentCopy as CopyIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import Button from '@/components/common/Button/Button';
import  {type EmployeeType, roleLabels } from '../config/type';
import { Roles } from '@/utils/roles';

interface DialogCreateAccountProps {
    open: boolean;
    onClose: () => void;
    employee: EmployeeType | null;
}
const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR;

const DialogCreateAccount: React.FC<DialogCreateAccountProps> = ({ open, onClose, employee }) => {
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [createdAccount, setCreatedAccount] = useState<{username: string, password: string} | null>(null);

    const { control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            roles: [Roles.MANAGER] as string[],
        }
    });

    useEffect(() => {
        if (open && employee) {
            reset({
                username: employee.cid,
                email: employee.email || '',
                password: '',
                roles: [Roles.MANAGER],
            });
            setCreatedAccount(null);
        }
    }, [open, employee, reset]);

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0, n = charset.length; i < 12; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        setValue('password', password);
        showNotification('info', 'Đã tạo mật khẩu ngẫu nhiên', 'Thông báo');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showNotification('success', 'Đã sao chép vào bộ nhớ tạm', 'Thành công');
    };

    const createAccountMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                ...data,
                employeeId: employee?.id
            };
            return axiosClient.post('/api/auth/register-account', payload);
        },
        onSuccess: (response) => {
            if (response.data.status === 400) {
                showNotification('error', response.data.message, 'Lỗi hệ thống');
                return;
            }
            showNotification('success', response.data.message, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['employee'] });
            queryClient.invalidateQueries({ queryKey: ['employee-all'] });
            
            setCreatedAccount({
                username: watch('username'),
                password: watch('password')
            });
        },
        onError: (error: any) => {
            showNotification('error', error?.response?.data?.message || 'Không thể tạo tài khoản', 'Lỗi');
        }
    });

    const handleFormSubmit = (data: any) => {
        createAccountMutation.mutate(data);
    };

    if (createdAccount) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <CheckIcon sx={{ fontSize: 60, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700}>Tạo tài khoản thành công!</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Vui lòng lưu lại thông tin tài khoản dưới đây để gửi cho nhân viên <strong>{employee?.name}</strong>.
                    </Typography>
                    <Stack spacing={2}>
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '12px', border: '1px dashed #ccc' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Tên đăng nhập</Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(createdAccount.username)}><CopyIcon fontSize="small" /></IconButton>
                            </Box>
                            <Typography variant="body1" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>{createdAccount.username}</Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '12px', border: '1px dashed #ccc' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Mật khẩu</Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(createdAccount.password)}><CopyIcon fontSize="small" /></IconButton>
                            </Box>
                            <Typography variant="body1" fontWeight={700} sx={{ color: PRIMARY_COLOR, letterSpacing: '0.5px' }}>{createdAccount.password}</Typography>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                    <Button variant="primary" onClick={onClose} style={{ width: '100%', borderRadius: '10px' }}>Hoàn tất</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
        >
            <DialogTitle sx={{ 
                bgcolor: PRIMARY_COLOR, 
                color: 'white', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonAddIcon />
                    <Typography variant="h6" fontWeight={700}>Cấp tài khoản truy cập</Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, mt: 1 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: `${PRIMARY_COLOR}08`, borderRadius: '12px', mb: 3, border: `1px solid ${PRIMARY_COLOR}20` }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>Thông tin nhân viên:</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight={700} color={PRIMARY_COLOR}>{employee?.name}</Typography>
                        <Chip label={`Mã NV: ${employee?.cid}`} size="small" sx={{ fontWeight: 700, bgcolor: 'white' }} />
                    </Box>
                </Paper>

                <Stack spacing={3}>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ 
                            required: 'Tên đăng nhập là bắt buộc',
                            pattern: {
                                value: /^[a-zA-Z0-9._]+$/,
                                message: 'Tên đăng nhập không được có khoảng trắng, dấu hoặc ký tự đặc biệt'
                            }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Tên đăng nhập"
                                fullWidth
                                size="small"
                                error={!!error}
                                helperText={error?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><UserIcon fontSize="small" /></InputAdornment>,
                                    sx: { borderRadius: '10px' }
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        rules={{ 
                            required: 'Mật khẩu là bắt buộc', 
                            minLength: { value: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
                            pattern: {
                                value: /^[A-Z](?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{7,}$/,
                                message: 'Chữ cái đầu phải viết hoa và chứa ít nhất 1 ký tự đặc biệt'
                            }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                size="small"
                                error={!!error}
                                helperText={error?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><VpnKeyIcon fontSize="small" /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Tạo mật khẩu ngẫu nhiên">
                                                <IconButton onClick={generatePassword} size="small" sx={{ mr: 0.5, color: PRIMARY_COLOR }}>
                                                    <AutoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '10px' }
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                multiple
                                size="small"
                                options={Object.keys(roleLabels)}
                                getOptionLabel={(option) => roleLabels[option] || option}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={(_, newValue) => field.onChange(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Vai trò truy cập"
                                        placeholder="Chọn vai trò..."
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start" sx={{ ml: 1 }}>
                                                        <RoleIcon fontSize="small" />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                            sx: { borderRadius: '10px' }
                                        }}
                                    />
                                )}
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                size="small"
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {roleLabels[option]}
                                        </li>
                                    );
                                }}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={key}
                                                label={roleLabels[option]}
                                                {...tagProps}
                                                size="small"
                                                sx={{ borderRadius: '6px', height: '24px' }}
                                            />
                                        );
                                    })
                                }
                            />
                        )}
                    />
                    <Typography variant="caption" color="error" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 0.5, mt: -1 }}>
                        * Lưu ý: "Quản lý" là chức vụ công tác, không phải vai trò hệ thống.
                    </Typography>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button variant="outline" onClick={onClose} style={{ borderRadius: '10px' }}>Hủy bỏ</Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit(handleFormSubmit)} 
                    disabled={createAccountMutation.isPending}
                    style={{ borderRadius: '10px', minWidth: '150px' }}
                >
                    {createAccountMutation.isPending ? 'Đang xử lý...' : 'Tạo tài khoản'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogCreateAccount;
