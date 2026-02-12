import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <div className="welcome-banner">
                <h1>Chào mừng trở lại, Huy!</h1>
                <p>Hệ thống đang hoạt động ổn định. Bạn có 5 đơn hàng mới cần xử lý.</p>
            </div>

            <div className="dashboard-stats-grid">
                <div className="placeholder-card">Thống kê doanh thu</div>
                <div className="placeholder-card">Sản phẩm bán chạy</div>
                <div className="placeholder-card">Hoạt động gần đây</div>
            </div>
        </div>
    );
};

export default Dashboard;
