import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    TextField,
    Typography,
    Stack,
    Box,
    Chip,
    InputAdornment,
    Paper,
    Checkbox,
} from '@mui/material';
import {
    ManageAccounts as RoleIcon,
    Badge as PositionIcon,
    AccountCircle as UserIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/common/Button/Button';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import { type EmployeeType, type EntityType } from '../config/type';
import { roleLabels, Roles } from '@/utils/roles';
import useFetchAccountRoleById from './hooks/useFetchAccountRoleById';
import { Controller, useForm } from 'react-hook-form';
import useFetchPosition from './hooks/useFetchPosition';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';

interface DialogUpdateRolePositionProps {
    open: boolean;
    onClose: () => void;
    employee: EmployeeType | null;
}
const DialogUpdateRolePosition: React.FC<DialogUpdateRolePositionProps> = ({ open, onClose, employee }) => {
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { data: positionRole } = useFetchAccountRoleById(employee?.id || null, open);
    const { data: positions } = useFetchPosition(open);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { control, handleSubmit, reset, setValue, watch } = useForm<{
        employeeId: number | null;
        positions: EntityType[];
        roles: EntityType[];
    }>({
        defaultValues: {
            employeeId: null,
            positions: [],
            roles: []
        }
    });

    useEffect(() => {
        if (open && employee) {
            reset({
                employeeId: employee.id,
                positions: positionRole?.positions || [],
                roles: positionRole?.roles || []
            });
        }
    }, [open, employee, reset, positionRole]);

    const positionOptions = useMemo(() => {
        if (!positions) return [];
        const positionMaps = new Map(positions.map(p => [p.id, { id: p.id, cid: p.cid, name: p.name }]));
        return Array.from(positionMaps.values());
    }, [positions]);

    const selectedPositions: EntityType[] = watch('positions');
    const rolesOptions = useMemo(() => {
        if (!selectedPositions || selectedPositions.length === 0 || !positions) return [];
        const selectedIds = selectedPositions.map(p => p.id);
        const roles = new Map(positions
            .filter(p => selectedIds.includes(p.id) && p?.typeInfo?.id)
            .map(p => [p?.typeInfo?.id, { id: p?.typeInfo?.id, name: p?.typeInfo?.name }]));
        return Array.from(roles.values());
    }, [positions, selectedPositions]);

    const handleSelectedPosition = useCallback((selectedPositions: EntityType[]) => {
        if (!positions || selectedPositions.length === 0) {
            setValue('roles', []);
            return;
        }

        const selectedPositionIds = selectedPositions.map(p => p.id);
        
        const availableRolesMap = new Map(positions
            .filter(pos => selectedPositionIds.includes(pos.id) && pos?.typeInfo?.id)
            .map(pos => [pos?.typeInfo?.id, { id: pos?.typeInfo?.id, name: pos?.typeInfo?.name }]));
            
        const availableRoles = Array.from(availableRolesMap.values()) as EntityType[];
        setValue('roles', availableRoles);
    }, [positions, setValue]);

    const handleClose = () => {
        onClose();
        setConfirmOpen(false);
    };

    const updateRolePositionMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                roles: data.roles,
                positions: data.positions,
            };
            return axiosClient.post(`/api/employee/update-role-position/${data.employeeId}`, payload);
        },
        onSuccess: (response) => {
            if (response.data.status === 400) {
                showNotification('error', response.data.message, 'Lỗi hệ thống');
                return;
            }
            showNotification('success', response.data.message, 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['employee'] });
            queryClient.invalidateQueries({ queryKey: ['employee-all'] });
            queryClient.invalidateQueries({ queryKey: ['account-role', employee?.id] });
            queryClient.invalidateQueries({ queryKey: ['employee-log', employee?.id] });
            onClose();
            setConfirmOpen(false);
        },
        onError: (error: any) => {
            showNotification('error', error?.response?.data?.message || 'Không thể cập nhật', 'Lỗi');
        }
    });
    const handleUpdate = async (data: any) => {
        if (!user || ![Roles.ADMIN, Roles.MANAGE_HR].some(r => user.roles.includes(r))) {
            showNotification('error', 'Chỉ có Admin và Manager mới có quyền cập nhật role & chức vụ nhân viên', 'Thất bại');
            return;
        }

        updateRolePositionMutation.mutate(data);
    };

    return (
        <Box>
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            aria-labelledby="update-role-dialog-title"
            PaperProps={{ sx: { borderRadius: '16px' } }}
        >
            <DialogTitle id="update-role-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <RoleIcon color="primary" />
                <Typography variant="h6" fontWeight={700} component="span">Phân quyền & Chức vụ</Typography>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                            Nhân viên thực hiện
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <PositionIcon fontSize="small" color="action" />
                            <Typography variant="subtitle1" fontWeight={700}>
                                {employee?.name}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Phòng ban: <strong>{employee?.department?.name || 'Chưa xác định'}</strong>
                        </Typography>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            bgcolor: '#f8fafc',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="#334155">
                                QUYỀN HẠN & CHỨC VỤ
                            </Typography>
                        </Box>

                        <Controller
                            name="positions"
                            control={control}
                            rules={{ required: 'Chức vụ là bắt buộc' }}
                            render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                    {...field}
                                    multiple
                                    options={positionOptions || []}
                                    getOptionLabel={(option) => option.name || ""}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(_, newValue) => {
                                        field.onChange(newValue);
                                        handleSelectedPosition(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Chức vụ"
                                            placeholder='Chọn chức vụ...'
                                            fullWidth
                                            size="small"
                                            error={!!error}
                                            helperText={error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <UserIcon fontSize="small" />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                                sx: { borderRadius: '10px' }
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            name="roles"
                            control={control}
                            rules={{ validate: (value: EntityType[]) => value.length > 0 || 'Vai trò là bắt buộc' }}
                            render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                    {...field}
                                    multiple
                                    size="small"
                                    options={rolesOptions}
                                    getOptionLabel={(option) => roleLabels[option.name || ""] || ""}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                    disableClearable
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Vai trò truy cập"
                                            placeholder="Chọn vai trò..."
                                            error={!!error}
                                            helperText={error?.message}
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
                                                {roleLabels[option.name || ""]}
                                            </li>
                                        );
                                    }}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            const isFixed = option.name === Roles.STAFF_VIEW;
                                            return (
                                                <Chip
                                                    key={key}
                                                    label={roleLabels[option.name || ""]}
                                                    {...tagProps}
                                                    onDelete={isFixed ? undefined : tagProps.onDelete}
                                                    size="small"
                                                    sx={{ borderRadius: '6px', height: '24px' }}
                                                />
                                            );
                                        })
                                    }
                                />
                            )}
                        />
                    </Paper>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button variant="outline" onClick={handleClose}>Hủy</Button>
                <Button
                    variant="primary"
                    onClick={() => setConfirmOpen(true)}
                >
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
        <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleSubmit(handleUpdate)}
            title="Xác nhận thay đổi"
            content="Bạn có chắc chắn muốn thay đổi chức vụ và vai trò của nhân viên này?"
            loading={updateRolePositionMutation.isPending}
        />
        </Box>
    );
};

export default DialogUpdateRolePosition;
