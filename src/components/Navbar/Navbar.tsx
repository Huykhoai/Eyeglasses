import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '@/context/AuthContext';
export interface NavButton {
    name: string;
    url?: string;
    children?: NavButton[];
}

interface NavbarProps {
    buttons: NavButton[];
    brandName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ buttons, brandName = "VNOptic" }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const renderNavItems = (items: NavButton[], isDropdown = false) => {
        return items.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;

            if (isDropdown) {
                return (
                    <div key={index} className="dropdown-item">
                        <Link to={item.url || '#'} className="dropdown-link">
                            {item.name}
                            {hasChildren && (
                                <svg className="chevron-icon" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            )}
                        </Link>
                        {hasChildren && (
                            <div className="dropdown-menu sub-dropdown">
                                {renderNavItems(item.children || [], true)}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <li key={index} className="nav-item">
                    <Link to={item.url || '#'} className="nav-link">
                        {item.name}
                        {hasChildren && (
                            <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        )}
                    </Link>
                    {hasChildren && (
                        <div className="dropdown-menu">
                            {renderNavItems(item.children || [], true)}
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-left" onClick={() => navigate('/dashboard')}>
                <div className="nav-logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </div>
                <span className="nav-brand-name">{brandName}</span>
            </div>

            <div className="navbar-right">
                <ul className="nav-menu-list">
                    {renderNavItems(buttons)}
                </ul>

                <div className="nav-profile">
                    <div className="profile-info" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{user?.username}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{user?.roles?.join(', ')}</span>
                    </div>
                    <div className="profile-avatar">HK</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
