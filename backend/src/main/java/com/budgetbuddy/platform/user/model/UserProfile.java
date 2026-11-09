package com.budgetbuddy.platform.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String employmentStatus; // UNEMPLOYED, EMPLOYED, STUDENT, FREELANCER, BUSINESS_OWNER

    @Column(nullable = false)
    private String currentCity;

    private String state;

    @Column(nullable = false)
    @Builder.Default
    private String country = "India";

    @Column(nullable = false)
    @Builder.Default
    private boolean willingToRelocate = false;

    private String educationLevel;

    @Column(columnDefinition = "TEXT")
    private String primarySkills;

    @Column(columnDefinition = "TEXT")
    private String skillsToLearn;

    @Builder.Default
    private Integer experienceYears = 0;

    @Column(nullable = false)
    @Builder.Default
    private String preferredWorkType = "REMOTE"; // REMOTE, HYBRID, ONSITE

    @Column(nullable = false, precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal dailyAvailableHours = new BigDecimal("4.0");

    @Column(nullable = false, precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal weeklyAvailableHours = new BigDecimal("20.0");

    @Column(nullable = false)
    @Builder.Default
    private String riskTolerance = "MODERATE"; // CONSERVATIVE, MODERATE, AGGRESSIVE

    @Column(columnDefinition = "TEXT")
    private String healthAccessibilityNeeds;

    @Column(columnDefinition = "TEXT")
    private String familyCommitments;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
