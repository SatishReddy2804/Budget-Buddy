package com.budgetbuddy.platform.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private Integer month;
    private Integer year;
    private BigDecimal budgetedAmount;
    private BigDecimal actualSpent;
    private BigDecimal remainingAmount;
    private BigDecimal percentageUsed;
    private boolean isOverBudget;
}
