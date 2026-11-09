package com.budgetbuddy.platform.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "financial_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentMonthlyIncome = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentSavings = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal monthlyEssentialExpenses = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal existingDebts = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal targetWealthAmount = new BigDecimal("1000000.00");

    @Column(nullable = false)
    @Builder.Default
    private Integer targetDurationYears = 3;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal emergencyFundTarget = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private String riskComfortLevel = "MODERATE"; // CONSERVATIVE, MODERATE, AGGRESSIVE

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
