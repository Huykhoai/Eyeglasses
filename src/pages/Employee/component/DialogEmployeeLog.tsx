import React, { useCallback, useMemo, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Divider,
    Stack,
    Paper,
    Avatar,
    DialogActions
} from '@mui/material';
import {
    Close as CloseIcon,
    History as HistoryIcon,
    Event as EventIcon,
    Person as PersonIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useEmployeeLog } from '../hooks/useEmployeeLog';
import type { EmployeeLogResponse, EmployeeType } from '../config/type';
import Loading from '@/components/ui/Loading/Loading';
import MultiFilterBar, { type FilterItem } from '@/components/common/MultiFilterBar/MultiFilterBar';
import Pagination from '@/components/common/Pagination/Pagination';
const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR
interface DialogEmployeeLogProps {
    open: boolean;
    onClose: () => void;
    employee: EmployeeType | null;
}

const DialogEmployeeLog: React.FC<DialogEmployeeLogProps> = ({ open, onClose, employee }) => {

    const [page, setPage] = useState(1);
    const size = 20;
    const [filters, setFilters] = useState<Record<string, any>>({});
    const { data: logs, isLoading } = useEmployeeLog(Number(employee?.id) || null, page, size, filters);

    const categories: FilterItem[] = useMemo(() => [
        {
            key: 'statusEm',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { label: 'Hoạt động', id: 1 },
                { label: 'Nghỉ phép', id: 2 },
                { label: 'Nghỉ ốm', id: 3 },
                { label: 'Nghỉ việc', id: 4 },
            ],
        },
        {
            key: 'from',
            label: 'Từ ngày',
            type: 'date',
            options: [],
        },
        {
            key: 'to',
            label: 'Đến ngày',
            type: 'date',
            options: [],
        },
    ], [])

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        const mapFilters = {
            statusEmId: filters.statusEm?.id || null,
            from: filters.from || null,
            to: filters.to || null
        }
        setFilters(mapFilters);
        setPage(1);
    }, [setFilters, setPage])

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, [setPage])

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                    maxHeight: '85vh',
                    minHeight: '85vh'
                }
            }}
        >
            <DialogTitle
                sx={{
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: PRIMARY_COLOR,
                    color: 'white'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <HistoryIcon />
                    <Box>
                        <Typography variant="h6" fontSize="1rem" fontWeight={700}>
                            Lịch sử thay đổi
                        </Typography>
                        {employee && (
                            <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                                Nhân viên: {employee.name} ({employee.cid})
                            </Typography>
                        )}
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, bgcolor: '#fbfbfb' }}>
                {isLoading && <Loading fullPage message="Đang tải lịch sử thay đổi..." />}
                <Box sx={{ p: 2 }}>
                    <MultiFilterBar
                        categories={categories}
                        onFilterChange={handleFilterChange}
                    />
                    {logs && logs?.items?.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 8, opacity: 0.5 }}>
                            <HistoryIcon sx={{ fontSize: 48, mb: 2 }} />
                            <Typography>Chưa có lịch sử thay đổi nào cho nhân viên này.</Typography>
                        </Box>
                    ) : (
                        <Stack spacing={3} sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: '20px',
                                    top: '10px',
                                    bottom: '10px',
                                    width: '2px',
                                    bgcolor: '#e0e0e0',
                                    zIndex: 0
                                }}
                            />

                            {logs?.items?.map((log: EmployeeLogResponse) => (
                                <Box key={log.id} sx={{ display: 'flex', gap: 3, position: 'relative', zIndex: 1 }}>
                                    <Avatar
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            bgcolor: 'white',
                                            border: `2px solid ${PRIMARY_COLOR}`,
                                            color: PRIMARY_COLOR,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <HistoryIcon fontSize="small" />
                                    </Avatar>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            flex: 1,
                                            p: 2,
                                            borderRadius: '12px',
                                            border: '1px solid #eee',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                borderColor: PRIMARY_COLOR
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={700} color={PRIMARY_COLOR}>
                                                {log.title || 'Thay đổi thông tin'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EventIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(log.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

                                        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                            <DescriptionIcon sx={{ fontSize: 14, color: 'text.secondary', mt: 0.3 }} />
                                            <Typography
                                                variant="body2"
                                                color="text.primary"
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {log.content}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {log.employee && (
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.8,
                                                        bgcolor: '#f0f0f0',
                                                        px: 1.2,
                                                        py: 0.5,
                                                        borderRadius: '6px'
                                                    }}
                                                >
                                                    <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        Thực hiện bởi: {log?.employeeModify?.name || 'Unknown'}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {log.statusEm && (() => {
                                                const name = log.statusEm?.name || '-';
                                                const status = log.statusEm?.id === 1 ? 'success' : log.statusEm?.id === 2 || log.statusEm?.id === 3 ? 'warning' : 'danger';
                                                return (
                                                    <span className={`badge-chip badge-${status}`}>
                                                        {name}
                                                    </span>
                                                );
                                            })()}
                                        </Box>
                                    </Paper>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span className='text-sm text-gray-500'>Tổng số: {logs?.totalItems}</span>
                    <Pagination
                        totalItems={logs?.totalItems || 0}
                        page={page}
                        size={size}
                        onChange={handlePageChange}
                    />
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DialogEmployeeLog;
