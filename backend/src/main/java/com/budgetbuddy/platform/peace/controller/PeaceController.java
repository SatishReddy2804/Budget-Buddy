package com.budgetbuddy.platform.peace.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.peace.dto.LocationComparisonDto;
import com.budgetbuddy.platform.peace.dto.WealthSimulationRequest;
import com.budgetbuddy.platform.peace.dto.WealthSimulationResult;
import com.budgetbuddy.platform.peace.engine.LocationIntelligenceEngine;
import com.budgetbuddy.platform.peace.engine.WealthSimulationEngine;
import com.budgetbuddy.platform.security.UserPrincipal;
import com.budgetbuddy.platform.user.dto.FinancialProfileDto;
import com.budgetbuddy.platform.user.dto.UserProfileDto;
import com.budgetbuddy.platform.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/peace")
@RequiredArgsConstructor
@Tag(name = "PEACE Engine", description = "Personal Economic Advancement & Career Engine: Simulation, Locations, and Overview")
public class PeaceController {

    private final WealthSimulationEngine wealthSimulationEngine;
    private final LocationIntelligenceEngine locationIntelligenceEngine;
    private final UserService userService;

    @GetMapping("/overview")
    @Operation(summary = "Get current PEACE status and unified metrics for authenticated user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPeaceOverview(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileDto profile = userService.getUserProfile(userPrincipal.getId());
        FinancialProfileDto finProfile = userService.getFinancialProfile(userPrincipal.getId());

        WealthSimulationResult simulation = null;
        if (finProfile != null) {
            WealthSimulationRequest req = WealthSimulationRequest.builder()
                    .startingCapital(finProfile.getCurrentSavings())
                    .currentMonthlyIncome(finProfile.getCurrentMonthlyIncome())
                    .monthlyEssentialExpenses(finProfile.getMonthlyEssentialExpenses())
                    .targetWealthAmount(finProfile.getTargetWealthAmount())
                    .targetDurationYears(finProfile.getTargetDurationYears())
                    .build();
            simulation = wealthSimulationEngine.simulate(req);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("profile", profile);
        data.put("financialProfile", finProfile);
        data.put("simulation", simulation);

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/simulate")
    @Operation(summary = "Run deterministic wealth simulation across Conservative, Moderate, and Ambitious scenarios")
    public ResponseEntity<ApiResponse<WealthSimulationResult>> simulateWealth(
            @Valid @RequestBody WealthSimulationRequest request) {
        WealthSimulationResult result = wealthSimulationEngine.simulate(request);
        return ResponseEntity.ok(ApiResponse.success("Simulation calculated successfully", result));
    }

    @GetMapping("/locations")
    @Operation(summary = "Get location cost of living, rental indexes, and net savings comparison")
    public ResponseEntity<ApiResponse<LocationComparisonDto>> compareLocations(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String city,
            @RequestParam(required = false, defaultValue = "false") boolean willingToRelocate,
            @RequestParam(required = false) BigDecimal expectedIncome) {

        String userCity = city;
        if (userCity == null && userPrincipal != null) {
            UserProfileDto p = userService.getUserProfile(userPrincipal.getId());
            if (p != null) {
                userCity = p.getCurrentCity();
                willingToRelocate = p.isWillingToRelocate();
            }
        }

        LocationComparisonDto result = locationIntelligenceEngine.compareLocations(userCity, willingToRelocate, expectedIncome);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
