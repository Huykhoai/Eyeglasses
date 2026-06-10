import React, { useCallback } from "react";
import "./Approvals.css";
import { Box, Typography } from "@mui/material";
import Select from "@/components/common/Select/Select";
import ApprovalIcon from '@mui/icons-material/Approval';
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilters } from "./config/filters";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { useSearchParams } from "react-router-dom";
import Pagination from "@/components/common/Pagination/Pagination";
import ApprovalsTable from "./components/ApprovalsTable";
import { useFetchData } from "./hooks/useFetchData";
import Loading from "@/components/ui/Loading/Loading";
import { useFetchDataById } from "./hooks/useFetchDataById";
import ApprovalsDetail from "./components/ApprovalsPurchaseDetail";
import ApprovalsContractDetail from "./components/ApprovalsContractDetail";
import ApprovalsOtkDetail from "./components/ApprovalsOtkDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { cleanParams } from "@/utils/cleanParams";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";

const DETAIL_COMPONENTS: Record<string, React.FC<any>> = {
    "purchase-quotations": ApprovalsDetail,
    "contracts": ApprovalsContractDetail,
    "otks": ApprovalsOtkDetail,
};

const API_PATH_MAPPING: Record<string, string> = {
    "purchase-quotations": "purchase-quotation",
    "contracts": "contract",
    "otks": "otk",
};

