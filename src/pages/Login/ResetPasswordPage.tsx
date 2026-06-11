import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axiosClient';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import Loading from '@/components/ui/Loading/Loading';
import './Login.css';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            showNotification('error', 'Không tìm thấy mã đặt lại mật khẩu trong liên kết.', 'Lỗi');
            return;
        }

        if (newPassword.length < 8) {
            showNotification('warning', 'Mật khẩu phải có ít nhất 8 ký tự.', 'Chưa hợp lệ');
            return;
        }

        const passwordRegex = /^[A-Z](?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{7,}$/;
        if (!passwordRegex.test(newPassword)) {
            showNotification('warning', 'Chữ cái đầu phải viết hoa và chứa ít nhất 1 ký tự đặc biệt', 'Chưa hợp lệ');
            return;
        }
        if (newPassword !== confirmPassword) {
            showNotification('warning', 'Mật khẩu xác nhận không khớp.', 'Chưa hợp lệ');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/reset-password', {
                token,
                newPassword
            });

            const message = res.data?.message || 'Mật khẩu đã được đặt lại thành công.';
            if (res.data?.status === 400) {
                showNotification('error', message, 'Thất bại');
                return;
            }
            setIsSuccess(true);
            showNotification('success', message, 'Hoàn tất');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, liên kết có thể đã hết hạn.';
            showNotification('error', errorMessage, 'Thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="login-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    background: 'white',
                    borderRadius: 20,
                    padding: '48px 56px',
                    maxWidth: 480,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                }}>
                    <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
                    <h2 style={{ color: '#10b981', fontWeight: 700, marginBottom: 8 }}>Đặt lại thành công!</h2>
                    <p style={{ color: '#64748b', marginBottom: 28 }}>
                        Mật khẩu của bạn đã được thay đổi. Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay bây giờ.
                    </p>
                    <button
                        className="login-button"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            {isLoading && <Loading fullPage message="Đang xử lý..." />}
            <div style={{
                background: 'white',
                borderRadius: 20,
                padding: '40px',
                maxWidth: 420,
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
                <div className="login-header" style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Tạo mật khẩu mới</h2>
                    <p style={{ color: '#64748b', marginTop: 8 }}>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <div className="input-wrapper"> 
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Tối thiểu 8 ký tự"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {showPassword ? (
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-button" style={{ marginTop: 20 }}>
                        Đổi mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
