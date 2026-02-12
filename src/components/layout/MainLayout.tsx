import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { navButtons } from '@/config/navConfig';

const MainLayout: React.FC = () => {
    return (
        <div className="main-layout" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Navbar buttons={navButtons} brandName="Mắt Kính" />
            <main className="layout-content" style={{ paddingTop: '64px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
