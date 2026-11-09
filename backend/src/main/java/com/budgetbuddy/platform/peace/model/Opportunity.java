package com.budgetbuddy.platform.peace.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category; // AI_SERVICES, SOFTWARE_SERVICES, DIGITAL_MARKETING, REMOTE_EMPLOYMENT, FREELANCING, LOCAL_SERVICES, CONSULTING_TUTORING, SKILL_MONETIZATION

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String whyItMatches;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal requiredCapital = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(nullable = false)
    @Builder.Default
    private Integer learningCurveWeeks = 4;

    @Column(nullable = false)
    @Builder.Default
    private Integer timeToFirstRevenueWeeks = 8;

    @Column(nullable = false, precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal dailyHoursRequired = new BigDecimal("3.0");

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal minMonthlyRevenue;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal maxMonthlyRevenue;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal operatingExpenses = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private String marketCompetition = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Column(nullable = false)
    @Builder.Default
    private String locationType = "REMOTE"; // REMOTE, HYBRID, ONSITE

    @Column(nullable = false)
    @Builder.Default
    private String riskLevel = "LOW"; // LOW, MEDIUM, HIGH

    @Column(columnDefinition = "TEXT")
    private String evidenceSources;

    @Column(nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal confidenceScore = new BigDecimal("0.85");

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
