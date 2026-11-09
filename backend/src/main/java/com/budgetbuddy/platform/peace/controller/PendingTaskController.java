package com.budgetbuddy.platform.peace.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.peace.dto.PendingTaskDto;
import com.budgetbuddy.platform.peace.service.PendingTaskService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pending-tasks")
@RequiredArgsConstructor
@Tag(name = "Pending Tasks", description = "Management and recovery of carried-forward or overdue tasks")
public class PendingTaskController {

    private final PendingTaskService pendingTaskService;

    @GetMapping
    @Operation(summary = "Get all active pending / carried-forward tasks")
    public ResponseEntity<ApiResponse<List<PendingTaskDto>>> getPendingTasks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PendingTaskDto> list = pendingTaskService.getActivePendingTasks(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/resolve")
    @Operation(summary = "Mark a pending task completed and remove from pending queue")
    public ResponseEntity<ApiResponse<Void>> resolvePendingTask(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Boolean> body) {
        boolean completed = body == null || Boolean.TRUE.equals(body.get("completed"));
        pendingTaskService.resolvePendingTask(userPrincipal.getId(), id, completed);
        return ResponseEntity.ok(ApiResponse.success("Pending task resolved", null));
    }

    @PostMapping("/{id}/carry-forward")
    @Operation(summary = "Schedule pending task into today's execution plan")
    public ResponseEntity<ApiResponse<Void>> carryForwardToToday(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        pendingTaskService.carryForwardToToday(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Task scheduled for today", null));
    }
}
