package com.budgetbuddy.platform.peace.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.peace.model.CareerRoadmap;
import com.budgetbuddy.platform.peace.service.RoadmapService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/roadmaps")
@RequiredArgsConstructor
@Tag(name = "Career Roadmaps", description = "Structured career milestones and advancement roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping("/active")
    @Operation(summary = "Get user's current active career roadmap")
    public ResponseEntity<ApiResponse<CareerRoadmap>> getActiveRoadmap(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        CareerRoadmap roadmap = roadmapService.getActiveRoadmap(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(roadmap));
    }

    @PostMapping("/select-opportunity/{opportunityId}")
    @Operation(summary = "Generate or reset structured roadmap from an opportunity")
    public ResponseEntity<ApiResponse<CareerRoadmap>> createRoadmap(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long opportunityId,
            @RequestBody(required = false) Map<String, String> body) {
        String title = body != null ? body.get("title") : null;
        CareerRoadmap roadmap = roadmapService.createOrUpdateRoadmap(userPrincipal.getId(), opportunityId, title);
        return ResponseEntity.ok(ApiResponse.success("Roadmap created successfully", roadmap));
    }
}
