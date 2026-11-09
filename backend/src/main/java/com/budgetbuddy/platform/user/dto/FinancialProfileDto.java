package com.budgetbuddy.platform.user.dto;

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
public class FinancialProfileDto {
    private Long id;

    @NotNull(message = "Current monthly income is required")
    private BigDecimal currentMonthlyIncome;

    @NotNull(message = "Current savings amount is required")
    private BigDecimal currentSavings;

    @NotNull(message = "Monthly essential expenses are required")
    private BigDecimal monthlyEssentialExpenses;

    private BigDecimal existingDebts;

    @NotNull(message = "Target wealth amount is required")
    private BigDecimal targetWealthAmount;

    @NotNull(message = "Target duration in years is required")
    private Integer targetDurationYears;

    private BigDecimal emergencyFundTarget;
    private String riskComfortLevel; // CONSERVATIVE, MODERATE, AGGRESSIVE
}
