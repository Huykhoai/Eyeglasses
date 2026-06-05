import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import { formatPrice } from "@/utils/formatPrice";
import type { CategoryMaps, RowValidationResult, CategoryMapsFrame, RowValidationFrameResult } from "./types";
export const columns = (imagePreviewMap: Record<string, string>, categoryMaps: CategoryMaps): ColumnDef[] => {
    const getNameById = (map: Record<string, any>, id: number | undefined) => {
        if (!id) return '';
        const item = Object.values(map).find((v: any) => v.id === id);
        return item ? item.name : '';
    };

    const renderText2Lines = (text: string | undefined) => (
        <Typography title={text} variant="subtitle2" fontSize={12}
            sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left',
            }}>
            {text || ''}
        </Typography>
    );

    return [
        {
            key: 'rowIndex',
            header: '#',
            width: '3vw',
            render: (_, index) => (
                <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                    {(index ?? 0) + 1}
                </Typography>
            )
        },
        {
            key: 'Image',
            header: 'Ảnh',
            width: '5vw',
            align: 'center',
            render: (item: RowValidationResult) => (
                item.dto?.imageUrl && imagePreviewMap[item.dto.imageUrl] ? (
                    <img
                        src={imagePreviewMap[item.dto.imageUrl]}
                        alt={item.dto.imageUrl}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : (
                    <ImageIcon sx={{ fontSize: 24, color: '#9ca3af' }} />
                )
            )
        },
        {
            key: 'CID',
            header: 'Mã SP',
            width: '9vw',
            align: 'center',
            render: (item: RowValidationResult) => (
                <span className="badge-chip badge-info">{item.dto?.cid}</span>
            )
        },
        {
            key: 'Group',
            header: 'Nhóm',
            width: '6vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.group, item.dto?.groupId)
        },
        {
            key: 'FullName',
            header: 'Tên sản phẩm',
            width: '15vw',
            render: (item: RowValidationResult) => renderText2Lines(item.dto?.name)
        },
        {
            key: 'Unit',
            header: 'ĐVT',
            width: '5vw',
            render: (item: RowValidationResult) => item.dto?.unit
        },
        {
            key: 'Brand',
            header: 'Thương hiệu',
            width: '10vw',
            render: (item: RowValidationResult) => renderText2Lines(getNameById(categoryMaps.brand, item.dto?.brandId))
        },
        {
            key: 'Supplier',
            header: 'Nhà cung cấp',
            width: '10vw',
            render: (item: RowValidationResult) => renderText2Lines(getNameById(categoryMaps.supplier, item.dto?.supplierId))
        },
        {
            key: 'Country',
            header: 'Quốc gia',
            width: '8vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.country, item.dto?.countryId)
        },
        {
            key: 'SPH',
            header: 'SPH',
            width: '5vw',
            align: 'right',
            render: (item: RowValidationResult) => item.dto?.lensAttribute?.sph
        },
        {
            key: 'CYL',
            header: 'CYL',
            width: '5vw',
            align: 'right',
            render: (item: RowValidationResult) => item.dto?.lensAttribute?.cyl
        },
        {
            key: 'ADD',
            header: 'ADD',
            width: '5vw',
            align: 'right',
            render: (item: RowValidationResult) => item.dto?.lensAttribute?.lenAdd
        },
        {
            key: 'Diameter',
            header: 'Đường kính',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationResult) => item.dto?.lensAttribute?.diameter
        },
        {
            key: 'Design1',
            header: 'Thiết kế 1',
            width: '6vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.design, item.dto?.lensAttribute?.design1Id)
        },
        {
            key: 'Design2',
            header: 'Thiết kế 2',
            width: '6vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.design, item.dto?.lensAttribute?.design2Id)
        },
        {
            key: 'Material',
            header: 'Chất liệu',
            width: '7vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.material, item.dto?.lensAttribute?.materialId)
        },
        {
            key: 'Refractive_Index',
            header: 'Chiết suất',
            width: '8vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.refractiveIndex, item.dto?.lensAttribute?.refractiveIndexId)
        },
        {
            key: 'UV',
            header: 'Chống UV',
            width: '8vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.uv, item.dto?.lensAttribute?.uvId)
        },
        {
            key: 'Coating',
            header: 'Lớp phủ',
            width: '7vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.coating, item.dto?.lensAttribute?.coatingId)
        },
        {
            key: 'HMC',
            header: 'Ánh mạ',
            width: '7vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.color, item.dto?.lensAttribute?.hmcColorId)
        },
        {
            key: 'PHO',
            header: 'Đổi màu',
            width: '7vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.color, item.dto?.lensAttribute?.phoColorId)
        },
        {
            key: 'TIND',
            header: 'Mạ màu',
            width: '7vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.color, item.dto?.lensAttribute?.tintColorId)
        },
        {
            key: 'Supplier_Warranty',
            header: 'BH NCC',
            width: '8vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.warranty, item.dto?.warrantySupplierId)
        },
        {
            key: 'Warranty',
            header: 'Bảo hành',
            width: '8vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.warranty, item.dto?.warrantyId)
        },
        {
            key: 'Warranty_Retail',
            header: 'BH bán lẻ',
            width: '8vw',
            render: (item: RowValidationResult) => getNameById(categoryMaps.warranty, item.dto?.warrantyRetailId)
        },
        {
            key: 'Currency',
            header: 'Tiền tệ',
            width: '5vw',
            align: 'center',
            render: (item: RowValidationResult) => getNameById(categoryMaps.currency, item.dto?.currencyId)
        },
        {
            key: 'Original_Price',
            header: 'Giá gốc',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationResult) => (
                <span className="cell-price">{formatPrice(item.dto?.originalPrice || 0)}</span>
            )
        },
        {
            key: 'Retail_Price',
            header: 'Giá bán lẻ',
            width: '8vw',
            align: 'right',
            render: (item: RowValidationResult) => (
                <span className="cell-price">{formatPrice(item.dto?.retailPrice || 0)}</span>
            )
        },
        {
            key: 'Tax',
            header: 'Thuế',
            width: '5vw',
            align: 'right',
            render: (item: RowValidationResult) => (
                <span className="cell-price">{formatPrice(item.dto?.tax || 0) + '%'}</span>
            )
        },
        {
            key: 'Use',
            header: 'Công dụng',
            width: '12vw',
            render: (item: RowValidationResult) => renderText2Lines(item.dto?.uses)
        },
        {
            key: 'Guide',
            header: 'Hướng dẫn sử dụng',
            width: '12vw',
            render: (item: RowValidationResult) => renderText2Lines(item.dto?.guide)
        },
        {
            key: 'Warning',
            header: 'Cảnh báo',
            width: '12vw',
            render: (item: RowValidationResult) => renderText2Lines(item.dto?.warning)
        },
        {
            key: 'Preserve',
            header: 'Bảo quản',
            width: '12vw',
            render: (item: RowValidationResult) => renderText2Lines(item.dto?.preserve)
        },
        {
            key: 'Note',
            header: 'Ghi chú',
            width: '12vw',
            render: (item: RowValidationResult) => renderText2Lines(item.dto?.note)
        }
    ];
}

