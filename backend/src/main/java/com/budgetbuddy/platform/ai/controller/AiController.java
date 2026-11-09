package com.budgetbuddy.platform.ai.controller;

import com.budgetbuddy.platform.ai.dto.AiInsightResponse;
import com.budgetbuddy.platform.ai.service.AiAdvisorService;
import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Advisor", description = "AI insights, spending patterns, and career task execution recommendations")
public class AiController {

    private final AiAdvisorService aiAdvisorService;

    @GetMapping("/financial-insights")
    @Operation(summary = "Get AI-generated financial insights based on actual stored transaction history")
    public ResponseEntity<ApiResponse<AiInsightResponse>> getFinancialInsights(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        AiInsightResponse insights = aiAdvisorService.getFinancialInsights(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(insights));
    }

    @GetMapping("/task-advice")
    @Operation(summary = "Get execution advice for a specific PEACE task")
    public ResponseEntity<ApiResponse<AiInsightResponse>> getTaskAdvice(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam String taskTitle,
            @RequestParam(required = false, defaultValue = "GENERAL") String category) {
        AiInsightResponse advice = aiAdvisorService.getCareerTaskAdvice(userPrincipal.getId(), taskTitle, category);
        return ResponseEntity.ok(ApiResponse.success(advice));
    }
}
