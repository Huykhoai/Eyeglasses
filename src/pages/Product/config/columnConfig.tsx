import { Typography } from '@mui/material';
import type { ProductType, Product, LensProduct, FrameProduct } from '../types/product';
import type { ColumnDef } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import QrProduct from '../components/QRProduct';
const url = import.meta.env.VITE_API_URL;

const commonColumns: (ColumnDef & { groupName?: string, isSticky?: boolean, left?: string, zIndex?: number })[] = [
    {
        key: 'qr',
        header: 'QR',
        align: 'center',
        groupName: 'Thông tin sản phẩm',
        width: '5vw',
        isSticky: true,
        left: '2.8vw',
        zIndex: 12,
        render: (item: Product) => (
            <QrProduct id={item.id} />
        ),
    },
    {
        key: 'cid',
        header: 'Mã Viết Tắt',
        align: 'center',
        groupName: 'Thông tin sản phẩm',
        width: '9vw',
        isSticky: true,
        left: '7.8vw',
        zIndex: 12,
        render: (item: Product) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
        ),
    },
    {
        key: 'imageUrl',
        header: 'Ảnh',
        align: 'center',
        width: '5vw',
        isSticky: true,
        left: '16.745vw',
        zIndex: 12,
        groupName: 'Thông tin sản phẩm',
        render: (item: Product) => (
            <img
                src={url + item.imageUrl}
                alt={item.name}
                style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                }}
            />
        ),
    },
    {
        key: 'name',
        header: 'Tên đầy đủ',
        width: '20vw',
        isSticky: true,
        left: '21.745vw',
        zIndex: 12,
        groupName: 'Thông tin sản phẩm',
        render: (item: Product) => (
            <Typography variant="subtitle2" fontSize={12} fontWeight={600}
                sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left',
                }}>
                {item.name}
            </Typography>
        ),
    },
    {
        key: 'group',
        header: 'Nhóm',
        align: 'center',
        width: '6vw',
        groupName: 'Thông tin chung',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12} textAlign="left">{item.group?.name || '-'}</Typography>
        ),
    },
    {
        key: 'brand',
        header: 'Thương hiệu',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12} textAlign="left">{item.brand?.name || '-'}</Typography>
        ),
    },
    {
        key: 'supplier',
        header: 'Nhà cung cấp',
        align: 'center',
        width: "13vw",
        groupName: 'Thông tin chung',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12} textAlign="left">{item.supplier?.name || '-'}</Typography>
        ),
    },
    {
        key: 'country',
        header: 'Quốc gia',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>{item.country?.name || '-'}</Typography>
        ),
    },
    {
        key: 'unit',
        header: 'Đơn vị',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>{item.unit || '-'}</Typography>
        ),
    },
    {
        key: 'statusProduct',
        header: 'Trạng thái',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: Product) => {
            const name = item.statusProduct?.name || '-';
            const status = item.statusProduct?.id === 1 ? 'success' : item.statusProduct?.id === 2 ? 'warning' : 'danger';
            return (
                <Typography className={`badge-chip badge-${status}`} variant="body2" fontSize={9}>
                    {name}
                </Typography>
            );
        }
    },
    {
        key: 'originalPrice',
        header: 'Nguyên tệ',
        align: 'right',
        groupName: 'Thông tin giá',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                {formatPrice(item.originalPrice)}
            </Typography>
        ),
    },
    {
        key: 'currency',
        header: 'Đơn vị',
        align: 'center',
        groupName: 'Thông tin giá',
        render: (item: Product) => (
            <Typography className="badge-chip badge-neutral" variant="body2" fontSize={9}>
                {item.currency?.cid || '-'}
            </Typography>
        ),
    },
    {
        key: 'tax',
        header: 'Thuế',
        align: 'center',
        groupName: 'Thông tin giá',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>
                {item.tax || '-'}%
            </Typography>
        ),
    },
    {
        key: 'warrantySupplier',
        header: 'BH Hãng',
        width: '6vw',
        groupName: 'Thông tin giá',
        render: (item: Product) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.warrantySupplier?.name || '-'}</Typography>
        ),
    },
    {
        key: 'warranty',
        header: 'BH Công ty',
        groupName: 'Thông tin giá',
        render: (item: Product) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.warranty?.name || '-'}</Typography>
        ),
    },
    {
        key: 'warrantyRetail',
        header: 'BH Bán lẻ',
        groupName: 'Thông tin giá',
        render: (item: Product) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.warrantyRetail?.name || '-'}</Typography>
        ),
    },
];

