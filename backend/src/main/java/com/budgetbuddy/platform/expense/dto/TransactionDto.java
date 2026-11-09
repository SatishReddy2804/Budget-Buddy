package com.budgetbuddy.platform.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private Long id;
    private Long receiptId;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private String type; // EXPENSE, INCOME
    private BigDecimal amount;
    private String currency;
    private LocalDate transactionDate;
    private String merchant;
    private String notes;
    private boolean isRecurring;
    private Instant createdAt;
}
