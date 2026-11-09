package com.budgetbuddy.platform.peace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyPlanDto {
    private Long id;
    private LocalDate planDate;
    private Integer totalAvailableMinutes;
    private Integer scheduledMinutes;
    private Integer completedMinutes;
    private BigDecimal completionPercentage;
    private boolean isUnavailableDay;
    private String unavailableReason;
    private String status;
    private List<TaskDto> tasks;
}
