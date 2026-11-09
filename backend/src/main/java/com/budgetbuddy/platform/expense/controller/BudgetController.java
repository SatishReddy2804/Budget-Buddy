package com.budgetbuddy.platform.expense.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.expense.dto.BudgetDto;
import com.budgetbuddy.platform.expense.dto.CreateBudgetRequest;
import com.budgetbuddy.platform.expense.service.BudgetService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budgets", description = "Monthly category budgets, actual spending tracking, and overspending alerts")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @Operation(summary = "Create or update monthly budget for a category")
    public ResponseEntity<ApiResponse<BudgetDto>> createOrUpdateBudget(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateBudgetRequest request) {
        BudgetDto budget = budgetService.createOrUpdateBudget(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Budget saved successfully", budget));
    }

    @GetMapping
    @Operation(summary = "Get all category budgets and actual spending for a month and year")
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getBudgets(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        List<BudgetDto> list = budgetService.getBudgetsForMonth(userPrincipal.getId(), m, y);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete budget by ID")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        budgetService.deleteBudget(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}
