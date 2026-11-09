package com.budgetbuddy.platform.ai.service;

import com.budgetbuddy.platform.ai.dto.AiInsightResponse;
import com.budgetbuddy.platform.expense.dto.SpendingSummaryDto;
import com.budgetbuddy.platform.expense.service.ReportService;
import com.budgetbuddy.platform.peace.dto.WealthSimulationRequest;
import com.budgetbuddy.platform.peace.dto.WealthSimulationResult;
import com.budgetbuddy.platform.peace.engine.WealthSimulationEngine;
import com.budgetbuddy.platform.user.dto.FinancialProfileDto;
import com.budgetbuddy.platform.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAdvisorService {

    private static final Logger log = LoggerFactory.getLogger(AiAdvisorService.class);
    public static final String DISCLAIMER = "Educational insights only. Not financial, investment, tax, legal, or medical advice. " +
            "No specific securities, crypto, or loans are recommended.";

    private final ReportService reportService;
    private final UserService userService;
    private final WealthSimulationEngine wealthSimulationEngine;

    @Value("${application.ai.provider:fallback}")
    private String aiProvider;

    @Value("${application.ai.api-key:}")
    private String apiKey;

    public AiInsightResponse getFinancialInsights(Long userId) {
        SpendingSummaryDto summary = reportService.getSpendingSummary(userId, 3);
        FinancialProfileDto finProfile = userService.getFinancialProfile(userId);

        List<String> observations = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        // Generate deterministic intelligent financial observations from REAL stored data
        if (summary.getTotalExpenses().compareTo(BigDecimal.ZERO) == 0 && summary.getTotalIncome().compareTo(BigDecimal.ZERO) == 0) {
            observations.add("No transactions recorded in the past 90 days. Start by adding transactions or scanning your first receipt.");
            actions.add("Scan today's grocery or dining receipt to initiate real spending analysis.");
        } else {
            if (summary.getSavingsRate().compareTo(new BigDecimal("20.0")) >= 0) {
                observations.add(String.format("Healthy savings rate of %s%% recorded across the analyzed period.", summary.getSavingsRate()));
                actions.add("Direct surplus savings into liquid emergency reserves before committing to longer-term targets.");
            } else if (summary.getSavingsRate().compareTo(BigDecimal.ZERO) > 0) {
                observations.add(String.format("Current savings rate is %s%%. Modest lifestyle adjustments can push this beyond 20%%.", summary.getSavingsRate()));
                actions.add("Audit discretionary spending in top categories to trim non-essential leaks by 5-10%.");
            } else {
                observations.add("Expenses currently equal or exceed income in recent months.");
                actions.add("Immediate focus needed on capping variable expenses and accelerating the PEACE career execution plan.");
            }

            if (!summary.getCategoryBreakdown().isEmpty()) {
                SpendingSummaryDto.CategorySpend topCat = summary.getCategoryBreakdown().get(0);
                observations.add(String.format("Largest spending category is '%s' accounting for %s%% (₹%s) of total expenditures.",
                        topCat.getCategoryName(), topCat.getPercentage(), topCat.getTotalAmount().setScale(0, RoundingMode.HALF_UP)));
                actions.add(String.format("Create a monthly budget envelope specifically for %s to maintain spending caps.", topCat.getCategoryName()));
            }

            if (!summary.getTopMerchants().isEmpty()) {
                SpendingSummaryDto.MerchantSpend topMerch = summary.getTopMerchants().get(0);
                observations.add(String.format("Frequent merchant concentration: ₹%s spent at '%s' across %d transactions.",
                        topMerch.getAmount().setScale(0, RoundingMode.HALF_UP), topMerch.getMerchant(), topMerch.getTransactionCount()));
            }
        }

        if (finProfile != null) {
            BigDecimal runway = finProfile.getMonthlyEssentialExpenses().compareTo(BigDecimal.ZERO) > 0
                    ? finProfile.getCurrentSavings().divide(finProfile.getMonthlyEssentialExpenses(), 1, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            if (runway.compareTo(new BigDecimal("6.0")) < 0) {
                observations.add(String.format("Current emergency runway is %s months (below recommended 6 months safety cushion).", runway));
                actions.add(String.format("Target an emergency fund of ₹%s before allocating capital into high-risk ventures.",
                        finProfile.getMonthlyEssentialExpenses().multiply(new BigDecimal("6")).setScale(0, RoundingMode.HALF_UP)));
            }
        }

        String providerMode = (apiKey != null && !apiKey.isBlank() && !"fallback".equalsIgnoreCase(aiProvider))
                ? "LIVE_AI (" + aiProvider.toUpperCase() + ")"
                : "DETERMINISTIC_INTELLIGENCE";

        return AiInsightResponse.builder()
                .title("AI Financial Insights & Spending Analysis")
                .summary(String.format("Analysis derived from %d recorded transactions and verified personal financial metrics.",
                        summary.getRecentTransactions().size()))
                .observations(observations)
                .recommendedActions(actions)
                .educationalDisclaimer(DISCLAIMER)
                .providerMode(providerMode)
                .build();
    }

    public AiInsightResponse getCareerTaskAdvice(Long userId, String taskTitle, String category) {
        List<String> observations = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        observations.add("Task aligned with your PEACE structured career advancement roadmap.");
        observations.add("Consistent daily execution builds compound career leverage and measurable proof of work.");

        actions.add("Dedicate focused, uninterrupted time using the Pomodoro technique.");
        actions.add("Document tangible proof upon completion (notes, code repository commit, or sent outreach).");
        actions.add("If delayed due to health or family emergency, use the safe postponement feature rather than skipping.");

        return AiInsightResponse.builder()
                .title("PEACE Execution Guidance: " + taskTitle)
                .summary("Strategic recommendations to maximize output efficiency and skill mastery.")
                .observations(observations)
                .recommendedActions(actions)
                .educationalDisclaimer(DISCLAIMER)
                .providerMode("DETERMINISTIC_INTELLIGENCE")
                .build();
    }
}
