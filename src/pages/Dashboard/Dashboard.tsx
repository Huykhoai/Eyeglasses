import React from 'react';
import './Dashboard.css';
import { useAuth } from '@/context/AuthContext';
import Quotations from './Components/Quotations';
import Contracts from './Components/Contracts';
import Otks from './Components/Otks';
import InventoryChart from './Components/InventoryChart';


const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <div className="welcome-banner">
                <h1>Chào mừng trở lại, {user?.username}!</h1>
                <p>Hệ thống đang hoạt động ổn định.</p>
            </div>

            <div className="dashboard-stats-grid">
                <Quotations />
                <Contracts />
                <Otks />
            </div>

            <div style={{ marginTop: '24px' }}>
                <InventoryChart />
            </div>
        </div>
    );
};

export default Dashboard;
