import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '@/context/AuthContext';
import { positionLabel } from '@/utils/roles';

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
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const imageLabel = useMemo(() => {
        return user?.username?.substring(0, 2).toUpperCase();
    }, [user]);

    const positionLabelUser = useMemo(() => {
        return user?.positions?.map(position => positionLabel[position]).join(', ');
    }, [user]);

    const handleLinkClick = () => {
        setActiveIndex(null);
    };

    const renderNavItems = (items: NavButton[], isDropdown = false, parentIndex: string = '') => {
        return items.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            const currentIndex = isDropdown ? `${parentIndex}-${index}` : `${index}`;

            if (isDropdown) {
                return (
                    <div
                        key={index}
                        className="dropdown-item"
                        onMouseEnter={() => !item.url && setActiveIndex(1000 as any)}
                    >
                        <Link to={item.url || '#'} className="dropdown-link" onClick={handleLinkClick}>
                            {item.name}
                            {hasChildren && (
                                <svg className="chevron-icon" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            )}
                        </Link>
                        {hasChildren && (
                            <div className="dropdown-menu sub-dropdown">
                                {renderNavItems(item.children || [], true, currentIndex)}
                            </div>
                        )}
                    </div>
                );
            }

            const isOpen = activeIndex === index;

            return (
                <li
                    key={index}
                    className={`nav-item ${isOpen ? 'is-open' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <Link to={item.url || '#'} className="nav-link" onClick={handleLinkClick}>
                        {item.name}
                        {hasChildren && (
                            <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        )}
                    </Link>
                    {hasChildren && (
                        <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                            {renderNavItems(item.children || [], true, currentIndex)}
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
                        <span style={{
                            fontSize: '0.7rem',
                            color: '#64748b',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{positionLabelUser}</span>
                    </div>
                    <div className="profile-avatar" onClick={() => navigate('/profile')}>{imageLabel}</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
