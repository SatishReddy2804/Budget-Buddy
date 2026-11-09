package com.budgetbuddy.platform.peace.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.peace.dto.ProgressAnalyticsDto;
import com.budgetbuddy.platform.peace.model.DailyPlan;
import com.budgetbuddy.platform.peace.model.ReschedulingHistory;
import com.budgetbuddy.platform.peace.model.Task;
import com.budgetbuddy.platform.peace.repository.DailyPlanRepository;
import com.budgetbuddy.platform.peace.repository.PendingTaskRepository;
import com.budgetbuddy.platform.peace.repository.ReschedulingHistoryRepository;
import com.budgetbuddy.platform.peace.repository.TaskRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final DailyPlanRepository dailyPlanRepository;
    private final TaskRepository taskRepository;
    private final PendingTaskRepository pendingTaskRepository;
    private final ReschedulingHistoryRepository reschedulingHistoryRepository;

    @Transactional(readOnly = true)
    public ProgressAnalyticsDto getUserProgressAnalytics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        LocalDate today = LocalDate.now();
        LocalDate past90Days = today.minusDays(89);

        List<DailyPlan> plans = dailyPlanRepository.findByUserAndPlanDateBetweenOrderByPlanDateAsc(user, past90Days, today);
        Map<LocalDate, DailyPlan> planMap = new HashMap<>();
        for (DailyPlan p : plans) {
            planMap.put(p.getPlanDate(), p);
        }

        List<Task> allUserTasks = taskRepository.findByUserAndDueDateBetweenOrderByDueDateAsc(user, past90Days, today);
        Map<LocalDate, Integer> completedCounts = new HashMap<>();
        int totalCompleted = 0;

        for (Task t : allUserTasks) {
            if ("COMPLETED".equalsIgnoreCase(t.getStatus())) {
                totalCompleted++;
                completedCounts.put(t.getDueDate(), completedCounts.getOrDefault(t.getDueDate(), 0) + 1);
            }
        }

        // Build Heatmap for 90 days
        List<ProgressAnalyticsDto.HeatmapEntry> heatmap = new ArrayList<>();
        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 0;
        int missedDays = 0;

        for (int i = 0; i < 90; i++) {
            LocalDate d = past90Days.plusDays(i);
            int count = completedCounts.getOrDefault(d, 0);
            int level = count == 0 ? 0 : (count <= 2 ? 1 : (count <= 4 ? 2 : (count <= 6 ? 3 : 4)));

            heatmap.add(ProgressAnalyticsDto.HeatmapEntry.builder()
                    .date(d.toString())
                    .count(count)
                    .level(level)
                    .build());

            DailyPlan p = planMap.get(d);
            if (count > 0 || (p != null && p.getCompletionPercentage().compareTo(new BigDecimal("70.00")) >= 0)) {
                tempStreak++;
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
            } else {
                if (p != null && (p.isUnavailableDay() || "MISSED".equalsIgnoreCase(p.getStatus()))) {
                    missedDays++;
                }
                tempStreak = 0;
            }
        }

        currentStreak = tempStreak;

        // Current daily rate
        DailyPlan todayPlan = planMap.get(today);
        BigDecimal dailyRate = todayPlan != null ? todayPlan.getCompletionPercentage() : BigDecimal.ZERO;

        // Weekly rate (past 7 days)
        LocalDate weekStart = today.minusDays(6);
        List<Task> weekTasks = taskRepository.findByUserAndDueDateBetweenOrderByDueDateAsc(user, weekStart, today);
        long weekCompleted = weekTasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
        BigDecimal weeklyRate = weekTasks.isEmpty() ? BigDecimal.ZERO :
                BigDecimal.valueOf((double) weekCompleted / weekTasks.size() * 100.0).setScale(1, RoundingMode.HALF_UP);

        // Monthly rate (past 30 days)
        LocalDate monthStart = today.minusDays(29);
        List<Task> monthTasks = taskRepository.findByUserAndDueDateBetweenOrderByDueDateAsc(user, monthStart, today);
        long monthCompleted = monthTasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
        BigDecimal monthlyRate = monthTasks.isEmpty() ? BigDecimal.ZERO :
                BigDecimal.valueOf((double) monthCompleted / monthTasks.size() * 100.0).setScale(1, RoundingMode.HALF_UP);

        int pendingCount = pendingTaskRepository.findByUserAndIsResolvedFalseOrderByOriginalDateAsc(user).size();

        // Rescheduling history
        List<ReschedulingHistory> histories = reschedulingHistoryRepository.findByUserOrderByTimestampDesc(user);
        List<ProgressAnalyticsDto.RescheduleEventDto> historyDtos = histories.stream()
                .limit(10)
                .map(h -> ProgressAnalyticsDto.RescheduleEventDto.builder()
                        .id(h.getId())
                        .reasonCategory(h.getReasonCategory())
                        .explanation(h.getExplanation())
                        .taskCount(h.getRescheduledTaskCount())
                        .timestamp(h.getTimestamp())
                        .build())
                .toList();

        return ProgressAnalyticsDto.builder()
                .dailyCompletionRate(dailyRate)
                .weeklyProgressRate(weeklyRate)
                .monthlyProgressRate(monthlyRate)
                .yearlyProgressRate(monthlyRate) // rolling monthly indicator
                .currentStreakDays(currentStreak)
                .longestStreakDays(longestStreak)
                .missedDaysCount(missedDays)
                .totalTasksCompleted(totalCompleted)
                .totalPendingTasks(pendingCount)
                .heatmap(heatmap)
                .adjustmentHistory(historyDtos)
                .build();
    }
}