export const columnsFrame = (imagePreviewMap: Record<string, string>, categoryMaps: CategoryMapsFrame): ColumnDef[] => {
    const getNameById = (map: Record<string, any>, id: number | undefined) => {
        if (!id) return '';
        const item = Object.values(map).find((v: any) => v.id === id);
        return item ? item.name : '';
    };

    const renderText2Lines = (text: string | undefined) => (
        <Typography variant="subtitle2" fontSize={12}
            sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left',
            }}>
            {text || ''}
        </Typography>
    );

    return [
        {
            key: 'rowIndex',
            header: '#',
            width: '3vw',
            render: (_, index) => (
                <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                    {(index ?? 0) + 1}
                </Typography>
            )
        },
        {
            key: 'Image',
            header: 'Ảnh',
            width: '5vw',
            align: 'center',
            render: (item: RowValidationFrameResult) => (
                item.dto?.imageUrl && imagePreviewMap[item.dto.imageUrl] ? (
                    <img
                        src={imagePreviewMap[item.dto.imageUrl]}
                        alt={item.dto.imageUrl}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : (
                    <ImageIcon sx={{ fontSize: 24, color: '#9ca3af' }} />
                )
            )
        },
        {
            key: 'CID',
            header: 'Mã SP',
            width: '9vw',
            align: 'center',
            render: (item: RowValidationFrameResult) => (
                <span className="badge-chip badge-info">{item.dto?.cid}</span>
            )
        },
        {
            key: 'Group',
            header: 'Nhóm',
            width: '6vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.group, item.dto?.groupId)
        },
        {
            key: 'FullName',
            header: 'Tên sản phẩm',
            width: '15vw',
            render: (item: RowValidationFrameResult) => renderText2Lines(item.dto?.name)
        },
        {
            key: 'Unit',
            header: 'ĐVT',
            width: '5vw',
            render: (item: RowValidationFrameResult) => item.dto?.unit
        },
        {
            key: 'Brand',
            header: 'Thương hiệu',
            width: '10vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.brand, item.dto?.brandId)
        },
        {
            key: 'Supplier',
            header: 'Nhà cung cấp',
            width: '10vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.supplier, item.dto?.supplierId)
        },
        {
            key: 'Country',
            header: 'Quốc gia',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.country, item.dto?.countryId)
        },
        {
            key: 'Season',
            header: 'Mùa',
            width: '8vw',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.season
        },
        {
            key: 'Model',
            header: 'Kiểu dáng',
            width: '8vw',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.model
        },
        {
            key: 'Serial',
            header: 'Series',
            width: '8vw',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.serial
        },
        {
            key: 'Gender',
            header: 'Giới tính',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.gender, item.dto?.frameAttribute?.genderId)
        },
        {
            key: 'Temple_Length',
            header: 'Dài càng',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.templeLength
        },
        {
            key: 'Bridge_Width',
            header: 'Cầu mắt',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.bridgeWidth
        },
        {
            key: 'Lens_Height',
            header: 'Cao tròng',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.lensHeight
        },
        {
            key: 'Lens_Width',
            header: 'Rộng mắt',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.lensWidth
        },
        {
            key: 'Color_Code',
            header: 'Mã màu',
            width: '8vw',
            render: (item: RowValidationFrameResult) => item.dto?.frameAttribute?.colorCode
        },
        {
            key: 'Frame',
            header: 'Khung',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.frame, item.dto?.frameAttribute?.frameId)
        },
        {
            key: 'Frame_Type',
            header: 'Loại khung',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.frameType, item.dto?.frameAttribute?.frameTypeId)
        },
        {
            key: 'Shape',
            header: 'Hình dáng',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.shape, item.dto?.frameAttribute?.shapeId)
        },
        {
            key: 'Ve',
            header: 'Ve',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.ve, item.dto?.frameAttribute?.veId)
        },
        {
            key: 'Color_Lens',
            header: 'Màu mắt',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.color, item.dto?.frameAttribute?.colorLensId)
        },
        {
            key: 'Coating',
            header: 'Lớp phủ',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.coating, item.dto?.frameAttribute?.coatingId)
        },
        {
            key: 'Temple',
            header: 'Càng kính',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.temple, item.dto?.frameAttribute?.templeId)
        },
        {
            key: 'Material_Front',
            header: 'CL Viền',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.material, item.dto?.frameAttribute?.materialFrontId)
        },
        {
            key: 'Material_Temple',
            header: 'CL Càng',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.material, item.dto?.frameAttribute?.materialTempleId)
        },
        {
            key: 'Material_Ve',
            header: 'CL Ve',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.material, item.dto?.frameAttribute?.materialVeId)
        },
        {
            key: 'Material_Temple_Tip',
            header: 'CL Đuôi càng',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.material, item.dto?.frameAttribute?.materialTempleTipId)
        },
        {
            key: 'Material_Lens',
            header: 'CL Mắt',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.material, item.dto?.frameAttribute?.materialLensId)
        },
        {
            key: 'Color_Front',
            header: 'Màu viền',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.color, item.dto?.frameAttribute?.colorFrontId)
        },
        {
            key: 'Color_Temple',
            header: 'Màu càng',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.color, item.dto?.frameAttribute?.colorTempleId)
        },
        {
            key: 'Supplier_Warranty',
            header: 'BH NCC',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.warranty, item.dto?.warrantySupplierId)
        },
        {
            key: 'Warranty',
            header: 'Bảo hành',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.warranty, item.dto?.warrantyId)
        },
        {
            key: 'Warranty_Retail',
            header: 'BH bán lẻ',
            width: '8vw',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.warranty, item.dto?.warrantyRetailId)
        },
        {
            key: 'Currency',
            header: 'Tiền tệ',
            width: '5vw',
            align: 'center',
            render: (item: RowValidationFrameResult) => getNameById(categoryMaps.currency, item.dto?.currencyId)
        },
        {
            key: 'Original_Price',
            header: 'Giá gốc',
            width: '6vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => (
                <span className="cell-price">{formatPrice(item.dto?.originalPrice || 0)}</span>
            )
        },
        {
            key: 'Retail_Price',
            header: 'Giá bán lẻ',
            width: '8vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => (
                <span className="cell-price">{formatPrice(item.dto?.retailPrice || 0) + ' ₫'}</span>
            )
        },
        {
            key: 'Tax',
            header: 'Thuế',
            width: '5vw',
            align: 'right',
            render: (item: RowValidationFrameResult) => (
                <span className="cell-price">{formatPrice(item.dto?.tax || 0) + '%'}</span>
            )
        },
        {
            key: 'Use',
            header: 'Công dụng',
            width: '12vw',
            render: (item: RowValidationFrameResult) => renderText2Lines(item.dto?.uses)
        },
        {
            key: 'Guide',
            header: 'Hướng dẫn sử dụng',
            width: '12vw',
            render: (item: RowValidationFrameResult) => renderText2Lines(item.dto?.guide)
        },
        {
            key: 'Warning',
            header: 'Cảnh báo',
            width: '12vw',
            render: (item: RowValidationFrameResult) => renderText2Lines(item.dto?.warning)
        },
        {
            key: 'Preserve',
            header: 'Bảo quản',
            width: '12vw',
            render: (item: RowValidationFrameResult) => renderText2Lines(item.dto?.preserve)
        },
        {
            key: 'Note',
            header: 'Ghi chú',
            width: '12vw',
            render: (item: RowValidationFrameResult) => renderText2Lines(item.dto?.note)
        }
    ];
}