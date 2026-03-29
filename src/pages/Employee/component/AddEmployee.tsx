import React, { useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Grid,
    Paper,
    Divider,
    InputAdornment,
    Autocomplete,
    MenuItem,
} from "@mui/material";
import {
    Badge as BadgeIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Home as HomeIcon,
    CalendarToday as CalendarIcon,
    AccountBalance as BankIcon,
    CreditCard as CardIcon,
    Groups as GroupsIcon,
    AccountCircle as AccountCircleIcon,
    Wc as WcIcon,
    Badge as IdCardIcon,
    SaveOutlined as SaveIcon
} from "@mui/icons-material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { useDepartmentAll } from "@/hooks/UseAllData";
import { getStatusEmployee } from "../hooks/useStatusEmployee";
import Button from "@/components/common/Button/Button";
import Loading from "@/components/ui/Loading/Loading";
import type { EmployeeType } from "../config/type";
import { useFetchEmployee } from "./hooks/useFetchEmployee";
import axiosClient from "@/api/axiosClient";
import AvatarUi from "./AvatarUI";
import { useBase64 } from "@/utils/base64";
import './AddEmployee.css';
import { useAuth } from "@/context/AuthContext";
import { Roles } from "@/utils/roles";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";


const initialForm: EmployeeType = {
    id: null,
    cid: '',
    email: '',
    name: '',
    hasAccount: false,
    statusEm: null,
    department: null,
    numberOfDependents: 0,
    employeeInformation: {
        email: '',
        imageUrl: '',
        phone: '',
        address: '',
        gender: false,
        dateOfBirth: '',
        citizenIdentificationNumber: '',
        accountNo: '',
        bankName: ''
    }
};
const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR;

