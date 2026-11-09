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
public class LocationComparisonDto {
    private String userCity;
    private boolean willingToRelocate;
    private List<CityMetric> cityComparisons;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CityMetric {
        private String cityName;
        private String state;
        private String tier;
        private BigDecimal averageMonthlyRent;
        private BigDecimal monthlyLivingCost;
        private BigDecimal estimatedRelocationCost;
        private BigDecimal medianEntryTechSalary;
        private BigDecimal medianSeniorSalary;
        private BigDecimal projectedNetMonthlySavings;
        private String keyIndustries;
        private String suitabilityReason;
        private boolean isRemote;
    }
}
