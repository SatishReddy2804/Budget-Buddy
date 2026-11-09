package com.budgetbuddy.platform.peace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressAnalyticsDto {

    private BigDecimal dailyCompletionRate;
    private BigDecimal weeklyProgressRate;
    private BigDecimal monthlyProgressRate;
    private BigDecimal yearlyProgressRate;
    private Integer currentStreakDays;
    private Integer longestStreakDays;
    private Integer missedDaysCount;
    private Integer totalTasksCompleted;
    private Integer totalPendingTasks;
    private List<HeatmapEntry> heatmap;
    private List<RescheduleEventDto> adjustmentHistory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeatmapEntry {
        private String date; // YYYY-MM-DD
        private int count;   // completed tasks count
        private int level;   // 0 to 4 intensity level
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RescheduleEventDto {
        private Long id;
        private String reasonCategory;
        private String explanation;
        private int taskCount;
        private Instant timestamp;
    }
}
