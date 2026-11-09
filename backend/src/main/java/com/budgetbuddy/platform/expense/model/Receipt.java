package com.budgetbuddy.platform.expense.model;

import com.budgetbuddy.platform.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "receipts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false, length = 500)
    private String storedFilePath;

    @Column(nullable = false)
    private String mimeType;

    @Column(nullable = false)
    private Long fileSizeBytes;

    @Column(nullable = false)
    @Builder.Default
    private String ocrStatus = "PENDING"; // PENDING, COMPLETED, FAILED

    @Column(columnDefinition = "LONGTEXT")
    private String rawOcrText;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal ocrConfidence = BigDecimal.ZERO;

    private String merchantName;

    private LocalDate receiptDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal taxAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal tipAmount;

    @Column(nullable = false)
    @Builder.Default
    private String currency = "INR";

    @Column(nullable = false)
    @Builder.Default
    private String status = "UPLOADED"; // UPLOADED, REVIEWED, COMMITTED

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReceiptLineItem> lineItems = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