const lensColumns: (ColumnDef & { groupName?: string })[] = [
    {
        key: 'diameter',
        header: 'Đường kính',
        groupName: 'Kích thước',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12} align="center">
                {item.lensAttribute?.diameter + 'mm' || '-'}
            </Typography>
        ),
    },
    {
        key: 'material',
        header: 'Vật liệu',
        groupName: 'Chất liệu',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>
                {item.lensAttribute?.material?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'refractiveIndex',
        header: 'Chiết suất',
        groupName: 'Chất liệu',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>
                {item.lensAttribute?.refractiveIndex?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'prescription',
        header: 'Độ (S/C/A)',
        groupName: 'Thông số',
        render: (item: LensProduct) => {
            const attr = item.lensAttribute;
            if (!attr) return '-';
            const parts = [];
            if (attr.sph != null) parts.push(`S${attr.sph.toFixed(2)}`);
            if (attr.cyl != null) parts.push(`C${attr.cyl.toFixed(2)}`);
            if (attr.lenAdd != null) parts.push(`A${attr.lenAdd.toFixed(2)}`);
            return <Typography variant="body2" fontSize={11} fontFamily="monospace">{parts.join('/') || '-'}</Typography>;
        },
    },
    {
        key: 'design1',
        header: 'Thiết kế 1',
        groupName: 'Thiết kế',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>
                {item.lensAttribute?.design1?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'design2',
        header: 'Thiết kế 2',
        groupName: 'Thiết kế',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>
                {item.lensAttribute?.design2?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'uv',
        header: 'UV',
        groupName: 'Tích hợp',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.lensAttribute?.uv?.name || '-'}</Typography>
        ),
    },
    {
        key: 'coating',
        header: 'Lớp phủ',
        width: '5vw',
        groupName: 'Tích hợp',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.lensAttribute?.coating?.name || '-'}</Typography>
        ),
    },
    {
        key: "hmcColor",
        header: "HMC",
        groupName: 'Tích hợp',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.lensAttribute?.hmcColor?.name || '-'}</Typography>
        ),
    },
    {
        key: "phoColor",
        header: "PHO",
        groupName: 'Tích hợp',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.lensAttribute?.phoColor?.name || '-'}</Typography>
        ),
    },
    {
        key: "tintColor",
        header: "Tint",
        groupName: 'Tích hợp',
        render: (item: LensProduct) => (
            <Typography variant="body2" align='left' fontSize={11}>{item.lensAttribute?.tintColor?.name || '-'}</Typography>
        ),
    }
];

const frameColumns: (ColumnDef & { groupName?: string })[] = [
    {
        key: 'serial',
        header: 'Serial',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => (
            <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>
                {item.frameAttribute?.serial || '-'}
            </span>
        ),
    },
    {
        key: 'model',
        header: 'Model',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => (
            <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>
                {item.frameAttribute?.model || '-'}
            </span>
        ),
    },
    {
        key: 'colorCode',
        header: 'Mã màu',
        width: '6vw',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.colorCode || '-'}</Typography>
        ),
    },
    {
        key: 'gender',
        header: 'Giới tính',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => {
            const genderId = item.frameAttribute?.gender;
            let label = '-';
            let variant = 'badge-neutral';
            if (genderId === 1) { label = 'Nam'; variant = 'badge-info'; }
            else if (genderId === 2) { label = 'Nữ'; variant = 'badge-warning'; }
            else if (genderId === 3) { label = 'Unisex'; variant = 'badge-success'; }
            return <span className={`badge-chip ${variant}`} style={{ fontSize: 10 }}>{label}</span>;
        },
    },
    {
        key: 'dimensions',
        header: 'Kích thước',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => {
            const attr = item.frameAttribute;
            if (!attr) return '-';
            return (
                <Typography variant="body2" fontSize={11} fontFamily="monospace" whiteSpace="nowrap">
                    {attr.lensHeight}□{attr.lensWidth}-{attr.bridgeWidth}
                </Typography>
            );
        },
    },
    {
        key: 'frame',
        header: 'Kiểu gọng',
        width: '6vw',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>
                {item.frameAttribute?.frame?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'frameType',
        header: 'Loại gọng',
        width: '7vw',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>
                {item.frameAttribute?.frameType?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'shape',
        header: 'Hình dáng',
        width: '6vw',
        groupName: 'Kiểu dáng & Kích thước',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>
                {item.frameAttribute?.shape?.name || '-'}
            </Typography>
        ),
    },
    {
        key: "ve",
        header: "Ve",
        width: "5vw",
        groupName: "Chất liệu & thành phần",
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>
                {item.frameAttribute?.ve?.name || '-'}
            </Typography>
        ),
    },
    {
        key: "temple",
        header: "Càng kính",
        groupName: "Chất liệu & thành phần",
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>
                {item.frameAttribute?.temple?.name || '-'}
            </Typography>
        ),
    },
    {
        key: "coating",
        header: "Lớp phủ",
        width: "6vw",
        groupName: "Chất liệu & thành phần",
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>
                {item.frameAttribute?.coating?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'materialFront',
        header: 'Mặt trước',
        width: '6vw',
        groupName: 'Chất liệu & thành phần',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.materialFront?.name || '-'}</Typography>
        ),
    },
    {
        key: 'materialTemple',
        header: 'Càng kính',
        groupName: 'Chất liệu & thành phần',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.materialTemple?.name || '-'}</Typography>
        ),
    },
    {
        key: 'materialVe',
        header: 'Ve',
        groupName: 'Chất liệu & thành phần',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.materialVe?.name || '-'}</Typography>
        ),
    },
    {
        key: 'materialTempleTip',
        header: 'Đuôi càng',
        width: '6vw',
        groupName: 'Chất liệu & thành phần',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.materialTempleTip?.name || '-'}</Typography>
        ),
    },
    {
        key: 'materialLens',
        header: 'Mắt kính',
        width: '6vw',
        groupName: 'Chất liệu & thành phần',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.materialLens?.name || '-'}</Typography>
        ),
    },
    {
        key: 'colorFront',
        header: 'Màu mặt',
        groupName: 'Màu sắc',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.colorFront?.name || '-'}</Typography>
        ),
    },
    {
        key: 'colorTemple',
        header: 'Màu càng',
        groupName: 'Màu sắc',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.colorTemple?.name || '-'}</Typography>
        ),
    },
    {
        key: 'colorLens',
        header: 'Màu mắt',
        groupName: 'Màu sắc',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={11}>{item.frameAttribute?.colorLens?.name || '-'}</Typography>
        ),
    },
];

export const getColumnsForType = (type: ProductType): ColumnDef[] => {
    const base = [...commonColumns];

    switch (type) {
        case 'LENS':
            return [...base, ...lensColumns];
        case 'FRAME':
            return [...base, ...frameColumns];
        default:
            return base;
    }
};
