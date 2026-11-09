package com.budgetbuddy.platform.peace.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.peace.dto.ProgressAnalyticsDto;
import com.budgetbuddy.platform.peace.service.AnalyticsService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Progress Analytics", description = "Performance analytics, contribution heatmap, and streak metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/progress")
    @Operation(summary = "Get user progress analytics, heatmap data, and streak history")
    public ResponseEntity<ApiResponse<ProgressAnalyticsDto>> getProgressAnalytics(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProgressAnalyticsDto analytics = analyticsService.getUserProgressAnalytics(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
