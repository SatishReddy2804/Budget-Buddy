package com.budgetbuddy.platform.expense.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.expense.repository.ExpenseCategoryRepository;
import com.budgetbuddy.platform.security.UserPrincipal;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Expense Categories", description = "Available system and custom expense categories")
public class CategoryController {

    private final ExpenseCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get list of available expense categories for user")
    public ResponseEntity<ApiResponse<List<ExpenseCategory>>> getCategories(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = null;
        if (userPrincipal != null) {
            user = userRepository.findById(userPrincipal.getId()).orElse(null);
        }
        List<ExpenseCategory> list = categoryRepository.findAvailableCategoriesForUser(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
