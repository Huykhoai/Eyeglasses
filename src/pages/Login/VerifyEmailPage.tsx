import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axiosClient';
import './Login.css';

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Liên kết không hợp lệ.');
            return;
        }
        axios.get(`/api/auth/verify-email?token=${token}`)
            .then((res) => {
                setStatus('success');
                setMessage(res.data?.message || 'Email đã được xác nhận thành công!');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Liên kết đã hết hạn hoặc không hợp lệ.');
            });
    }, [token]);

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
                {status === 'loading' && (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
                        <h2 style={{ color: '#1e293b', fontWeight: 700, marginBottom: 8 }}>Đang xác nhận...</h2>
                        <p style={{ color: '#64748b' }}>Vui lòng chờ trong giây lát.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
                        <h2 style={{ color: '#10b981', fontWeight: 700, marginBottom: 8 }}>Xác nhận thành công!</h2>
                        <p style={{ color: '#64748b', marginBottom: 28 }}>{message}</p>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>
                            Email của bạn đã được kích hoạt. Từ nay bạn có thể dùng tính năng quên mật khẩu.
                        </p>
                        <button
                            className="login-button"
                            style={{ marginTop: 24 }}
                            onClick={() => navigate('/login')}
                        >
                            Quay về đăng nhập
                        </button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div style={{ fontSize: 72, marginBottom: 20 }}>❌</div>
                        <h2 style={{ color: '#ef4444', fontWeight: 700, marginBottom: 8 }}>Xác nhận thất bại</h2>
                        <p style={{ color: '#64748b', marginBottom: 28 }}>{message}</p>
                        <button
                            className="login-button"
                            style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
                            onClick={() => navigate('/login')}
                        >
                            Quay về đăng nhập
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
