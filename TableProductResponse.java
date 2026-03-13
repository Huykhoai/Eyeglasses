package org.erp.vnoptic.responese;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.erp.vnoptic.dto.ProductDto;
import org.erp.vnoptic.dto.StatusProductDto;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableProductResponse {
    // 1. Thông tin chung
    Long id;
    String cid;
    String name;
    String imageUrl;
    String unit;
    SimpleResponse group;
    SimpleResponse brand;
    SimpleResponse supplier;
    SimpleResponse country;
    StatusProductDto statusProduct;

    // 2. Thông tin giá & Bảo hành
    BigDecimal retailPrice;
    BigDecimal costPrice;
    SimpleResponse tax;
    SimpleResponse currency;
    SimpleResponse warranty;
    SimpleResponse warrantySupplier;
    SimpleResponse warrantyRetail;

    // 3. Thuộc tính sản phẩm
    LensAttributeDto lensAttribute;
    FrameAttributeDto frameAttribute;

    // 4. Thông tin bổ sung
    String note;
    String uses;
    String guide;
    String warning;
    String preserve;

    @Builder.Default
    Set<ProductDto> includedAccessories = new HashSet<>();

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class LensAttributeDto {
        // Chất liệu
        SimpleResponse refractiveIndex;
        SimpleResponse material;

        // Thông số
        Double diameter;
        Double sph;
        Double cyl;
        Double lenAdd;

        // Thiết kế & Tính năng
        SimpleResponse design1;
        SimpleResponse design2;
        SimpleResponse uv;
        SimpleResponse coating;

        // Màu sắc
        SimpleResponse hmcCl;
        SimpleResponse phoCl;
        SimpleResponse tintCl;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class FrameAttributeDto {
        // Kiểu dáng & Kích thước
        String model;
        String colorCode;
        String season;
        String serial;
        int gender;
        Double lensHeight;
        Double lensWidth;
        Double bridgeWidth;
        Double templeLength;
        SimpleResponse frame;
        SimpleResponse frameType;
        SimpleResponse shape;

        // Chất liệu & Thành phần
        SimpleResponse ve;
        SimpleResponse temple;
        SimpleResponse coating;
        SimpleResponse materialFront;
        SimpleResponse materialTemple;
        SimpleResponse materialVe;
        SimpleResponse materialTempleTip;
        SimpleResponse materialLens;

        // Màu sắc
        SimpleResponse colorFront;
        SimpleResponse colorTemple;
        SimpleResponse colorLens;
    }
}
