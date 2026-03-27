import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import './Quote.css';
import Loading from "@/components/ui/Loading/Loading";
import Button from "@/components/common/Button/Button";
import MultiFilterBar from "@/components/common/MultiFilterBar/MultiFilterBar";
import { getFilterQuote } from "./config/filterQuote";
import Select from "@/components/common/Select/Select";

const Quote: React.FC = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlFilters = useMemo(() => {
        const obj: Record<string, any> = {};
        Object.entries(searchParams).forEach(([key, value]) => {
            obj[key] = value;
        })
        return obj;
    }, [searchParams]);

    const [filter, setFilter] = useState<Record<string, any>>(urlFilters);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const categories = useMemo(() => getFilterQuote(), []);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Supplier | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        let mapperFilter: Record<string, any> = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                mapperFilter[key] = value.id;
            } else {
                mapperFilter[key] = value;
            }
        });
        setFilter(mapperFilter);
        setSearchParams(mapperFilter, { replace: true });
        setPage(1);
     },[setSearchParams])

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
     }

    const handleCloseMenu = () => {
        setAnchorEl(null);
     }

    const handleAdd = () => {
        setOpenDialog(true);
        setSelectedItem(null);
     }
    return (
        <div className="quote-page-wapper">
            {/* {isLoading && <Loading fullPage message="Đang tải dữ liệu..." />} */}
        <div className="quote-header">
            <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
            >
                Quay lại
            </Button>
            <div className="quote-filter-section">
                <MultiFilterBar
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    initialFilters={urlFilters}
                />
            </div>
            <div style={{minWidth: 80}}>
                <Select
                    value={size}
                    options={[
                        { label: '20', value: 20 },
                        { label: '50', value: 50 },
                        { label: '100', value: 100 },
                    ]}
                    onChangeSize={(value) => setSize(Number(value))}
                />
            </div>
            <Button
                variant="primary"
                onClick={handleAdd}
            >
                Thêm báo giá
            </Button>
        </div>
        </div>
    );
};

export default Quote;