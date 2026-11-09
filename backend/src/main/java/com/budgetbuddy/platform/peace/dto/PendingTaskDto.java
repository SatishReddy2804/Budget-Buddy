package com.budgetbuddy.platform.peace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingTaskDto {
    private Long id;
    private Long originalTaskId;
    private String title;
    private String description;
    private String priority;
    private String category;
    private Integer estimatedMinutes;
    private LocalDate originalDate;
    private LocalDate carriedToDate;
    private String reason;
    private boolean isResolved;
}
