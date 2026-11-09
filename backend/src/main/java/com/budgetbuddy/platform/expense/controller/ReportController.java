package com.budgetbuddy.platform.expense.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.expense.dto.SpendingSummaryDto;
import com.budgetbuddy.platform.expense.service.ReportService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Financial Reports", description = "Aggregated spending summary, monthly trends, and category breakdowns")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @Operation(summary = "Get high-level spending analytics, monthly trends, and top merchants")
    public ResponseEntity<ApiResponse<SpendingSummaryDto>> getSpendingSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "6") int months) {
        SpendingSummaryDto summary = reportService.getSpendingSummary(userPrincipal.getId(), months);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
