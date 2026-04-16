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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "Purchase_Quotation_Request")
public class PurchaseQuotationRequest extends BaseEntity {
    @Size(max = 30)
    @NotNull
    @Nationalized
    @Column(name = "cid", nullable = false, length = 30)
    private String cid;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 500)
    @Nationalized
    @Column(name = "note", length = 500)
    private String note;

    @NotNull
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @NotNull
    @Column(name = "expected_date", nullable = false)
    private LocalDate expectedDate;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @NotNull
    @Column(name = "total_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @NotNull
    @Column(name = "currency_value", nullable = false, precision = 18, scale = 2)
    private BigDecimal currencyValue;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requested_by", nullable = false)
    private Employee requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

}