package com.budgetbuddy.platform.peace.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.peace.dto.DailyPlanDto;
import com.budgetbuddy.platform.peace.dto.MissedDayRequest;
import com.budgetbuddy.platform.peace.dto.TaskDto;
import com.budgetbuddy.platform.peace.service.PlannerService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
@Tag(name = "Daily Planner", description = "Adaptive daily execution, task tracking, and schedule adjustment")
public class PlannerController {

    private final PlannerService plannerService;

    @GetMapping("/daily")
    @Operation(summary = "Get daily plan and tasks for a given date (defaults to today)")
    public ResponseEntity<ApiResponse<DailyPlanDto>> getDailyPlan(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        DailyPlanDto plan = plannerService.getDailyPlanForDate(userPrincipal.getId(), targetDate);
        return ResponseEntity.ok(ApiResponse.success(plan));
    }

    @PostMapping("/tasks/{taskId}/toggle")
    @Operation(summary = "Toggle task completion status")
    public ResponseEntity<ApiResponse<DailyPlanDto>> toggleTask(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> body) {
        boolean completed = Boolean.TRUE.equals(body.get("completed"));
        Integer actualMinutes = body.get("actualMinutes") != null ? ((Number) body.get("actualMinutes")).intValue() : null;

        DailyPlanDto plan = plannerService.toggleTask(userPrincipal.getId(), taskId, completed, actualMinutes);
        return ResponseEntity.ok(ApiResponse.success("Task updated", plan));
    }

    @PostMapping("/tasks")
    @Operation(summary = "Add a custom task to a daily plan")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody TaskDto taskDto) {
        TaskDto created = plannerService.createCustomTask(userPrincipal.getId(), taskDto);
        return ResponseEntity.ok(ApiResponse.success("Task created", created));
    }

    @PostMapping("/missed-day")
    @Operation(summary = "Handle missed day, emergency postponement, or carry-forward")
    public ResponseEntity<ApiResponse<DailyPlanDto>> handleMissedDay(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody MissedDayRequest request) {
        DailyPlanDto updatedPlan = plannerService.handleMissedDay(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Plan updated successfully", updatedPlan));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get scheduled tasks in date range for calendar views")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getCalendarTasks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<TaskDto> tasks = plannerService.getCalendarTasks(userPrincipal.getId(), start, end);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
}
