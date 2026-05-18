import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFetchContractBySupplier } from "../hooks/useFetchContractBySupplier";
import type { Contract } from "@/pages/Contract/config/types";
import { Box, Checkbox, Divider, IconButton, Paper, Stack, styled, Typography } from "@mui/material";
import TextField from "@/components/common/TextField/TextField";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import Loading from "@/components/ui/Loading/Loading";
import ApprovalIcon from '@mui/icons-material/Approval';
import Pagination from "@/components/common/Pagination/Pagination";
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#6366f1';
const ContractItemCard = styled(Paper)<{ selected: boolean }>(({ theme, selected }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    cursor: 'pointer',
    borderRadius: '12px',
    border: `1px solid ${selected ? primaryColor : '#f1f5f9'}`,
    backgroundColor: selected ? 'rgba(113, 75, 104, 0.05)' : '#fff',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
        border: `1px solid ${primaryColor}`,
        transform: 'translateY(-2px)'
    }
}));

interface DialogImportDeliveryLeftProps {
    supplierId?: number | null;
    contractsMap: Map<number, Contract>;
    onRemoveItemsByContract?: (contractId: number) => void;
}

const DialogImportDeliveryLeft: React.FC<DialogImportDeliveryLeftProps> = ({ supplierId, contractsMap, onRemoveItemsByContract }) => {
    const { setValue } = useFormContext();

    const [page, setPage] = useState(1);
    const size = 20;
    const [search, setSearch] = useState('');

    const { data: contractsData, isLoading } = useFetchContractBySupplier(
        supplierId, page, size, search
    );

    const handleSelectContract = useCallback((contract: Contract) => {
        if (!contract.id) return;
        const newMap = new Map(contractsMap);
        const isSelected = newMap.has(contract.id);
        if (isSelected) {
            newMap.delete(contract.id);
            if (onRemoveItemsByContract) {
                onRemoveItemsByContract(contract.id);
            }
        } else {
            newMap.set(contract.id, contract);
        }
        setValue('contracts', newMap, { shouldDirty: true });
    }, [setValue, contractsMap, onRemoveItemsByContract]);

    return (
        <Box className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    name="search"
                    placeholder="Tìm mã hợp đồng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton sx={{
                    bgcolor: primaryColor, color: '#fff',
                    '&:hover': { bgcolor: '#fff', color: primaryColor }
                }} >
                    <SearchIcon />
                </IconButton>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Box sx={{ flex: 1, overflowY: 'auto', paddingTop: 0.25 }}>
                {contractsData?.items?.length === 0 ? (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                        <ApprovalIcon sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
                        <Typography variant="body1" fontWeight={600}>Không có dữ liệu</Typography>
                    </Box>
                ) : contractsData?.items?.map((contract) => {
                    if (!contract.id) return null;
                    const isSelected = contractsMap.has(contract.id);
                    return (
                        <ContractItemCard
                            key={contract.id}
                            selected={isSelected}
                            onClick={() => handleSelectContract(contract)}
                        >
                            <Stack direction="row" spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
                                <Checkbox
                                    size="small"
                                    checked={isSelected}
                                    sx={{ p: 0.5, color: primaryColor, '&.Mui-checked': { color: primaryColor } }}
                                />
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Box className="d-flex justify-content-between" sx={{ width: '100%' }}>
                                        <Typography variant="subtitle2" fontWeight={600} color="#64748b">{contract.cid}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>{contract.signDate ? new Date(contract.signDate).toLocaleDateString('vi-VN') : '-'}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mt={1}>{contract.name}</Typography>
                                </Box>
                                <ArrowForwardIosIcon sx={{ fontSize: 14, color: isSelected ? primaryColor : '#cbd5e1', flexShrink: 0 }} />
                            </Stack>
                        </ContractItemCard>
                    )
                })}
            </Box>
            {(contractsData?.totalItems ?? 0) > size && (
                <Box className="d-flex justify-content-center">
                    <Pagination
                        totalItems={contractsData?.totalItems || 0}
                        page={page}
                        size={size}
                        onChange={(page: number) => setPage(page)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default React.memo(DialogImportDeliveryLeft);
