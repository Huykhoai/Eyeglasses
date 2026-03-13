import { Typography } from '@mui/material';
import type { ProductType, Product, LensProduct, FrameProduct } from '../types/product';
import type { ColumnDef } from '@/types';

const formatPrice = (value: number | null | undefined): string => {
    if (value == null) return '-';
    return value.toLocaleString('vi-VN') + 'đ';
};

const commonColumns: ColumnDef[] = [
    {
        key: 'imageUrl',
        header: 'Ảnh',
        width: '60px',
        render: (item: Product) => (
            <img
                src={item.imageUrl}
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
        key: 'cid',
        header: 'Mã SP',
        width: '120px',
        render: (item: Product) => (
            <span className="badge-chip badge-info">{item.cid}</span>
        ),
    },
    {
        key: 'name',
        header: 'Tên sản phẩm',
        width: '200px',
        render: (item: Product) => (
            <div>
                <Typography variant="subtitle2" fontSize={12} fontWeight={600} noWrap>
                    {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize={10} noWrap>
                    {item.engName}
                </Typography>
            </div>
        ),
    },
    {
        key: 'brand',
        header: 'Thương hiệu',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>{item.brand?.name || '-'}</Typography>
        ),
    },
    {
        key: 'group',
        header: 'Nhóm',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>{item.group?.name || '-'}</Typography>
        ),
    },
    {
        key: 'country',
        header: 'Xuất xứ',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>{item.country?.name || '-'}</Typography>
        ),
    },
    {
        key: 'unit',
        header: 'Đơn vị',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12}>{item.unit || '-'}</Typography>
        ),
    },
    {
        key: 'originalPrice',
        header: 'Giá gốc',
        render: (item: Product) => (
            <Typography variant="body2" fontSize={12} fontWeight={600} color="#16a34a">
                {formatPrice(item.originalPrice)}
            </Typography>
        ),
    },
    {
        key: 'statusProduct',
        header: 'Trạng thái',
        render: (item: Product) => {
            const status = item.statusProduct?.name || '-';
            return <span className="badge-chip badge-success">{status}</span>;
        },
    },
];

const lensColumns: ColumnDef[] = [
    {
        key: 'refractiveIndex',
        header: 'Chiết suất',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12}>
                {item.lensAttribute?.refractiveIndex?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'sph',
        header: 'SPH',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12} fontFamily="monospace">
                {item.lensAttribute?.sph != null ? item.lensAttribute.sph.toFixed(2) : '-'}
            </Typography>
        ),
    },
    {
        key: 'cyl',
        header: 'CYL',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12} fontFamily="monospace">
                {item.lensAttribute?.cyl != null ? item.lensAttribute.cyl.toFixed(2) : '-'}
            </Typography>
        ),
    },
    {
        key: 'lenAdd',
        header: 'ADD',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12} fontFamily="monospace">
                {item.lensAttribute?.lenAdd != null ? item.lensAttribute.lenAdd.toFixed(2) : '-'}
            </Typography>
        ),
    },
    {
        key: 'design',
        header: 'Thiết kế',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12}>
                {item.lensAttribute?.design1?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'material',
        header: 'Vật liệu',
        render: (item: LensProduct) => (
            <Typography variant="body2" fontSize={12}>
                {item.lensAttribute?.material?.name || '-'}
            </Typography>
        ),
    },
];

const frameColumns: ColumnDef[] = [
    {
        key: 'model',
        header: 'Model',
        render: (item: FrameProduct) => (
            <span className="badge-chip badge-neutral">
                {item.frameAttribute?.model || '-'}
            </span>
        ),
    },
    {
        key: 'serial',
        header: 'Serial',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={12} fontFamily="monospace">
                {item.frameAttribute?.serial || '-'}
            </Typography>
        ),
    },
    {
        key: 'shape',
        header: 'Hình dạng',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={12}>
                {item.frameAttribute?.shape?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'frameType',
        header: 'Loại gọng',
        render: (item: FrameProduct) => (
            <Typography variant="body2" fontSize={12}>
                {item.frameAttribute?.frameType?.name || '-'}
            </Typography>
        ),
    },
    {
        key: 'gender',
        header: 'Giới tính',
        render: (item: FrameProduct) => {
            const isMale = item.frameAttribute?.gender;
            return (
                <span className={`badge-chip ${isMale ? 'badge-info' : 'badge-warning'}`}>
                    {isMale ? 'Nam' : 'Nữ'}
                </span>
            );
        },
    },
    {
        key: 'dimensions',
        header: 'Kích thước',
        render: (item: FrameProduct) => {
            const attr = item.frameAttribute;
            if (!attr) return '-';
            return (
                <Typography variant="body2" fontSize={11} fontFamily="monospace" whiteSpace="nowrap">
                    {attr.eyeLength}□{attr.bridgeWidth}-{attr.templeLength}
                </Typography>
            );
        },
    },
];

export const getColumnsForType = (type: ProductType): ColumnDef[] => {
    const base = [...commonColumns];

    switch (type) {
        case 'LENS':
            return [...base, ...lensColumns];
        case 'FRAME':
            return [...base, ...frameColumns];
        case 'ACCESSORY':
            return base;
        default:
            return base;
    }
};
