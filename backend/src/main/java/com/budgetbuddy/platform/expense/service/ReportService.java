package com.budgetbuddy.platform.expense.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.expense.dto.SpendingSummaryDto;
import com.budgetbuddy.platform.expense.dto.TransactionDto;
import com.budgetbuddy.platform.expense.model.Transaction;
import com.budgetbuddy.platform.expense.repository.TransactionRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    @Transactional(readOnly = true)
    public SpendingSummaryDto getSpendingSummary(Long userId, int monthsBack) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        int span = Math.max(1, Math.min(12, monthsBack));
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(span).withDayOfMonth(1);

        List<Transaction> transactions = transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
                user, startDate, endDate);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        Map<String, BigDecimal> categoryMap = new HashMap<>();
        Map<String, String> categoryColors = new HashMap<>();
        Map<String, BigDecimal> merchantMap = new HashMap<>();
        Map<String, Integer> merchantCounts = new HashMap<>();
        Map<YearMonth, BigDecimal> monthlyIncomeMap = new TreeMap<>();
        Map<YearMonth, BigDecimal> monthlyExpenseMap = new TreeMap<>();

        // Initialize months
        YearMonth currentYm = YearMonth.from(startDate);
        YearMonth targetYm = YearMonth.from(endDate);
        while (!currentYm.isAfter(targetYm)) {
            monthlyIncomeMap.put(currentYm, BigDecimal.ZERO);
            monthlyExpenseMap.put(currentYm, BigDecimal.ZERO);
            currentYm = currentYm.plusMonths(1);
        }

        for (Transaction t : transactions) {
            YearMonth ym = YearMonth.from(t.getTransactionDate());
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                totalIncome = totalIncome.add(t.getAmount());
                monthlyIncomeMap.put(ym, monthlyIncomeMap.getOrDefault(ym, BigDecimal.ZERO).add(t.getAmount()));
            } else {
                totalExpenses = totalExpenses.add(t.getAmount());
                monthlyExpenseMap.put(ym, monthlyExpenseMap.getOrDefault(ym, BigDecimal.ZERO).add(t.getAmount()));

                String catName = t.getCategory() != null ? t.getCategory().getName() : "Uncategorized";
                String color = t.getCategory() != null ? t.getCategory().getColor() : "#64748b";
                categoryMap.put(catName, categoryMap.getOrDefault(catName, BigDecimal.ZERO).add(t.getAmount()));
                categoryColors.put(catName, color);

                String merch = t.getMerchant() != null ? t.getMerchant() : "Unknown";
                merchantMap.put(merch, merchantMap.getOrDefault(merch, BigDecimal.ZERO).add(t.getAmount()));
                merchantCounts.put(merch, merchantCounts.getOrDefault(merch, 0) + 1);
            }
        }

        BigDecimal netSavings = totalIncome.subtract(totalExpenses);
        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? netSavings.divide(totalIncome, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100.00")).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Category Breakdown
        List<SpendingSummaryDto.CategorySpend> categoryBreakdown = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryMap.entrySet()) {
            BigDecimal pct = totalExpenses.compareTo(BigDecimal.ZERO) > 0
                    ? entry.getValue().divide(totalExpenses, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100.00")).setScale(1, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            categoryBreakdown.add(SpendingSummaryDto.CategorySpend.builder()
                    .categoryName(entry.getKey())
                    .color(categoryColors.getOrDefault(entry.getKey(), "#3b82f6"))
                    .totalAmount(entry.getValue())
                    .percentage(pct)
                    .build());
        }
        categoryBreakdown.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));

        // Monthly Trends
        List<SpendingSummaryDto.MonthlyTrend> monthlyTrends = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
        for (YearMonth ym : monthlyIncomeMap.keySet()) {
            BigDecimal inc = monthlyIncomeMap.getOrDefault(ym, BigDecimal.ZERO);
            BigDecimal exp = monthlyExpenseMap.getOrDefault(ym, BigDecimal.ZERO);
            monthlyTrends.add(SpendingSummaryDto.MonthlyTrend.builder()
                    .month(ym.format(fmt))
                    .income(inc)
                    .expenses(exp)
                    .savings(inc.subtract(exp))
                    .build());
        }

        // Top Merchants
        List<SpendingSummaryDto.MerchantSpend> topMerchants = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : merchantMap.entrySet()) {
            topMerchants.add(SpendingSummaryDto.MerchantSpend.builder()
                    .merchant(entry.getKey())
                    .amount(entry.getValue())
                    .transactionCount(merchantCounts.getOrDefault(entry.getKey(), 1))
                    .build());
        }
        topMerchants.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        if (topMerchants.size() > 5) {
            topMerchants = topMerchants.subList(0, 5);
        }

        // Recent 5 transactions
        List<TransactionDto> recent = transactions.stream()
                .limit(5)
                .map(transactionService::mapToDto)
                .toList();

        return SpendingSummaryDto.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netSavings(netSavings)
                .savingsRate(savingsRate)
                .categoryBreakdown(categoryBreakdown)
                .monthlyTrends(monthlyTrends)
                .topMerchants(topMerchants)
                .recentTransactions(recent)
                .build();
    }
}
