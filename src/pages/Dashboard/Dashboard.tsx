import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo-small">
                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
                            <ellipse cx="22" cy="32" rx="8" ry="12" stroke="currentColor" strokeWidth="2" />
                            <ellipse cx="42" cy="32" rx="8" ry="12" stroke="currentColor" strokeWidth="2" />
                            <line x1="30" y1="32" x2="34" y2="32" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>VNOptic</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user-profile">
                        <div className="user-avatar">AD</div>
                        <span>Admin</span>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="welcome-section">
                    <h1>Chào mừng đến với VNOptic</h1>
                    <p>Hệ thống quản lý mắt kính chuyên nghiệp cho doanh nghiệp</p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            📦
                        </div>
                        <h3>Quản lý kho</h3>
                        <p>Theo dõi tồn kho và nhập xuất hàng</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            👥
                        </div>
                        <h3>Khách hàng</h3>
                        <p>Quản lý thông tin khách hàng</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            📊
                        </div>
                        <h3>Báo cáo</h3>
                        <p>Thống kê và phân tích dữ liệu</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                            ⚙️
                        </div>
                        <h3>Cài đặt</h3>
                        <p>Cấu hình hệ thống</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
