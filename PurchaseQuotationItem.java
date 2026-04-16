package org.erp.vnoptic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "Purchase_Quotation_Item")
public class PurchaseQuotationItem extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quotation_id", nullable = false)
    private PurchaseQuotationRequest quotation;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Column(name = "request_qty", nullable = false)
    private Integer requestQty;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "unit", nullable = false, length = 50)
    private String unit;

    @NotNull
    @Column(name = "expected_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal expectedPrice;

    @NotNull
    @Column(name = "quoted_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal quotedPrice;

    @NotNull
    @Column(name = "quoted_qty", nullable = false)
    private Integer quotedQty;

    @NotNull
    @Column(name = "tax", nullable = false)
    private Double tax;

    @NotNull
    @Column(name = "line_total", nullable = false, precision = 18, scale = 2)
    private BigDecimal lineTotal;

}