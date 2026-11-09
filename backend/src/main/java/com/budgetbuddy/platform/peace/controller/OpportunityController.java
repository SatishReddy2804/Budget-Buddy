package com.budgetbuddy.platform.peace.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.peace.model.Opportunity;
import com.budgetbuddy.platform.peace.service.OpportunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
@Tag(name = "Opportunities", description = "Verified income, freelancing, and career advancement opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;

    @GetMapping
    @Operation(summary = "Get list of opportunities with optional filters")
    public ResponseEntity<ApiResponse<List<Opportunity>>> getOpportunities(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal maxCapital,
            @RequestParam(required = false) BigDecimal maxDailyHours,
            @RequestParam(required = false) String riskLevel) {
        List<Opportunity> list = opportunityService.filterOpportunities(category, maxCapital, maxDailyHours, riskLevel);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get opportunity details by ID")
    public ResponseEntity<ApiResponse<Opportunity>> getOpportunityById(@PathVariable Long id) {
        Opportunity opp = opportunityService.getOpportunityById(id);
        return ResponseEntity.ok(ApiResponse.success(opp));
    }
}
