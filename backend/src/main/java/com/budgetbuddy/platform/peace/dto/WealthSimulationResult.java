package com.budgetbuddy.platform.peace.dto;

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
public class WealthSimulationResult {

    private String feasibilityStatus; // REALISTIC, AMBITIOUS, VERY_AMBITIOUS, NOT_REALISTIC_WITH_CURRENT_INPUTS
    private String feasibilityExplanation;
    private BigDecimal monthlySavingsCapacity;
    private BigDecimal emergencyReserveNeeded;
    private BigDecimal financialRunwayMonths;

    // Scenarios
    private ScenarioProjection conservativeScenario; // 5% return
    private ScenarioProjection moderateScenario;     // 8% return
    private ScenarioProjection ambitiousScenario;    // 11% return

    private List<SensitivityItem> sensitivityAnalysis;
    private String educationalDisclaimer;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScenarioProjection {
        private String scenarioName;
        private BigDecimal assumedAnnualReturnRate;
        private BigDecimal requiredMonthlyContribution;
        private BigDecimal monthlyShortfall;
        private BigDecimal requiredAdditionalIncome;
        private BigDecimal projectedAccumulatedWealth;
        private BigDecimal estimatedCompletionYears;
        private List<YearlyMilestone> yearlyMilestones;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YearlyMilestone {
        private int year;
        private BigDecimal beginningBalance;
        private BigDecimal annualContribution;
        private BigDecimal estimatedReturns;
        private BigDecimal endingBalance;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SensitivityItem {
        private String factor;
        private String changeDescription;
        private BigDecimal revisedProjectedWealth;
        private String outcomeImpact;
    }
}
