package com.budgetbuddy.platform.peace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WealthSimulationRequest {

    @NotNull(message = "Starting capital is required")
    private BigDecimal startingCapital;

    @NotNull(message = "Current monthly income is required")
    private BigDecimal currentMonthlyIncome;

    @NotNull(message = "Monthly essential expenses are required")
    private BigDecimal monthlyEssentialExpenses;

    @NotNull(message = "Target wealth amount is required")
    private BigDecimal targetWealthAmount;

    @NotNull(message = "Target duration in years is required")
    private Integer targetDurationYears;

    @Builder.Default
    private BigDecimal expectedAnnualIncomeGrowthRate = new BigDecimal("0.05"); // 5% default

    @Builder.Default
    private BigDecimal inflationRate = new BigDecimal("0.06"); // 6% default
}
