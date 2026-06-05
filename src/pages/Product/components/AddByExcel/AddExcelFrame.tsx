import React, { useState, useCallback, useMemo } from 'react';
import Button from '@/components/common/Button/Button';
import './AddExcelProduct.css';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, LinearProgress, Alert, AlertTitle, Tooltip } from '@mui/material';
import {
    Download as DownloadIcon,
    Upload as UploadIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    CloudUpload as CloudUploadIcon,
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    Visibility as ViewIcon,
    QrCode as QrCodeIcon,
} from '@mui/icons-material';
import exportExcelFrameTemplate from './ExcelImportFrame';
import { readFrameExcel } from './excelFrameReader';
import { buildLookupMap } from './excelLensReader';
import type { ExcelFrameReadResult, CategoryMapsFrame, ImageMapping } from './Config/types';
import {
    useBrand,
    useGroup,
    useSupplier,
    useCountry,
    useCurrency,
    useMaterial,
    useCoating,
    useColor,
    useWarranty,
    useFrame,
    useFrameType,
    useShape,
    useVe,
    useTemple,
} from '@/hooks/UseAllData';
import StepIndicator from './Components/StepIndicator';
import ErrorRow from './Components/ErrorRow';
import ImageMapCard from './Components/ImageMapCard';
import TableProductFrame from './Components/TableProductFrame';
import { useNotification } from '@/components/ui/Notification/NotificationContext';
import axiosClient from '@/api/axiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '@/components/ui/Loading/Loading';

const TOTAL_STEPS = 5;