const Approvals: React.FC = () => {

    const queryClient = useQueryClient();
    const { showNotification } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams);


    const idParam = params.id ? parseInt(params.id) : null;
    const typeParam = params.type || "purchase-quotations";
    const pageParam = params.page ? parseInt(params.page) : 1;
    const [page, setPage] = React.useState<number>(pageParam);
    const [size, setSize] = React.useState<number>(20);
    const [filter, setFilter] = React.useState<Record<string, any>>(() => {
        const { page: _p, ...rest } = params;
        return rest;
    });

    const [selectedType, setSelectedType] = React.useState<string>(typeParam);
    const [selectedRow, setSelectedRow] = React.useState<number | null>(idParam);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [dialogData, setDialogData] = React.useState<Record<string, any> | null>(null);

    const { data: approvals, isLoading } = useFetchData(page, size, selectedType, filter);
    const { data: detailById, isLoading: isLoadingDetail } = useFetchDataById(selectedRow as number, API_PATH_MAPPING[selectedType]);
    const categories = getFilters(selectedType);
    const DetailComponent = DETAIL_COMPONENTS[selectedType] || (() => null);

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        let mapper: Record<string, any> = { type: selectedType };
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapper[key] = value.id;
            } else {
                mapper[key] = value;
            }
        });
        setFilter(mapper);
        setSearchParams(mapper, { replace: true });
        setPage(1);
    }, [selectedType, setSearchParams]);

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
        setSearchParams({
            ...filter,
            type: selectedType,
            page: page.toString()
        }, { replace: true });
    }, [filter, selectedType, setSearchParams]);

    const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = Number(e.target.value);
        setSize(size);
        setPage(1);
    }, [setSize, setPage]);

    const handleTypeChange = useCallback((type: string | number) => {
        setSelectedType(type.toString());
        setFilter({});
        setSearchParams({ type: type.toString() }, { replace: true });
        setPage(1);
        setSelectedRow(null);
    }, [setSearchParams]);

    const handleClickItem = useCallback((id: number) => {
        setSelectedRow(id);
    }, []);

    const onApprove = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const params = cleanParams({ type: selectedType, status });
            const response = await axiosClient.post(`/api/approvals/${id}`, params);
            return response.data;
        },
        onSuccess: (response) => {
            if (response.status === 400) {
                showNotification('error', response?.message || 'Lỗi khi phê duyệt', 'Thất bại');
                return;
            }
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            switch (selectedType) {
                case "purchase-quotations":
                    queryClient.invalidateQueries({ queryKey: ['purchase-quotation'] });
                    break;
                case "contracts":
                    queryClient.invalidateQueries({ queryKey: ['contract'] });
                    break;
                case "otks":
                    queryClient.invalidateQueries({ queryKey: ['otk'] });
                    break;
            }
            setSelectedRow(null);
            setOpenDialog(false);
            setDialogData(null);
            showNotification('success', response?.message || 'Thành công', 'Thành công');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Lỗi khi phê duyệt';
            showNotification('error', message, 'Thất bại');
        }
    })
    const handleApprove = useCallback(() => {
        if (!dialogData) return;
        onApprove.mutate({ id: dialogData.id, status: dialogData.status });
    }, [onApprove, dialogData]);

    const openApprovalDialog = useCallback((id: number, status: string) => {
        setDialogData({ id, status });
        setOpenDialog(true);
    }, []);
    return (
        <Box className="approvals-container">
            {(isLoading || isLoadingDetail) && <Loading fullPage message="Đang tải dữ liệu phê duyệt..." />}
            <Box className="approvals-sidebar">
                <Box className="approval-list-header">
                    <Box className="d-flex gap-1 align-items-center justify-content-between w-100">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ApprovalIcon sx={{ color: '#6366f1' }} />
                            <Typography variant="h6" fontWeight="700">Phê duyệt</Typography>
                        </Box>
                        <Select
                            className="w-50"
                            options={[
                                { label: "Yêu cầu báo giá", value: "purchase-quotations" },
                                { label: "Hợp đồng", value: "contracts" },
                                { label: "OTK", value: "otks" },
                            ]}
                            value={selectedType}
                            onChangeSize={handleTypeChange}
                        />
                    </Box>
                    <Box className="w-100 my-2">
                        <MultiFilterBar
                            categories={categories}
                            onFilterChange={handleFilterChange}
                            initialFilters={filter}
                        />
                    </Box>
                    <Box className="d-flex gap-1 align-items-center justify-content-between w-100">
                        <Box className="d-flex gap-1 align-items-center">
                            <Typography variant="caption" fontWeight={600} color="text.secondary">Hiển thị: </Typography>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "auto", fontSize: '0.75rem', border: '', background: 'transparent', fontWeight: 700 }}
                                value={size}
                                onChange={handleSizeChange}
                            >
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </Box>
                        <Typography variant="caption" fontWeight={700} color="primary">Tổng: {approvals?.totalItems || 0}</Typography>
                    </Box>
                </Box>
                <Box className="approval-list-items custom-scrollbar">
                    {approvals?.items?.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                            <ApprovalIcon sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
                            <Typography variant="body1" fontWeight={600}>Không có dữ liệu</Typography>
                        </Box>
                    ) : (
                        <ApprovalsTable data={approvals?.items || []} selected={selectedRow} onChange={handleClickItem} />
                    )}
                </Box>
                {(approvals?.totalItems || 0) > size && (
                    <Box className="d-flex justify-content-center">
                        <Pagination
                            page={page}
                            size={size}
                            totalItems={approvals?.totalItems || 0}
                            onChange={handlePageChange}
                        />
                    </Box>
                )}
            </Box>
            <Box className="approvals-content">
                {!selectedRow ? (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                        <ApprovalIcon sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
                        <Typography variant="body1" fontWeight={600}>Chọn một phiếu để xem chi tiết</Typography>
                    </Box>
                ) : (
                    <>
                        <Box className="approval-detail-header" sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>Thông tin chi tiết</Typography>
                                <Typography variant="caption" color="text.secondary">Đang xem mã: {approvals?.items?.find(i => i.id === selectedRow)?.cid}</Typography>
                            </Box>
                            <Box className="d-flex gap-2">
                                <button
                                    onClick={() => openApprovalDialog(selectedRow as number, 'rejected')}
                                    className="btn btn-outline-danger btn-sm px-3" style={{ borderRadius: '8px', fontWeight: 700 }}>Từ chối</button>
                                <button
                                    onClick={() => openApprovalDialog(selectedRow as number, 'approved')}
                                    className="btn btn-primary btn-sm px-4" style={{ borderRadius: '8px', fontWeight: 700 }}>Phê duyệt</button>
                            </Box>
                        </Box>
                        <Box className="approval-detail-body custom-scrollbar" sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
                            <DetailComponent data={detailById} />
                        </Box>
                    </>
                )}
            </Box>
            <ConfirmDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleApprove}
                title={`Xác nhận ${dialogData?.status === 'approved' ? 'phê duyệt' : 'từ chối'}`}
                content={`Bạn có chắc chắn muốn ${dialogData?.status === 'approved' ? 'phê duyệt' : 'từ chối'} phiếu này?`}
                loading={onApprove.isPending}
            />
        </Box>
    );
};

export default Approvals;