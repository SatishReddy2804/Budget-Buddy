package com.budgetbuddy.platform.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;

    @NotBlank(message = "Employment status is required")
    private String employmentStatus; // UNEMPLOYED, EMPLOYED, STUDENT, FREELANCER, BUSINESS_OWNER

    @NotBlank(message = "Current city is required")
    private String currentCity;

    private String state;
    private String country;
    private boolean willingToRelocate;
    private String educationLevel;
    private String primarySkills;
    private String skillsToLearn;
    private Integer experienceYears;
    private String preferredWorkType; // REMOTE, HYBRID, ONSITE

    @NotNull(message = "Daily available hours are required")
    private BigDecimal dailyAvailableHours;

    @NotNull(message = "Weekly available hours are required")
    private BigDecimal weeklyAvailableHours;

    private String riskTolerance; // CONSERVATIVE, MODERATE, AGGRESSIVE
    private String healthAccessibilityNeeds;
    private String familyCommitments;
}
