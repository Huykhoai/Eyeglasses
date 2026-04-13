import React, { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import Loading from '@/components/ui/Loading/Loading';
import Button from '@/components/common/Button/Button';
import {
    Person as UserIcon,
    CreditCard as CreditCardIcon,
    Verified as BadgeCheckIcon,
    BusinessCenter as BriefcaseIcon,
    Security as SecurityIcon,
    PowerSettingsNew as PowerSettingsNewIcon,
} from '@mui/icons-material';
import { type EmployeeType } from '../Employee/config/type';
import DialogChangePassword from './components/DialogChangePassword';
import './Profile.css';
import { Tooltip } from '@mui/material';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import { roleLabels } from '@/utils/roles';
const url = import.meta.env.VITE_API_URL;

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { showNotification } = useNotification();

    const [openChangePassword, setOpenChangePassword] = React.useState(false);
    const [openLogout, setOpenLogout] = React.useState(false);

    const { data: profile, isLoading } = useQuery<EmployeeType>({
        queryKey: ['my-profile', user?.username],
        queryFn: async () => {
            const response = await axiosClient.get('/api/employee/me');
            return response.data;
        },
        enabled: !!user?.username,
    });
    
    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosClient.post('/api/account/logout');
            return response.data;
        },
        onSuccess: (data) => {
            showNotification('success', data || 'Đăng xuất thành công', 'Thành công');
            setOpenLogout(false);
            logout();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất';
            showNotification('error', message, 'Lỗi đăng xuất');
        }
    });

    const initials = useMemo(() => {
        if (!profile?.name) return user?.username?.substring(0, 2).toUpperCase() || '??';
        return profile.name.split(' ').slice(-1).map(n => n[0]).join('').toUpperCase();
    }, [profile, user]);

    if (isLoading) return <Loading fullPage message="Đang tải hồ sơ của bạn..." />;

    return (
        <div className="profile-page-container">
            {logoutMutation.isPending && <Loading fullPage message="Đang đăng xuất..." />}
            <div className="profile-header-card">
                <div className="profile-avatar-large">
                    {profile?.employeeInformation?.imageUrl ? (
                        <img
                            src={`${url}${profile.employeeInformation.imageUrl}`}
                            alt={profile.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        initials
                    )}
                </div>
                <div className="profile-name-section">
                    <h2>{profile?.name || user?.username}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, opacity: 0.9 }}>
                        <BadgeCheckIcon sx={{ fontSize: 18 }} />
                        <span style={{ fontWeight: 600 }}>Mã NV: {profile?.cid || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="profile-status-badge">
                        {user?.roles?.map(role => (
                            <div key={role} className="role-chip">
                                {roleLabels[role]}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginLeft: 'auto', zIndex: 2 }}>
                    <Button
                        variant="outline"
                        style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                        onClick={() => setOpenChangePassword(true)}
                    >
                        <SecurityIcon sx={{ mr: 1, fontSize: 18 }} />Đổi mật khẩu
                    </Button>
                </div>
                <div onClick={() => setOpenLogout(true)} className='profile-logout-icon'>
                    <Tooltip title="Đăng xuất">
                        <PowerSettingsNewIcon sx={{ fontSize: 18, color: 'white' }} />
                    </Tooltip>
                </div>
            </div>

            <div className="profile-info-grid">

                <div className="info-card-premium">
                    <h3><UserIcon sx={{ mr: 1 }} /> Thông tin cá nhân</h3>
                    <div className="info-row">
                        <span className="info-label">Email công việc</span>
                        <span className="info-value">{profile?.email || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Email cá nhân</span>
                        <span className="info-value">{profile?.employeeInformation?.email || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Số điện thoại</span>
                        <span className="info-value">{profile?.employeeInformation?.phone || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Địa chỉ</span>
                        <span className="info-value">{profile?.employeeInformation?.address || '-'}</span>
                    </div>
                </div>

                <div className="info-card-premium">
                    <h3><BriefcaseIcon sx={{ mr: 1 }} /> Thông tin công việc</h3>
                    <div className="info-row">
                        <span className="info-label">Phòng ban</span>
                        <span className="info-value">{profile?.department?.name || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Trạng thái</span>
                        <span className="info-value" style={{ color: '#059669' }}>
                            {profile?.statusEm?.name || 'Đang hoạt động'}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Người phụ thuộc</span>
                        <span className="info-value">{profile?.numberOfDependents || 0} người</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Giới tính</span>
                        <span className="info-value">{profile?.employeeInformation?.gender ? 'Nữ' : 'Nam'}</span>
                    </div>
                </div>

                <div className="info-card-premium">
                    <h3><CreditCardIcon sx={{ mr: 1 }} /> Pháp lý & Tài chính</h3>
                    <div className="info-row">
                        <span className="info-label">Số CCCD</span>
                        <span className="info-value">{profile?.employeeInformation?.citizenIdentificationNumber || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Ngân hàng</span>
                        <span className="info-value">{profile?.employeeInformation?.bankName || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Số tài khoản</span>
                        <span className="info-value">{profile?.employeeInformation?.accountNo || '-'}</span>
                    </div>
                </div>

                <div className="info-card-premium">
                    <h3><BadgeCheckIcon sx={{ mr: 1 }} /> Định danh hệ thống</h3>
                    <div className="info-row">
                        <span className="info-label">Ngày sinh</span>
                        <span className="info-value">{profile?.employeeInformation?.dateOfBirth || '-'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Tài khoản</span>
                        <span className="info-value" style={{ color: profile?.hasAccount ? '#059669' : '#dc2626' }}>
                            {profile?.hasAccount ? 'Đã kích hoạt' : 'Chưa có tài khoản'}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Username</span>
                        <span className="info-value">{user?.username}</span>
                    </div>
                </div>

                <div className="info-card-premium account-status-card">
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>
                        Lưu ý: Các thông tin nhạy cảm (như tài khoản ngân hàng, CCCD) chỉ có bạn và bộ phận Nhân sự có quyền xem. Vui lòng liên hệ Admin nếu cần cập nhật thông tin.
                    </p>
                </div>
            </div>

            <DialogChangePassword 
                open={openChangePassword}
                onClose={() => setOpenChangePassword(false)}
            />
            <ConfirmDialog
                open={openLogout}
                onClose={() => setOpenLogout(false)}
                onConfirm={() => logoutMutation.mutate()}
                title="Xác nhận đăng xuất"
                content="Bạn có chắc chắn muốn đăng xuất?"
            />
        </div>
    );
};

export default Profile;
