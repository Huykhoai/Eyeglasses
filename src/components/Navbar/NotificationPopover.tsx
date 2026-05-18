import React, { useState, useCallback } from 'react';
import {
    Popover, Box, Typography, IconButton, Badge, List,
    ListItem, ListItemText, Button, CircularProgress
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { StatusNotification, type NotificationEnumType } from '@/utils/NotificationEnum';
import type { NamedEntity } from '@/pages/Product/types/product';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: NotificationEnumType;
    isRead: boolean;
    createdAt: string;
    referenceUrl?: string;
    actor: NamedEntity;
}

const NotificationPopover: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [size, setSize] = useState(20);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['notifications', 'count'],
        queryFn: async () => {
            const resp = await axiosClient.get('/api/notifications/unread-count');
            return resp.data;
        },
        refetchInterval: 30000,
    });

    const { data: notifications = [], isLoading, isFetching } = useQuery<NotificationItem[]>({
        queryKey: ['notifications', size],
        queryFn: async () => {
            const resp = await axiosClient.get(`/api/notifications/user?size=${size}`);
            return resp.data;
        },
        placeholderData: (previousData) => previousData,
    });

    const readAllMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.patch('/api/notifications/mark-all-read');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
        }
    });

    const readMutation = useMutation({
        mutationFn: async (id: number) => {
            return await axiosClient.post(`/api/notifications/read/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
        }
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLoadMore = () => {
        setSize(prev => prev + 20);
    };

    const handleReferenceClick = useCallback((item: NotificationItem) => {
        if (!item.isRead) {
            readMutation.mutate(item.id);
        }
        if (item.referenceUrl) {
            navigate(item.referenceUrl);
            handleClose();
        }
    }, [navigate, readMutation]);

    const getStatusColor = (type: NotificationEnumType) => {
        const status = StatusNotification[type] || 'info';
        switch (status) {
            case 'success': return '#22c55e';
            case 'error': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    return (
        <>
            <IconButton onClick={handleClick} sx={{ ml: 1, p: 0.5 }}>
                <Badge
                    badgeContent={unreadCount}
                    showZero
                    color="error"
                    overlap="circular"
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.6rem',
                            height: '16px',
                            minWidth: '16px',
                            transform: 'scale(0.85) translate(25%, -25%)'
                        }
                    }}
                >
                    <NotificationsNoneIcon sx={{ color: '#64748b', fontSize: '1.5rem' }} />
                </Badge>
            </IconButton>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 330,
                        maxHeight: 500,
                        mt: 1.5,
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle1" fontWeight={700} color="#1e293b">Thông báo</Typography>
                    <Button
                        size="small"
                        startIcon={<DoneAllIcon sx={{ fontSize: '16px !important' }} />}
                        onClick={() => unreadCount > 0 && readAllMutation.mutate()}
                        sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                        Đọc tất cả
                    </Button>
                </Box>

                <List sx={{ p: 0, overflowY: 'auto', flex: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' } }}>
                    {notifications.length === 0 && !isLoading ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Bạn không có thông báo nào</Typography>
                        </Box>
                    ) : (
                        notifications.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    onClick={() => !item.isRead && readMutation.mutate(item.id)}
                                    sx={{
                                        padding: '12px 16px',
                                        bgcolor: item.isRead ? '#ffffff' : 'rgba(99, 102, 241, 0.04)',
                                        borderTop: '1px solid #f1f5f9',
                                        borderBottom: '1px solid #f1f5f9',
                                        borderLeft: item.isRead ? '1px solid #f1f5f9' : `4px solid ${getStatusColor(item.type)}`,
                                        borderRight: '1px solid #f1f5f9',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        color: '#1e293b',
                                        transition: 'all 0.2s ease',
                                        m: 0.5,
                                        width: 'calc(100% - 16px)',
                                        cursor: 'pointer',
                                        flexDirection: 'column',
                                        gap: 1,
                                        '&:hover': {
                                            bgcolor: '#f1f5f9 !important',
                                            transform: 'scale(1.01)',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                        },
                                    }}
                                >
                                    <ListItemText
                                        sx={{ m: 0, width: '100%' }}
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={item.isRead ? 600 : 700}
                                                    color={item.isRead ? "#475569" : "#0f172a"}
                                                    sx={{ fontSize: '0.8125rem' }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'fit-content', ml: 1, fontSize: '0.65rem' }}>
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color={item.isRead ? "#94a3b8" : "#475569"} sx={{ display: 'block', lineHeight: 1.4, fontWeight: item.isRead ? 400 : 500, fontSize: '0.75rem' }}>
                                                {item.message}
                                            </Typography>
                                        }
                                    />
                                    {item.referenceUrl && (
                                        <Button
                                            size="small"
                                            startIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReferenceClick(item);
                                            }}
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                color: '#6366f1',
                                                p: 0,
                                                minWidth: 0,
                                                alignSelf: 'flex-start',
                                                '&:hover': { background: 'transparent', textDecoration: 'underline' }
                                            }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    )}
                                </ListItem>
                            </React.Fragment>
                        ))
                    )}
                </List>

                <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Button
                        fullWidth
                        variant="text"
                        size="small"
                        onClick={handleLoadMore}
                        disabled={isFetching || (notifications.length > 0 && notifications.length < size)}
                        sx={{ textTransform: 'none', color: '#6366f1', fontWeight: 600 }}
                    >
                        {isFetching ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        {(notifications.length > 0 && notifications.length < size) ? 'Đã tải hết thông báo' : 'Xem thêm'}
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

export default NotificationPopover;