const AddEmployee: React.FC = () => {
    const { id: encodeId } = useParams();
    const navigate = useNavigate();
    const { decode } = useBase64();
    const decodeId = decode(encodeId || null);
    const { user } = useAuth();

    const queryClient = useQueryClient();
    const { showNotification } = useNotification();
    const { data: employeeData, isLoading } = useFetchEmployee(Number(decodeId));
    const { data: departmentList } = useDepartmentAll();
    const statusList = useMemo(() => getStatusEmployee(), []);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const methods = useForm<EmployeeType>({
        defaultValues: {...initialForm, statusEm: statusList[0]},
        values: employeeData,
    });

    const { control, handleSubmit } = methods;

    const handleImageChange = useCallback((file: File | null) => {
        setSelectedFile(file);
    }, [setSelectedFile]);

    const buildProductObject = useCallback((parent: any, key: string, value: any) => {
        if (value === null || value === undefined) return;

        if (typeof value === 'object' && !Array.isArray(value) && 'id' in value) {
            parent[`${key}Id`] = value.id;
        }
        else if (typeof value === 'object' && !Array.isArray(value)) {
            parent[key] = parent[key] || {};
            Object.entries(value).forEach(([subKey, subValue]) => {
                buildProductObject(parent[key], subKey, subValue);
            });
        }
        else {
            parent[key] = value;
        }
    }, []);

    const getDiffValues = useCallback((current: any, original: any) => {
        const diff: any = {};
        if (!original) return current;

        Object.keys(current).forEach(key => {
            const currentValue = current[key];
            const originalValue = original[key];

            if (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
                if ('id' in currentValue) {
                    if (currentValue.id !== originalValue?.id) {
                        diff[key] = currentValue;
                    }
                } else {
                    const nestedDiff = getDiffValues(currentValue, originalValue);
                    if (Object.keys(nestedDiff).length > 0) {
                        diff[key] = nestedDiff;
                    }
                }
            } else if (currentValue !== originalValue) {
                diff[key] = currentValue;
            }
        });
        return diff;
    }, []);

    const saveMutation = useMutation({
        mutationFn: async (formData: EmployeeType) => {
            const dataToSave = new FormData();
            
            let dataForBody = formData;
            if (decodeId && employeeData) {
                dataForBody = getDiffValues(formData, employeeData);
                if (Object.keys(dataForBody).length === 0 && !selectedFile) {
                    return Promise.reject({ response: { data: { message: "Không có thay đổi nào để cập nhật" } } });
                }
            }

            const employeeDto: Record<string, any> = {};
            Object.entries(dataForBody).forEach(([key, value]) => {
                buildProductObject(employeeDto, key, value);
            });

            if (selectedFile) {
                dataToSave.append('image', selectedFile);
            }
            dataToSave.append('employee', new Blob([JSON.stringify(employeeDto)], { type: 'application/json' }));

            if (decodeId) {
                return axiosClient.patch( `/api/employee/update/${decodeId}`, dataToSave);
            }
            return axiosClient.post('/api/employee/create', dataToSave);
        },
        onSuccess: (response) => {
            if (response.data.status === 400) {
                showNotification('error', response.data.message, 'Lỗi hệ thống');
                return;
            }
            showNotification('success', decodeId ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên mới thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['employee'] });
            queryClient.invalidateQueries({ queryKey: ['employee-all'] });
            queryClient.invalidateQueries({ queryKey: ['employee-log'] });
            navigate('/admin/employees');
        },
        onError: (error: any) => {
            showNotification('error', error?.response?.data?.message || 'Có lỗi xảy ra', 'Thất bại');
        }
    });

    const onSubmit = (data: EmployeeType) => {
        if (!user || !user.roles.includes(Roles.ADMIN)) {
            showNotification('error', 'Chỉ có admin mới có quyền thêm nhân viên', 'Thất bại');
            return;
        }
        saveMutation.mutate(data);
    };

    const renderTextField = (label: string, name: string, icon: React.ReactNode, rules: any = {}, type: string = "text") => (
        <Controller
            name={name as any}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    fullWidth
                    size="small"
                    type={type}
                    label={label + (rules.required ? ' *' : '')}
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                        startAdornment: icon ? (
                            <InputAdornment position="start">
                                {icon}
                            </InputAdornment>
                        ) : null,
                        sx: { borderRadius: '10px' }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                            '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR }
                    }}
                />
            )}
        />
    );
    
    return (
        <FormProvider {...methods}>
            <Box className="add-employee-wrapper">
                {isLoading && <Loading fullPage message="Đang tải thông tin nhân viên..." />}
                <Box className="add-employee-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </Button>
                        <Box>
                            <Typography variant="h5" fontWeight={700} color="#1a1a1a" sx={{ letterSpacing: '-0.5px' }}>
                                {decodeId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="primary"
                        onClick={() => setConfirmDialog(true)}
                        disabled={saveMutation.isPending}
                    >
                        <SaveIcon fontSize="small" />
                        {decodeId ? 'Lưu thay đổi' : 'Lưu nhân viên'}
                    </Button>
                </Box>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper className="employee-side-paper" elevation={0}>
                            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <AvatarUi onImageChange={handleImageChange} />
                                </Box>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1, color: '#333' }}>
                                    ẢNH ĐẠI DIỆN
                                </Typography>
                                <Typography variant="caption" color="text.secondary" align="center" sx={{ px: 2, mt: 0.5 }}>
                                    Hỗ trợ JPG, PNG. Tối đa 2MB.
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ px: 3, pb: 4 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <GroupsIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} /> TRẠNG THÁI & PHÒNG BAN
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Controller
                                        name="statusEm"
                                        control={control}
                                        rules={{ required: 'Trạng thái là bắt buộc' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <Autocomplete
                                                {...field}
                                                options={statusList || []}
                                                getOptionLabel={(opt) => opt?.name || ''}
                                                isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                                                onChange={(_, val) => field.onChange(val)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Trạng thái"
                                                        size="small"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                                    />
                                                )}
                                                disabled={!decodeId}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="department"
                                        control={control}
                                        rules={{ required: 'Phòng ban là bắt buộc' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <Autocomplete
                                                {...field}
                                                options={departmentList || []}
                                                getOptionLabel={(opt) => opt?.name || ''}
                                                isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                                                onChange={(_, val) => field.onChange(val)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Phòng ban"
                                                        size="small"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 9 }}>
                        <Paper className="employee-main-paper" elevation={0}>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <Box sx={{ bgcolor: `${PRIMARY_COLOR}15`, p: 0.8, borderRadius: '8px' }}>
                                        <AccountCircleIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" fontSize="1rem" fontWeight={700}>
                                        THÔNG TIN CƠ BẢN
                                    </Typography>
                                </Box>

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Mã nhân viên", "cid", <BadgeIcon fontSize="small" />, { required: 'Mã NV là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Họ và tên", "name", <PersonIcon fontSize="small" />, { required: 'Họ tên là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Email công việc", "email", <EmailIcon fontSize="small" />, {
                                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email không hợp lệ" }
                                        })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="employeeInformation.gender"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size="small"
                                                    label="Giới tính"
                                                    value={field.value ? 'true' : 'false'}
                                                    onChange={(e) => field.onChange(e.target.value === 'true')}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><WcIcon fontSize="small" /></InputAdornment>,
                                                        sx: { borderRadius: '10px' }
                                                    }}
                                                >
                                                    <MenuItem value="false">Nam</MenuItem>
                                                    <MenuItem value="true">Nữ</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        {renderTextField("Ngày sinh", "employeeInformation.dateOfBirth", <CalendarIcon fontSize="small" />, { required: 'Ngày sinh là bắt buộc' }, "date")}
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <Box sx={{ bgcolor: `${PRIMARY_COLOR}15`, p: 0.8, borderRadius: '8px' }}>
                                        <HomeIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" fontSize="1rem" fontWeight={700}>
                                        LIÊN HỆ & ĐỊA CHỈ
                                    </Typography>
                                </Box>

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Số điện thoại", "employeeInformation.phone", <PhoneIcon fontSize="small" />, { required: 'SĐT là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Email cá nhân", "employeeInformation.email", <EmailIcon fontSize="small" />, { required: 'Email cá nhân là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Số CCCD", "employeeInformation.citizenIdentificationNumber", <IdCardIcon fontSize="small" />, { required: 'CCCD là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        {renderTextField("Địa chỉ thường trú", "employeeInformation.address", <HomeIcon fontSize="small" />, { required: 'Địa chỉ là bắt buộc' })}
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <Box sx={{ bgcolor: `${PRIMARY_COLOR}15`, p: 0.8, borderRadius: '8px' }}>
                                        <BankIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" fontSize="1rem" fontWeight={700}>
                                        TÀI KHOẢN NGÂN HÀNG & KHÁC
                                    </Typography>
                                </Box>

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Tên ngân hàng", "employeeInformation.bankName", <BankIcon fontSize="small" />, { required: 'Tên NH là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Số tài khoản", "employeeInformation.accountNo", <CardIcon fontSize="small" />, { required: 'STK là bắt buộc' })}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderTextField("Số người phụ thuộc", "numberOfDependents", <GroupsIcon fontSize="small" />, { required: 'Số người phụ thuộc là bắt buộc' }, "number")}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <ConfirmDialog
                open={confirmDialog}
                title={"Xác nhận"}
                content={`Bạn có chắc chắn muốn ${decodeId ? 'cập nhật' : 'thêm'} nhân viên này?`}
                onClose={() => setConfirmDialog(false)}
                onConfirm={handleSubmit(onSubmit)}
            />
        </FormProvider>
    );
};

export default AddEmployee;