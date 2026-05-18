import React, { useCallback } from "react"
import { Box, Typography } from "@mui/material"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import type { ApprovalType } from "../config/types"
interface ApprovalsTableProps {
    data: ApprovalType[] | [];
    onChange: (id: number) => void;
    selected: number | null;
}
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';
const ApprovalsTable = ({ data, onChange, selected }: ApprovalsTableProps) => {
    const handleSelected = useCallback((id: number) => {
        onChange(id)
    }, [onChange])

    return (
        <Box>
            {data.map((item) => (
                <Box
                    key={item.id}
                    onClick={() => handleSelected(item.id)}
                    className="approval-list-item"
                    sx={{
                        cursor: 'pointer',
                        border: selected === item.id ? `2px solid ${primaryColor}` : '1px solid #e2e8f0',
                    }}
                >
                    <Box className="d-flex justify-content-between align-items-start py-2">
                        <Typography variant="caption" fontWeight={800} color="primary">{item.cid}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(item.time), { addSuffix: true, locale: vi })}
                        </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ my: 0.5 }}>{item.name}</Typography>
                    <Box className="d-flex justify-content-between align-items-center py-2">
                        <Typography flex={8} variant="caption" color="text.secondary">{item.desc}</Typography>
                        <span className="badge-chip badge-warning"
                            style={{
                                padding: '0.1rem 0.5rem',
                                fontSize: '0.5rem',
                                fontWeight: 700,
                            }}>{item.status}</span>
                    </Box>
                </Box>
            ))}
        </Box>
    )
}

export default React.memo(ApprovalsTable)