import { Box, Typography, Stack, TextField } from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import Loading from '@/components/ui/Loading/Loading';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { MonthlyImportData } from '../config/types';
import { useStatisticalProduct } from '../hooks/useStatisticalProduct';
import { useState } from 'react';

const chartColor = '#3b82f6';

const InventoryChart = () => {
    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [preMonth, setPreMonth] = useState<string>(formatDate(sixMonthsAgo));
    const [nextMonth, setNextMonth] = useState<string>(formatDate(currentDate));

    const handleShift = (months: number) => {
        const prev = new Date(preMonth || new Date());
        prev.setMonth(prev.getMonth() + months);
        setPreMonth(formatDate(prev));

        const next = new Date(nextMonth || new Date());
        next.setMonth(next.getMonth() + months);
        setNextMonth(formatDate(next));
    };

    const { data, isLoading } = useStatisticalProduct(preMonth, nextMonth);



    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const monthData = payload[0].payload as MonthlyImportData;
            return (
                <div style={{
                    backgroundColor: '#fff', padding: '12px', border: '1px solid #e2e8f0',
                    borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1e293b' }}>
                        Tháng {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: chartColor, fontWeight: 600, mb: 1.5 }}>
                        Tổng nhập: {monthData.totalImported.toLocaleString('vi-VN')} SP
                    </Typography>

                    {monthData.topProducts && monthData.topProducts.length > 0 && (
                        <div>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                TOP 3 SẢN PHẨM:
                            </Typography>
                            {monthData.topProducts.map((p, idx) => (
                                <Stack key={idx} direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#334155', maxWidth: '11vw', textOverflow: 'ellipsis' }}>
                                        {idx + 1}. {p.name}
                                    </Typography>
                                    <Typography variant="caption" fontWeight={600} sx={{ color: '#475569' }}>
                                        {p.quantity.toLocaleString('vi-VN')}
                                    </Typography>
                                </Stack>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-card chart-card" style={{ gridColumn: 'span 2', minHeight: 400 }}>
            <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box className="card-icon" sx={{ background: `linear-gradient(135deg, ${chartColor}, ${chartColor}cc)` }}>
                        <InventoryIcon sx={{ color: '#fff', fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            Lưu lượng nhập kho
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Tổng số lượng sản phẩm hoàn tất nhập kho theo từng tháng
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" alignItems='center' spacing={2}>
                    <Stack direction="row" alignItems='center' spacing={1}
                        className='btn btn-outline'
                    >
                        <Box component="i" className='bi bi-caret-left' onClick={() => handleShift(-6)} sx={{ cursor: 'pointer', p: 0.5 }} />
                        <TextField
                            type='date'
                            size='small'
                            value={preMonth}
                            onChange={(e) => setPreMonth(e.target.value)}
                            variant='standard'
                            slotProps={{
                                input: {
                                    sx: { borderRadius: '10px', fontSize: '0.875rem' }
                                }
                            }}
                        />
                    </Stack>
                    <Stack direction="row" alignItems='center' spacing={1}
                        className='btn btn-outline'
                    >
                        <TextField
                            type='date'
                            size='small'
                            value={nextMonth}
                            onChange={(e) => setNextMonth(e.target.value)}
                            variant='standard'
                            slotProps={{
                                input: {
                                    sx: { borderRadius: '10px', fontSize: '0.875rem' }
                                }
                            }}
                        />
                        <Box component="i" className='bi bi-caret-right' onClick={() => handleShift(6)} sx={{ cursor: 'pointer', p: 0.5 }} />
                    </Stack>
                </Stack>

            </div>

            <div className="card-body" style={{ marginTop: 16 }}>
                {isLoading && <Loading message="Đang tải biểu đồ..." />}

                {!isLoading && data && data.length === 0 && (
                    <div className="empty-state" style={{ height: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                            Chưa có dữ liệu nhập kho trong
                        </Typography>
                    </div>
                )}

                {!isLoading && data && data.length > 0 && (
                    <ResponsiveContainer width="100%" height={530}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Bar
                                dataKey="totalImported"
                                fill={chartColor}
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                name="Số lượng nhập"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default InventoryChart;
