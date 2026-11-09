package com.budgetbuddy.platform.peace;

import com.budgetbuddy.platform.peace.dto.WealthSimulationRequest;
import com.budgetbuddy.platform.peace.dto.WealthSimulationResult;
import com.budgetbuddy.platform.peace.engine.WealthSimulationEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class WealthSimulationEngineTest {

    private WealthSimulationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new WealthSimulationEngine();
    }

    @Test
    @DisplayName("Should detect unrealistic inputs when starting capital is tiny and target is huge in short time")
    void shouldDetectUnrealisticTarget() {
        WealthSimulationRequest req = WealthSimulationRequest.builder()
                .startingCapital(new BigDecimal("1000.00"))
                .currentMonthlyIncome(new BigDecimal("15000.00"))
                .monthlyEssentialExpenses(new BigDecimal("12000.00"))
                .targetWealthAmount(new BigDecimal("10000000.00")) // 1 Crore
                .targetDurationYears(1)
                .build();

        WealthSimulationResult result = engine.simulate(req);

        assertEquals("NOT_REALISTIC_WITH_CURRENT_INPUTS", result.getFeasibilityStatus());
        assertNotNull(result.getFeasibilityExplanation());
        assertTrue(result.getFeasibilityExplanation().contains("unrealistic"));
        assertNotNull(result.getEducationalDisclaimer());
        assertTrue(result.getEducationalDisclaimer().contains("Not financial, investment, tax, legal, or medical advice"));
    }

    @Test
    @DisplayName("Should calculate realistic scenario when monthly savings capacity exceeds required contribution")
    void shouldCalculateRealisticScenario() {
        WealthSimulationRequest req = WealthSimulationRequest.builder()
                .startingCapital(new BigDecimal("100000.00"))
                .currentMonthlyIncome(new BigDecimal("80000.00"))
                .monthlyEssentialExpenses(new BigDecimal("30000.00")) // 50,000 savings capacity
                .targetWealthAmount(new BigDecimal("1500000.00")) // 15 Lakhs
                .targetDurationYears(3)
                .build();

        WealthSimulationResult result = engine.simulate(req);

        assertEquals("REALISTIC", result.getFeasibilityStatus());
        assertEquals(new BigDecimal("50000.00"), result.getMonthlySavingsCapacity());
        assertNotNull(result.getConservativeScenario());
        assertNotNull(result.getModerateScenario());
        assertNotNull(result.getAmbitiousScenario());
        assertEquals(3, result.getModerateScenario().getYearlyMilestones().size());
    }

    @Test
    @DisplayName("Should calculate financial runway and emergency fund requirement correctly")
    void shouldCalculateRunwayAndEmergencyFund() {
        WealthSimulationRequest req = WealthSimulationRequest.builder()
                .startingCapital(new BigDecimal("60000.00"))
                .currentMonthlyIncome(new BigDecimal("30000.00"))
                .monthlyEssentialExpenses(new BigDecimal("20000.00"))
                .targetWealthAmount(new BigDecimal("500000.00"))
                .targetDurationYears(2)
                .build();

        WealthSimulationResult result = engine.simulate(req);

        // 60,000 / 20,000 = 3.0 months
        assertEquals(new BigDecimal("3.0"), result.getFinancialRunwayMonths());
        // 6 * 20,000 = 120,000
        assertEquals(new BigDecimal("120000.00"), result.getEmergencyReserveNeeded());
    }
}
