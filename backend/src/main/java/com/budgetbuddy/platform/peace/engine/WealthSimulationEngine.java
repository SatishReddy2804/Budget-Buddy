package com.budgetbuddy.platform.peace.engine;

import com.budgetbuddy.platform.peace.dto.WealthSimulationRequest;
import com.budgetbuddy.platform.peace.dto.WealthSimulationResult;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class WealthSimulationEngine {

    public static final String DISCLAIMER = "Educational insights and mathematical simulations only. " +
            "Not financial, investment, tax, legal, or medical advice. No guaranteed returns, employment, or income are promised or implied.";

    public WealthSimulationResult simulate(WealthSimulationRequest request) {
        BigDecimal startingCapital = request.getStartingCapital().max(BigDecimal.ZERO);
        BigDecimal currentIncome = request.getCurrentMonthlyIncome().max(BigDecimal.ZERO);
        BigDecimal expenses = request.getMonthlyEssentialExpenses().max(BigDecimal.ZERO);
        BigDecimal targetWealth = request.getTargetWealthAmount().max(new BigDecimal("1000.00"));
        int years = Math.max(1, Math.min(30, request.getTargetDurationYears()));

        BigDecimal monthlySavingsCapacity = currentIncome.subtract(expenses).max(BigDecimal.ZERO);

        BigDecimal runway = expenses.compareTo(BigDecimal.ZERO) > 0
                ? startingCapital.divide(expenses, 1, RoundingMode.HALF_UP)
                : new BigDecimal("99.9");

        BigDecimal emergencyReserve = expenses.multiply(new BigDecimal("6")).setScale(2, RoundingMode.HALF_UP);

        // Generate 3 scenarios
        WealthSimulationResult.ScenarioProjection conservative =
                calculateScenario("Conservative", new BigDecimal("0.05"), startingCapital, monthlySavingsCapacity, targetWealth, years);
        WealthSimulationResult.ScenarioProjection moderate =
                calculateScenario("Moderate", new BigDecimal("0.08"), startingCapital, monthlySavingsCapacity, targetWealth, years);
        WealthSimulationResult.ScenarioProjection ambitious =
                calculateScenario("Ambitious", new BigDecimal("0.11"), startingCapital, monthlySavingsCapacity, targetWealth, years);

        // Determine Feasibility based on Moderate Scenario
        String feasibilityStatus;
        String feasibilityExplanation;

        BigDecimal reqMonthly = moderate.getRequiredMonthlyContribution();
        BigDecimal shortfall = moderate.getMonthlyShortfall();

        if (years <= 2 && targetWealth.compareTo(startingCapital.multiply(new BigDecimal("100.0"))) > 0 && targetWealth.compareTo(new BigDecimal("5000000.00")) >= 0) {
            feasibilityStatus = "NOT_REALISTIC_WITH_CURRENT_INPUTS";
            feasibilityExplanation = String.format(
                    "Reaching ₹%s in %d year(s) from a starting capital of ₹%s requires an unrealistic monthly contribution of ₹%s. " +
                    "We recommend extending the horizon to 5–8 years, acquiring high-income monetization skills, and setting milestone targets.",
                    targetWealth.setScale(0, RoundingMode.HALF_UP), years, startingCapital.setScale(0, RoundingMode.HALF_UP), reqMonthly.setScale(0, RoundingMode.HALF_UP)
            );
        } else if (shortfall.compareTo(BigDecimal.ZERO) <= 0) {
            feasibilityStatus = "REALISTIC";
            feasibilityExplanation = String.format(
                    "Your current monthly savings capacity of ₹%s comfortably meets the required contribution of ₹%s under moderate assumptions.",
                    monthlySavingsCapacity.setScale(0, RoundingMode.HALF_UP), reqMonthly.setScale(0, RoundingMode.HALF_UP)
            );
        } else if (shortfall.compareTo(new BigDecimal("25000.00")) <= 0) {
            feasibilityStatus = "AMBITIOUS";
            feasibilityExplanation = String.format(
                    "You need an additional ₹%s/month to reach your target on schedule. This is achievable through side freelancing, part-time services, or skill monetization.",
                    shortfall.setScale(0, RoundingMode.HALF_UP)
            );
        } else if (shortfall.compareTo(new BigDecimal("75000.00")) <= 0) {
            feasibilityStatus = "VERY_AMBITIOUS";
            feasibilityExplanation = String.format(
                    "An income shortfall of ₹%s/month requires a substantial career transition, dual-income strategy, or business launch.",
                    shortfall.setScale(0, RoundingMode.HALF_UP)
            );
        } else {
            feasibilityStatus = "NOT_REALISTIC_WITH_CURRENT_INPUTS";
            feasibilityExplanation = String.format(
                    "A shortfall of ₹%s/month requires fundamental restructuring of your timeframe or scaling up your career skill set before this target becomes viable.",
                    shortfall.setScale(0, RoundingMode.HALF_UP)
            );
        }

        // Sensitivity analysis
        List<WealthSimulationResult.SensitivityItem> sensitivity = generateSensitivity(request, moderate);

        return WealthSimulationResult.builder()
                .feasibilityStatus(feasibilityStatus)
                .feasibilityExplanation(feasibilityExplanation)
                .monthlySavingsCapacity(monthlySavingsCapacity)
                .emergencyReserveNeeded(emergencyReserve)
                .financialRunwayMonths(runway)
                .conservativeScenario(conservative)
                .moderateScenario(moderate)
                .ambitiousScenario(ambitious)
                .sensitivityAnalysis(sensitivity)
                .educationalDisclaimer(DISCLAIMER)
                .build();
    }

    private WealthSimulationResult.ScenarioProjection calculateScenario(
            String name, BigDecimal annualRate, BigDecimal startCapital, BigDecimal currentSavingsCapacity, BigDecimal target, int years) {

        int months = years * 12;
        double r = annualRate.doubleValue();
        double i = r / 12.0;

        // Future value of starting capital: S * (1+i)^months
        double fvPrincipal = startCapital.doubleValue() * Math.pow(1.0 + i, months);

        double remainingTarget = Math.max(0.0, target.doubleValue() - fvPrincipal);
        double annuityFactor = (Math.pow(1.0 + i, months) - 1.0) / i;

        double requiredMonthlyPmt = remainingTarget > 0 ? (remainingTarget / annuityFactor) : 0.0;
        BigDecimal reqMonthly = BigDecimal.valueOf(requiredMonthlyPmt).setScale(2, RoundingMode.HALF_UP);

        BigDecimal shortfall = reqMonthly.subtract(currentSavingsCapacity).max(BigDecimal.ZERO);

        // Projected accumulated wealth with current savings capacity
        double fvSavings = currentSavingsCapacity.doubleValue() * annuityFactor;
        BigDecimal projectedWealth = BigDecimal.valueOf(fvPrincipal + fvSavings).setScale(2, RoundingMode.HALF_UP);

        // Yearly Milestones
        List<WealthSimulationResult.YearlyMilestone> milestones = new ArrayList<>();
        BigDecimal currentBalance = startCapital;
        BigDecimal annualContribution = reqMonthly.multiply(BigDecimal.valueOf(12));

        for (int yr = 1; yr <= years; yr++) {
            BigDecimal startBal = currentBalance;
            BigDecimal returns = startBal.add(annualContribution.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP))
                    .multiply(annualRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal endBal = startBal.add(annualContribution).add(returns);

            milestones.add(WealthSimulationResult.YearlyMilestone.builder()
                    .year(yr)
                    .beginningBalance(startBal.setScale(2, RoundingMode.HALF_UP))
                    .annualContribution(annualContribution)
                    .estimatedReturns(returns)
                    .endingBalance(endBal.setScale(2, RoundingMode.HALF_UP))
                    .build());
            currentBalance = endBal;
        }

        return WealthSimulationResult.ScenarioProjection.builder()
                .scenarioName(name)
                .assumedAnnualReturnRate(annualRate.multiply(BigDecimal.valueOf(100)))
                .requiredMonthlyContribution(reqMonthly)
                .monthlyShortfall(shortfall)
                .requiredAdditionalIncome(shortfall)
                .projectedAccumulatedWealth(projectedWealth)
                .estimatedCompletionYears(BigDecimal.valueOf(years))
                .yearlyMilestones(milestones)
                .build();
    }

    private List<WealthSimulationResult.SensitivityItem> generateSensitivity(
            WealthSimulationRequest request, WealthSimulationResult.ScenarioProjection moderate) {
        List<WealthSimulationResult.SensitivityItem> list = new ArrayList<>();

        // +10% Income
        BigDecimal boostedIncome = request.getCurrentMonthlyIncome().multiply(new BigDecimal("1.10"));
        BigDecimal boostedCapacity = boostedIncome.subtract(request.getMonthlyEssentialExpenses()).max(BigDecimal.ZERO);
        BigDecimal boostedImpact = boostedCapacity.multiply(new BigDecimal("12")).multiply(BigDecimal.valueOf(request.getTargetDurationYears()))
                .add(moderate.getProjectedAccumulatedWealth());

        list.add(WealthSimulationResult.SensitivityItem.builder()
                .factor("Income Enhancement")
                .changeDescription("+10% monthly income through upskilling or side projects")
                .revisedProjectedWealth(boostedImpact.setScale(2, RoundingMode.HALF_UP))
                .outcomeImpact("Reduces monthly required effort and shortens target timeline by approx 4-7 months")
                .build());

        // -10% Expenses
        BigDecimal reducedExpenses = request.getMonthlyEssentialExpenses().multiply(new BigDecimal("0.90"));
        BigDecimal trimmedCapacity = request.getCurrentMonthlyIncome().subtract(reducedExpenses).max(BigDecimal.ZERO);
        BigDecimal trimmedImpact = trimmedCapacity.multiply(new BigDecimal("12")).multiply(BigDecimal.valueOf(request.getTargetDurationYears()))
                .add(moderate.getProjectedAccumulatedWealth());

        list.add(WealthSimulationResult.SensitivityItem.builder()
                .factor("Expense Optimization")
                .changeDescription("10% reduction in non-essential expenses using smart tracking")
                .revisedProjectedWealth(trimmedImpact.setScale(2, RoundingMode.HALF_UP))
                .outcomeImpact("Immediately increases monthly savings capacity and financial runway")
                .build());

        // +2 Years Horizon
        list.add(WealthSimulationResult.SensitivityItem.builder()
                .factor("Time Horizon Extension")
                .changeDescription("Extending target timeline by +2 years")
                .revisedProjectedWealth(moderate.getProjectedAccumulatedWealth().multiply(new BigDecimal("1.30")).setScale(2, RoundingMode.HALF_UP))
                .outcomeImpact("Drastically drops required monthly contribution by compound growth")
                .build());

        return list;
    }
}