const AddExcelFrame: React.FC = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();

    const [currentStep, setCurrentStep] = useState(1);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [readResult, setReadResult] = useState<ExcelFrameReadResult | null>(null);
    const [imageMappings, setImageMappings] = useState<ImageMapping[]>([]);
    const [showAllErrors, setShowAllErrors] = useState(false);

    const { data: groups } = useGroup();
    const { data: brands } = useBrand();
    const { data: suppliers } = useSupplier();
    const { data: countries } = useCountry();
    const { data: currencies } = useCurrency();
    const { data: materials } = useMaterial();
    const { data: coatings } = useCoating();
    const { data: colors } = useColor();
    const { data: warranties } = useWarranty();
    const { data: frames } = useFrame();
    const { data: frameTypes } = useFrameType();
    const { data: shapes } = useShape();
    const { data: ves } = useVe();
    const { data: temples } = useTemple();

    const buildCategoryMaps = useCallback((): CategoryMapsFrame => ({
        group: buildLookupMap(groups),
        brand: buildLookupMap(brands),
        supplier: buildLookupMap(suppliers),
        country: buildLookupMap(countries),
        currency: buildLookupMap(currencies),
        material: buildLookupMap(materials),
        coating: buildLookupMap(coatings),
        color: buildLookupMap(colors),
        warranty: buildLookupMap(warranties),
        frame: buildLookupMap(frames),
        frameType: buildLookupMap(frameTypes),
        shape: buildLookupMap(shapes),
        ve: buildLookupMap(ves),
        temple: buildLookupMap(temples),
        gender: buildLookupMap([{ id: 1, cid: '1', name: "Nam" }, { id: 2, cid: '2', name: "Nữ" }, { id: 3, cid: '3', name: "Unisex" }])
    }), [groups, brands, suppliers, countries, currencies, materials, coatings, colors, warranties, frames, frameTypes, shapes, ves, temples]);

    const handleDownloadTemplate = useCallback(async () => {
        await exportExcelFrameTemplate();
    }, []);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setExcelFile(file);
        setIsProcessing(true);

        try {
            const maps = buildCategoryMaps();
            const result = await readFrameExcel(file, maps);
            setReadResult(result);

            setImageMappings(
                result.uniqueImageNames.map((name) => ({
                    name,
                    file: null,
                    previewUrl: null,
                }))
            );

            setCurrentStep(2);
        } catch (err) {
            showNotification('error', 'Lỗi đọc Excel', 'Lỗi');
        } finally {
            setIsProcessing(false);
        }
    }, [buildCategoryMaps, showNotification]);

    const handleImageFileSelect = useCallback((name: string, file: File) => {
        const url = URL.createObjectURL(file);
        setImageMappings((prev) =>
            prev.map((m) => (m.name === name ? { ...m, file, previewUrl: url } : m))
        );
    }, []);

    const handleImageRemove = useCallback((name: string) => {
        setImageMappings((prev) =>
            prev.map((m) => {
                if (m.name === name) {
                    if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
                    return { ...m, file: null, previewUrl: null };
                }
                return m;
            })
        );
    }, []);

    const handleReset = useCallback(() => {
        setCurrentStep(1);
        setExcelFile(null);
        setReadResult(null);
        setImageMappings([]);
        setShowAllErrors(false);
    }, []);

    const { mutateAsync: handleGenerateCid, isPending: isGeneratingCid } = useMutation({
        mutationFn: async () => {
            if (!readResult) return;
            const validRows = readResult.rows.filter((r) => r.isValid);
            const cids = validRows.map((r) => r.dto?.cid);
            const response = await axiosClient.post('/api/product/generate-cid', cids);
            return response.data;
        },
        onSuccess: (data: any) => {
            setReadResult((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    rows: prev.rows.map((r, idx) => {
                        if (!r.isValid || !r.dto) return r;
                        return {
                            ...r,
                            dto: {
                                ...r.dto,
                                cid: data[idx] || r.dto.cid
                            }
                        }
                    }),
                };
            });
            setCurrentStep(5);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Lỗi tạo CID';
            showNotification('error', message, 'Lỗi tạo mã sản phẩm');
        }
    });

    const validRows = useMemo(() => readResult?.rows.filter((r) => r.isValid) ?? [], [readResult]);

    const { mutateAsync: handleSubmit, isPending: isSubmitting } = useMutation({
        mutationFn: async () => {
            if (!readResult) return;

            const formData = new FormData();

            formData.append('products', new Blob([JSON.stringify(validRows.map(r => r.dto))],
                { type: 'application/json' }));
            imageMappings.forEach(mapping => {
                if (mapping.file) {
                    formData.append('images', mapping.file);
                }
            });
            return await axiosClient.post('/api/product/save-all', formData);
        },
        onSuccess: (response: any) => {
            if (response.data.status === 400) {
                showNotification('error', response.data.message, 'Lỗi tạo sản phẩm');
                return;
            }
            showNotification('success', 'Tạo sản phẩm thành công', 'Thành công');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate(-1);
            handleReset();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Lỗi tạo CID';
            showNotification('error', message, 'Lỗi tạo mã sản phẩm');
        }
    });

    const errorRows = useMemo(() => readResult?.rows.filter((r) => !r.isValid) ?? [], [readResult]);
    const displayedErrors = useMemo(() => showAllErrors ? errorRows : errorRows.slice(0, 5), [showAllErrors, errorRows]);
    const allImagesMapped = useMemo(() => imageMappings.length > 0 && imageMappings.every((m) => m.file !== null && m.file.name.includes(m.name)), [imageMappings]);

    const imagePreviewMap = useMemo(() => {
        const map: Record<string, string> = {};
        imageMappings.forEach((m) => {
            if (m.previewUrl) map[m.name] = m.previewUrl;
        });
        return map;
    }, [imageMappings]);


    return (
        <div className="from-excel-product-container">
            <div className="from-excel-product-header">
                <Box className="d-flex align-items-center gap-2">
                    <Button variant="outline" onClick={() => navigate('/product')}>
                        Quay lại
                    </Button>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Thêm sản phẩm gọng bằng Excel
                    </Typography>
                </Box>
                <Box className="d-flex align-items-center gap-2">
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <DownloadIcon fontSize="small" />
                        Tải file mẫu
                    </Button>
                    <input
                        id="excel-file-input"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        hidden
                    />
                    {(currentStep === 4 || currentStep === 5) && (
                        <Button
                            variant='outline'
                            onClick={() => handleGenerateCid()}
                            disabled={!readResult}
                        >
                            <QrCodeIcon fontSize="small" />
                            Tạo mã CID
                        </Button>
                    )}
                    {(currentStep === 4 || currentStep === 5) && (
                        <Button
                            variant="primary"
                            onClick={() => handleSubmit()}
                            disabled={validRows.length === 0 || currentStep !== 5 || isSubmitting}
                        >
                            <UploadIcon fontSize="small" />
                            Xác nhận tạo {validRows.length} sản phẩm
                        </Button>
                    )}
                </Box>
            </div>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '10px 32px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <StepIndicator key={i + 1} step={i + 1} currentStep={currentStep} totalSteps={TOTAL_STEPS} />
                ))}
            </Box>

            {currentStep === 1 && (
                <div className="excel-upload-section">
                    <label className="excel-dropzone" htmlFor="excel-file-input">
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#6366f1' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                            Kéo thả file Excel vào đây
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            hoặc nhấn để chọn file (.xlsx, .xls)
                        </Typography>
                    </label>
                    {isProcessing && (
                        <Box sx={{ mt: 2, width: '100%' }}>
                            <LinearProgress />
                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                Đang đọc và kiểm tra dữ liệu...
                            </Typography>
                        </Box>
                    )}
                </div>
            )}

            {currentStep === 2 && readResult && (
                <div className="excel-validation-section">
                    <div className="validation-summary">
                        <div className="summary-card summary-card--total">
                            <FileIcon sx={{ fontSize: 28 }} />
                            <div>
                                <div className="summary-value">{readResult.totalRows}</div>
                                <div className="summary-label">Tổng dòng</div>
                            </div>
                        </div>
                        <div className="summary-card summary-card--valid">
                            <CheckIcon sx={{ fontSize: 28 }} />
                            <div>
                                <div className="summary-value">{readResult.validRows}</div>
                                <div className="summary-label">Hợp lệ</div>
                            </div>
                        </div>
                        <div className="summary-card summary-card--invalid">
                            <ErrorIcon sx={{ fontSize: 28 }} />
                            <div>
                                <div className="summary-value">{readResult.invalidRows}</div>
                                <div className="summary-label">Có lỗi</div>
                            </div>
                        </div>
                        <div className="summary-card summary-card--image">
                            <ImageIcon sx={{ fontSize: 28 }} />
                            <div>
                                <div className="summary-value">{readResult.uniqueImageNames.length}</div>
                                <div className="summary-label">Ảnh cần ghép</div>
                            </div>
                        </div>
                    </div>

                    <div className="file-info-bar">
                        <FileIcon fontSize="small" />
                        <span>{excelFile?.name}</span>
                        <Chip
                            label={readResult.invalidRows === 0 ? 'Tất cả hợp lệ ✓' : `${readResult.invalidRows} dòng lỗi`}
                            size="small"
                            color={readResult.invalidRows === 0 ? 'success' : 'error'}
                        />
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            style={{ marginLeft: 'auto' }}
                        >
                            Chọn file khác
                        </Button>
                    </div>

                    {errorRows.length > 0 && (
                        <div className="error-list-section">
                            <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
                                <AlertTitle>Một số dòng chứa dữ liệu không hợp lệ</AlertTitle>
                                Vui lòng kiểm tra và sửa lại trong file Excel, sau đó tải lên lại. Các dòng lỗi sẽ bị bỏ qua nếu bạn tiếp tục.
                            </Alert>
                            {displayedErrors.map((r: any) => (
                                <ErrorRow key={r.rowIndex} result={r} />
                            ))}
                            {errorRows.length > 5 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAllErrors(!showAllErrors)}
                                    style={{ width: '100%', marginTop: '8px' }}
                                >
                                    {showAllErrors ? 'Thu gọn' : `Xem tất cả ${errorRows.length} dòng lỗi`}
                                </Button>
                            )}
                        </div>
                    )}

                    {readResult.validRows > 0 && (
                        <Box className="d-flex justify-content-end gap-2" sx={{ mt: 1 }}>
                            <Button variant="primary" onClick={() => setCurrentStep(3)}>
                                Tiếp tục ghép ảnh ({readResult.validRows} sản phẩm)
                            </Button>
                        </Box>
                    )}
                </div>
            )}

            {currentStep === 3 && readResult && (
                <div className="excel-image-section">
                    <Alert severity="info" sx={{ borderRadius: '12px', mb: 2 }}>
                        <AlertTitle>Ghép ảnh sản phẩm</AlertTitle>
                        Hệ thống phát hiện <b>{readResult.totalRows}</b> sản phẩm sử dụng{' '}
                        <b>{imageMappings.length}</b> mẫu ảnh. Vui lòng tải lên ảnh tương ứng với từng tên bên dưới.
                    </Alert>

                    {imageMappings.length === 0 ? (
                        <Alert severity="success" sx={{ borderRadius: '12px' }}>
                            Không có sản phẩm nào cần ảnh. Bạn có thể tiếp tục.
                        </Alert>
                    ) : (
                        <div className="image-map-grid">
                            {imageMappings.map((m) => (
                                <ImageMapCard
                                    key={m.name}
                                    mapping={m}
                                    onFileSelect={handleImageFileSelect}
                                    onRemove={handleImageRemove}
                                />
                            ))}
                        </div>
                    )}

                    <Box className="d-flex justify-content-between align-items-center" sx={{ mt: 3 }}>
                        <Button variant="outline" onClick={() => setCurrentStep(2)}>
                            Quay lại
                        </Button>
                        <Tooltip title={!allImagesMapped && imageMappings.length > 0 ? 'Vui lòng ghép đủ ảnh trước khi tiếp tục' : ''}>
                            <span>
                                <Button
                                    variant="primary"
                                    disabled={!allImagesMapped && imageMappings.length > 0}
                                    onClick={() => setCurrentStep(4)}
                                >
                                    <ViewIcon fontSize="small" />
                                    Xem trước danh sách sản phẩm
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>
                </div>
            )}

            {(currentStep === 4 || currentStep === 5) && readResult && (
                <div className="excel-preview-section">
                    {(isGeneratingCid || isSubmitting) && <Loading fullPage message={isGeneratingCid ? 'Đang tạo mã CID cho sản phẩm...' : 'Đang tạo sản phẩm...'} />}
                    <TableProductFrame
                        rows={validRows}
                        imagePreviewMap={imagePreviewMap}
                        categoryMaps={buildCategoryMaps()}
                    />

                    <Box className="d-flex justify-content-between align-items-center" sx={{ mt: 3 }}>
                        <Button variant="outline" onClick={() => setCurrentStep(3)}>
                            Quay lại
                        </Button>
                    </Box>
                </div>
            )}
        </div>
    );
};

export default AddExcelFrame;
