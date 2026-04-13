import React, { useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '@/context/AuthContext';
import { positionLabel } from '@/utils/roles';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Collapse, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [mobileOpenSubMenu, setMobileOpenSubMenu] = React.useState<string | null>(null);

    const toggleMobileMenu = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setMobileMenuOpen(open);
    };

    const handleMobileSubMenuClick = (name: string) => {
        setMobileOpenSubMenu(mobileOpenSubMenu === name ? null : name);
    };

    const imageLabel = useMemo(() => {
        return user?.username?.substring(0, 2).toUpperCase();
    }, [user]);

    const positionLabelUser = useMemo(() => {
        return user?.positions?.map(position => positionLabel[position]).join(', ');
    }, [user]);

    const handleLinkClick = () => {
        setActiveIndex(null);
    };

    const navigateProfile = useCallback(() => {
        navigate('/profile');
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [navigate, mobileMenuOpen])
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
                <Box className="nav-logo"
                    sx={{
                        width: { xs: '1.8rem', md: '2.2rem' },
                        height: { xs: '1.8rem', md: '2.2rem' }
                    }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </Box>
                <Typography variant="h6" fontWeight="bold"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.15rem' },
                        minWidth: { xs: '10rem', lg: '15rem' }
                    }}>
                    {brandName}</Typography>
            </div>

            <div className="navbar-right">
                <ul className="nav-menu-list">
                    {renderNavItems(buttons)}
                </ul>

                <IconButton
                    className="mobile-menu-btn"
                    onClick={toggleMobileMenu(true)}
                    sx={{
                        display: { xs: 'flex', lg: 'none' },
                        color: '#6366f1',
                        ml: 1
                    }}
                >
                    <MenuIcon />
                </IconButton>

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
                    <div className="profile-avatar" onClick={navigateProfile}>{imageLabel}</div>
                </div>
            </div>

            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu(false)}
                PaperProps={{
                    sx: { width: '280px', padding: '20px 10px' }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 2 }}>
                    <Box className="nav-logo" sx={{ width: '2.2rem', height: '2.2rem', mr: 2 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">{brandName}</Typography>
                </Box>
                
                <Box sx={{ px: 2, mb: 3, display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 2 }}>
                    <div className="profile-avatar" style={{ margin: 0 }}>{imageLabel}</div>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{user?.username}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: '180px' }}>
                            {positionLabelUser}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List sx={{ px: 1 }}>
                    {buttons.map((item) => (
                        <React.Fragment key={item.name}>
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    component={item.url ? Link : 'div'}
                                    to={item.url}
                                    onClick={() => {
                                        if (item.children) {
                                            handleMobileSubMenuClick(item.name);
                                        } else {
                                            setMobileMenuOpen(false);
                                            item.url && navigate(item.url);
                                        }
                                    }}
                                    sx={{
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        '&:hover': { background: 'rgba(99, 102, 241, 0.08)' }
                                    }}
                                >
                                    <ListItemText
                                        primary={item.name}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            color: '#475569'
                                        }}
                                    />
                                    {item.children ? (mobileOpenSubMenu === item.name ? <ExpandLess /> : <ExpandMore />) : null}
                                </ListItemButton>
                            </ListItem>
                            {item.children && (
                                <Collapse in={mobileOpenSubMenu === item.name} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding sx={{ pl: 2 }}>
                                        {item.children.map((child) => (
                                            <ListItem key={child.name} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={child.url || '#'}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    sx={{ borderRadius: '8px', mb: 0.5 }}
                                                >
                                                    <ListItemText
                                                        primary={child.name}
                                                        primaryTypographyProps={{
                                                            fontSize: '0.85rem',
                                                            color: '#64748b'
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>
        </nav>
    );
};

export default Navbar;
