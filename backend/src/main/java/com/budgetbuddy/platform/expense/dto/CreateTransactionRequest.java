package com.budgetbuddy.platform.expense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    private Long receiptId;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Type is required (EXPENSE or INCOME)")
    private String type; // EXPENSE, INCOME

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @Builder.Default
    private String currency = "INR";

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    @NotBlank(message = "Merchant or payee name is required")
    private String merchant;

    private String notes;
    private boolean isRecurring;
}
