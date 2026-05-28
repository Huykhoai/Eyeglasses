import {
    Assignment as ContractIcon,
    AccessTime as ClockIcon,
    ArrowForward as ArrowIcon,
    AttachMoney as MoneyIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { Box, Typography, Chip, Stack, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/common/Pagination/Pagination';
import Loading from '@/components/ui/Loading/Loading';
import { formatPrice } from '@/utils/formatPrice';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Position, Roles } from '@/utils/roles';
import { useFetchContract } from '../hooks/useFetchContract';

const contractColor = '#10b981';

const Contracts = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const hasPermission = user?.positions?.some((position) => ([Position.ADMIN, Position.MANAGER, Position.STAFF_XNK] as string[]).includes(position))
        || user?.roles?.some(role => ([Roles.ADMIN, Roles.MANAGE_XNK] as string[]).includes(role));

    const [page, setPage] = useState(1);
    const size = 5;

   const {data, isLoading} = useFetchContract(page, size, hasPermission);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="dashboard-card pending-contract-card" style={{ position: 'relative', overflow: 'hidden' }}>
            {!hasPermission && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                }}>
                    <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.06)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Bạn không có quyền truy cập thẻ này
                    </Typography>
                </div>
            )}

            <div className="card-header">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box className="card-icon" sx={{ background: `linear-gradient(135deg, ${contractColor}, ${contractColor}cc)` }}>
                        <ContractIcon sx={{ color: '#fff', fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            Hợp đồng chờ duyệt
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {data?.totalItems ?? 0} hợp đồng đang chờ xử lý
                        </Typography>
                    </Box>
                </Stack>
                <Chip
                    label="Xem tất cả"
                    size="small"
                    onClick={() => hasPermission && navigate('/xnk/contracts')}
                    icon={<ArrowIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{
                        fontWeight: 600, fontSize: 11, cursor: hasPermission ? 'pointer' : 'default',
                        bgcolor: `${contractColor}12`, color: contractColor,
                        '&:hover': { bgcolor: hasPermission ? `${contractColor}22` : `${contractColor}12` },
                        '.MuiChip-icon': { color: contractColor },
                        opacity: hasPermission ? 1 : 0.5
                    }}
                />
            </div>

            <div className="card-body">
                {isLoading && hasPermission && <Loading message="Đang tải..." />}

                {!isLoading && hasPermission && (data?.items ?? []).length === 0 && (
                    <div className="empty-state">
                        <ContractIcon sx={{ fontSize: 48, color: '#e2e8f0' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Không có hợp đồng nào đang chờ duyệt
                        </Typography>
                    </div>
                )}

                {hasPermission && (data?.items ?? []).map((item, index) => (
                    <div className="quotation-row" key={item.id}>
                        <div className="row-index">{(page - 1) * size + index + 1}</div>
                        <div className="row-content">
                            <div className="row-main">
                                <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', fontSize: 13 }}>
                                    {item.cid}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{
                                    display: '-webkit-box', WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 200,
                                }}>
                                    {item.name}
                                </Typography>
                            </div>
                            <div className="row-meta">
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <ClockIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                    <Typography variant="caption" color="text.secondary" fontSize={11}>
                                        {formatDate(item.signDate)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <MoneyIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                    <Typography variant="caption" fontWeight={600} sx={{ color: contractColor, fontSize: 11 }}>
                                        {formatPrice(item.totalAmount)}
                                    </Typography>
                                </Stack>
                            </div>
                        </div>
                        <Tooltip title="Xem chi tiết">
                            <IconButton
                                size="small"
                                onClick={() => navigate(`/approvals?type=contracts&id=${item.id}`)}
                                sx={{
                                    color: contractColor,
                                    bgcolor: `${contractColor}10`,
                                    '&:hover': { bgcolor: `${contractColor}20` },
                                }}
                            >
                                <ViewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                ))}
            </div>

            {hasPermission && (data?.totalItems ?? 0) > size && (
                <div className="card-footer">
                    <Pagination totalItems={data?.totalItems ?? 0} size={size} page={page} onChange={setPage} />
                </div>
            )}
        </div>
    );
};

export default Contracts;
