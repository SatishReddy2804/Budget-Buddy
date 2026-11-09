package com.budgetbuddy.platform.expense.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.common.dto.PageResponse;
import com.budgetbuddy.platform.expense.dto.CreateTransactionRequest;
import com.budgetbuddy.platform.expense.dto.TransactionDto;
import com.budgetbuddy.platform.expense.service.TransactionService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Income and expense transactions tracking, searching, filtering, and export")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @Operation(summary = "Create an income or expense transaction (manual or from receipt)")
    public ResponseEntity<ApiResponse<TransactionDto>> createTransaction(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateTransactionRequest request) {
        TransactionDto created = transactionService.createTransaction(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction recorded successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing transaction")
    public ResponseEntity<ApiResponse<TransactionDto>> updateTransaction(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody CreateTransactionRequest request) {
        TransactionDto updated = transactionService.updateTransaction(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", updated));
    }

    @GetMapping
    @Operation(summary = "Search transactions with category, date, and text filters and pagination")
    public ResponseEntity<ApiResponse<PageResponse<TransactionDto>>> getTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageResponse<TransactionDto> result = transactionService.searchTransactions(
                userPrincipal.getId(), type, categoryId, search, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction by ID")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        transactionService.deleteTransaction(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export filtered transactions to CSV file")
    public void exportCsv(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"budget-buddy-transactions.csv\"");
        String csv = transactionService.exportTransactionsCsv(userPrincipal.getId(), startDate, endDate);
        response.getWriter().write(csv);
    }
}
