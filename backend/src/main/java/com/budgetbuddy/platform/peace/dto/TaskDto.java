package com.budgetbuddy.platform.peace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;
    private Long dailyPlanId;
    private Long milestoneId;
    private String title;
    private String description;
    private String instructions;
    private String expectedResult;
    private String priority; // HIGH, MEDIUM, LOW
    private String category; // MORNING_FOCUS, SKILL_LEARNING, INCOME_TASK, CLIENT_OUTREACH, SAVINGS_ACTION, HEALTH_ACTION, REVIEW_TASK
    private Integer estimatedMinutes;
    private Integer actualMinutes;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED, PENDING, SKIPPED, RESCHEDULED
    private Integer carryForwardCount;
    private LocalDate dueDate;
    private Instant completedAt;
}
