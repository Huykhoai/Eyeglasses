import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import Loading from '@/components/ui/Loading/Loading';
import './Login.css';
import axios from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [mfaRequired, setMfaRequired] = useState(false);
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const { mutateAsync: handleSubmit, isPending } = useMutation({
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault();
            const response = await axios.post('/api/auth/login', formData);
            return response.data;
        },
        onSuccess: (data: any) => {
            if (data?.mfaRequired) {
                setMfaRequired(true);
                showNotification('info', data?.message || 'Vui lòng nhập mã cài đặt trên ứng dụng.', 'Xác thực 2 lớp');
                return;
            }
            const { token, ...user } = data;
            login(token, user);
            showNotification('success', 'Chào mừng bạn quay trở lại!', 'Đăng nhập thành công');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            showNotification('error', errorMessage, "Lỗi đăng nhập");
        }

    });

    const { mutateAsync: handleVerifyOtp, isPending: isPendingVerifyOtp } = useMutation({
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault();
            const response = await axios.post('/api/auth/mfa/verify', { otp });
            return response.data;
        },
        onSuccess: (data: any) => {
            const { token, ...user } = data;
            login(token, { ...user, mfaEnabled: true });
            showNotification('success', 'Xác thực thành công!', 'Chào mừng bạn quay trở lại!');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Mã OTP không chính xác. Vui lòng thử lại!';
            showNotification('error', errorMessage, "Lỗi xác thực");
        }
    });

    const { mutateAsync: handleForgotPassword, isPending: isPendingForgot } = useMutation({
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault();
            const response = await axios.post('/api/auth/forgot-password', { email: forgotEmail });
            return response.data;
        },
        onSuccess: (data: any) => {
            showNotification('success', data?.message || 'Vui lòng kiểm tra email của bạn.', 'Đã gửi yêu cầu');
            setForgotPasswordMode(false);
            setForgotEmail('');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu.';
            showNotification('error', errorMessage, "Lỗi");
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <div className="login-container">
            {isPending && <Loading fullPage message="Đang xác thực tài khoản..." />}
            {isPendingVerifyOtp && <Loading fullPage message="Đang xác thực OTP..." />}
            <div className="login-left">
                <div className="login-branding">
                    <div className="glasses-icon">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 45 Q15 35, 25 35 L35 35 Q45 35, 45 45 Q45 55, 35 55 L25 55 Q15 55, 15 45 Z" fill="white" stroke="white" strokeWidth="3" />
                            <path d="M55 45 Q55 35, 65 35 L75 35 Q85 35, 85 45 Q85 55, 75 55 L65 55 Q55 55, 55 45 Z" fill="white" stroke="white" strokeWidth="3" />
                            <line x1="45" y1="45" x2="55" y2="45" stroke="white" strokeWidth="3" />
                            <path d="M25 35 L20 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
                            <path d="M75 35 L80 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className="brand-name">Mắt Kính</h1>
                    <p className="brand-tagline">Hệ thống quản lý mắt kính chuyên nghiệp</p>
                </div>

                <div className="login-illustration">
                    <div className="floating-card card-1">
                        <div className="card-icon-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <div className="card-text">Quản lý kho</div>
                    </div>

                    <div className="floating-card card-2">
                        <div className="card-icon-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="card-text">Khách hàng</div>
                    </div>

                    <div className="floating-card card-3">
                        <div className="card-icon-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div className="card-text">Báo cáo</div>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-container">
                    {forgotPasswordMode ? (
                        <>
                            <div className="login-header">
                                <h2>Quên mật khẩu</h2>
                                <p>Nhập email tài khoản để nhận hướng dẫn đặt lại mật khẩu.</p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="login-form">
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="Địa chỉ email đã xác nhận"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button
                                        type="button"
                                        className="login-button"
                                        style={{ background: '#e2e8f0', color: '#1e293b' }}
                                        onClick={() => setForgotPasswordMode(false)}
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        className="login-button"
                                        disabled={!forgotEmail || isPendingForgot}
                                    >
                                        Gửi yêu cầu
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : !mfaRequired ? (
                        <>
                            <div className="login-header">
                                <h2>Đăng nhập tài khoản</h2>
                                <p>Chào mừng bạn quay trở lại!</p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="Tên đăng nhập hoặc Email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Mật khẩu"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                                <div className="form-options">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        className="forgot-password"
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                        onClick={() => setForgotPasswordMode(true)}
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>

                                <button type="submit" className="login-button">
                                    Đăng nhập
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="login-header">
                                <h2>Bảo vệ 2 lớp (MFA)</h2>
                                <p>Nhập mã 6 số từ Google Authenticator</p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="login-form">
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                                            placeholder="......"
                                            style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 600 }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button
                                        type="button"
                                        className="login-button"
                                        style={{ background: '#e2e8f0', color: '#1e293b' }}
                                        onClick={() => {
                                            setMfaRequired(false);
                                            setOtp('');
                                        }}
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        className="login-button"
                                        disabled={otp.length !== 6 || isPendingVerifyOtp}
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
