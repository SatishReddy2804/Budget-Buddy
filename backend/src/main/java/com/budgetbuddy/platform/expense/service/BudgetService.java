package com.budgetbuddy.platform.expense.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.expense.dto.BudgetDto;
import com.budgetbuddy.platform.expense.dto.CreateBudgetRequest;
import com.budgetbuddy.platform.expense.model.Budget;
import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.expense.model.Transaction;
import com.budgetbuddy.platform.expense.repository.BudgetRepository;
import com.budgetbuddy.platform.expense.repository.ExpenseCategoryRepository;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public BudgetDto createOrUpdateBudget(Long userId, CreateBudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        Budget budget = budgetRepository.findByUserAndCategoryAndMonthAndYear(user, category, request.getMonth(), request.getYear())
                .orElse(Budget.builder()
                        .user(user)
                        .category(category)
                        .month(request.getMonth())
                        .year(request.getYear())
                        .build());

        budget.setBudgetedAmount(request.getBudgetedAmount());
        budget = budgetRepository.save(budget);

        return mapToDto(budget);
    }

    @Transactional(readOnly = true)
    public List<BudgetDto> getBudgetsForMonth(Long userId, int month, int year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);
        List<BudgetDto> dtos = new ArrayList<>();
        for (Budget b : budgets) {
            dtos.add(mapToDto(b));
        }
        return dtos;
    }

    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found: " + budgetId));

        if (!budget.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Budget not found");
        }

        budgetRepository.delete(budget);
    }

    private BudgetDto mapToDto(Budget b) {
        YearMonth ym = YearMonth.of(b.getYear(), b.getMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> trans = transactionRepository.findByUserAndCategoryAndTransactionDateBetween(
                b.getUser(), b.getCategory(), start, end);

        BigDecimal actualSpent = trans.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = b.getBudgetedAmount().subtract(actualSpent);
        BigDecimal percentage = b.getBudgetedAmount().compareTo(BigDecimal.ZERO) > 0
                ? actualSpent.divide(b.getBudgetedAmount(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100.00")).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        boolean isOver = actualSpent.compareTo(b.getBudgetedAmount()) > 0;

        return BudgetDto.builder()
                .id(b.getId())
                .categoryId(b.getCategory().getId())
                .categoryName(b.getCategory().getName())
                .categoryIcon(b.getCategory().getIcon())
                .categoryColor(b.getCategory().getColor())
                .month(b.getMonth())
                .year(b.getYear())
                .budgetedAmount(b.getBudgetedAmount())
                .actualSpent(actualSpent)
                .remainingAmount(remaining)
                .percentageUsed(percentage)
                .isOverBudget(isOver)
                .build();
    }
}
