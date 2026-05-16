import { Box, Typography, Stack, Avatar, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from "dayjs";

import axiosClient from "@/api/axiosClient";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import type { TableContractLogResponse } from "../config/types";
import Loading from "@/components/ui/Loading/Loading";

interface ContractHistoryProps {
    contractId: number | undefined;
}

const THEME_PRIMARY = import.meta.env.VITE_PRIMARY_COLOR;
const url = import.meta.env.VITE_API_URL;

const ContractHistory: React.FC<ContractHistoryProps> = ({ contractId }) => {
    const { showNotification } = useNotification();
    const [size, setSize] = useState(20);

    const { data: histories = [], isLoading, isFetching } = useQuery<TableContractLogResponse[]>({
        queryKey: ['contract', 'histories', contractId, size],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/api/contract/histories/${contractId}`, {
                    params: { size }
                });
                return response.data;
            } catch (error: any) {
                showNotification('error', error?.response?.data?.message || 'Lỗi khi tải lịch sử', 'Thất bại');
                throw error;
            }
        },
        enabled: !!contractId,
        staleTime: 5 * 60 * 1000,
    });

    const handleLoadMore = () => {
        setSize(prev => prev + 20);
    };

    return (
        <Box sx={{ p: 1, width: '100%', mt: 2 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: '#fdfbff',
                p: 1.5,
                borderRadius: '12px',
                mb: 2,
                border: '1px solid rgba(113, 75, 103, 0.05)'
            }}>
                <HistoryIcon sx={{ color: THEME_PRIMARY }} />
                <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                    Lịch sử hợp đồng
                </Typography>
            </Box>

            <Box sx={{
                position: 'relative',
                maxHeight: '50vh',
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '4px' }
            }}>
                {isLoading && size === 20 ? (
                    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                        <Loading message="Đang tải lịch sử..." />
                    </Box>
                ) : histories.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                        Chưa có lịch sử thay đổi
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        {histories.map((log) => (
                            <Box
                                key={log.id}
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    bgcolor: '#fff',
                                    border: '1px solid #f1f5f9',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: THEME_PRIMARY,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                    }
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <Avatar
                                        src={`${url}${log.employee.cid}`}
                                        sx={{ width: 36, height: 36, bgcolor: THEME_PRIMARY }}
                                    >
                                        <PersonIcon fontSize="small" />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" fontWeight={700} color="#1e293b">
                                                {log.employee.name}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {dayjs(log.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                        <Typography variant="body2" color={THEME_PRIMARY} fontWeight={600} sx={{ mb: 0.5 }}>
                                            {log.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                                            {log.description}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>

            {histories.length >= size && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Tooltip title="Xem thêm lịch sử">
                        <IconButton
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            sx={{
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#f1f5f9' }
                            }}
                        >
                            {isFetching ? <Loading /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Hiện thêm
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default React.memo(ContractHistory);
