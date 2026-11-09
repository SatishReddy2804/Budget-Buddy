package com.budgetbuddy.platform.peace.engine;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.peace.dto.MissedDayRequest;
import com.budgetbuddy.platform.peace.model.*;
import com.budgetbuddy.platform.peace.repository.*;
import com.budgetbuddy.platform.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AdaptiveSchedulingEngine {

    private final DailyPlanRepository dailyPlanRepository;
    private final TaskRepository taskRepository;
    private final PendingTaskRepository pendingTaskRepository;
    private final ReschedulingHistoryRepository reschedulingHistoryRepository;

    @Transactional
    public DailyPlan getOrCreateDailyPlan(User user, LocalDate date, CareerRoadmap roadmap) {
        return dailyPlanRepository.findByUserAndPlanDate(user, date)
                .orElseGet(() -> createNewDailyPlan(user, date, roadmap));
    }

    @Transactional
    public DailyPlan createNewDailyPlan(User user, LocalDate date, CareerRoadmap roadmap) {
        DailyPlan plan = DailyPlan.builder()
                .user(user)
                .planDate(date)
                .totalAvailableMinutes(240)
                .scheduledMinutes(240)
                .completedMinutes(0)
                .completionPercentage(BigDecimal.ZERO)
                .isUnavailableDay(false)
                .status("IN_PROGRESS")
                .build();

        plan = dailyPlanRepository.save(plan);

        // Generate 7 structured PEACE tasks
        String focusArea = (roadmap != null && roadmap.getOpportunity() != null)
                ? roadmap.getOpportunity().getTitle()
                : "Professional Upskilling & Financial Freedom";

        List<Task> defaultTasks = List.of(
                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Morning Clarity & Financial Intention")
                        .category("MORNING_FOCUS")
                        .description("Review today's high-leverage milestones, review progress, and prepare your workspace.")
                        .instructions("1. Spend 5 mins in quiet focus. 2. Write down your top 2 priorities for " + focusArea + ". 3. Eliminate distractions.")
                        .expectedResult("Clear roadmap for today's highest priority output.")
                        .priority("HIGH")
                        .estimatedMinutes(20)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build(),

                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Dedicated Skill Acquisition Module")
                        .category("SKILL_LEARNING")
                        .description("Learn and practice core technical or domain skills relevant to " + focusArea + ".")
                        .instructions("Complete 1 practical tutorial chapter or code 1 functional prototype module.")
                        .expectedResult("Tangible proof of skill: notes, code commit, or practical sample.")
                        .priority("HIGH")
                        .estimatedMinutes(60)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build(),

                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Income Generation & Practical Execution")
                        .category("INCOME_TASK")
                        .description("Work directly on monetizable deliverables, client tasks, or portfolio artifacts.")
                        .instructions("Focus uninterruptedly on building a live asset, demo project, or service offer.")
                        .expectedResult("Completed deliverable or verified progress towards client work.")
                        .priority("HIGH")
                        .estimatedMinutes(75)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build(),

                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Client Outreach & Application Pipeline")
                        .category("CLIENT_OUTREACH")
                        .description("Submit targeted applications, pitch prospective clients, or engage in developer communities.")
                        .instructions("Send 2 personalized proposals or network with 3 relevant professionals.")
                        .expectedResult("Applications dispatched or ongoing conversations in the pipeline.")
                        .priority("MEDIUM")
                        .estimatedMinutes(40)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build(),

                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Daily Savings & Expense Tracking Action")
                        .category("SAVINGS_ACTION")
                        .description("Log receipts from today, check daily category budget, and avoid discretionary leaks.")
                        .instructions("Scan today's receipts into Smart Receipt Parser and check remaining monthly envelope.")
                        .expectedResult("Zero unlogged transactions and verified daily expense balance.")
                        .priority("MEDIUM")
                        .estimatedMinutes(15)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build(),

                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Physical Health, Posture & Mental Recharge")
                        .category("HEALTH_ACTION")
                        .description("Take a 20-minute brisk walk, hydrate, and stretch to maintain sustained cognitive energy.")
                        .instructions("Step away from screens, do light mobility exercises, and drink water.")
                        .expectedResult("Refreshed physical energy and reduced screen fatigue.")
                        .priority("MEDIUM")
                        .estimatedMinutes(20)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build(),

                Task.builder()
                        .dailyPlan(plan)
                        .user(user)
                        .title("Evening Debrief & Tomorrow's Preparation")
                        .category("REVIEW_TASK")
                        .description("Audit completed tasks, celebrate wins, and note any blockers to carry forward safely.")
                        .instructions("Check off completed tasks in Budget Buddy. Identify tomorrow's morning focus.")
                        .expectedResult("Closed daily loop with documented peace of mind.")
                        .priority("LOW")
                        .estimatedMinutes(10)
                        .actualMinutes(0)
                        .status("NOT_STARTED")
                        .dueDate(date)
                        .build()
        );

        taskRepository.saveAll(defaultTasks);
        plan.setTasks(new ArrayList<>(defaultTasks));
        return plan;
    }

    @Transactional
    public DailyPlan updateTaskCompletion(User user, Long taskId, boolean completed, Integer actualMinutes) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task does not belong to user");
        }

        task.setStatus(completed ? "COMPLETED" : "IN_PROGRESS");
        task.setCompletedAt(completed ? Instant.now() : null);
        if (actualMinutes != null && actualMinutes > 0) {
            task.setActualMinutes(actualMinutes);
        } else if (completed && task.getActualMinutes() == 0) {
            task.setActualMinutes(task.getEstimatedMinutes());
        }
        taskRepository.save(task);

        // If this task was pending, mark it resolved
        pendingTaskRepository.findByOriginalTaskIdAndIsResolvedFalse(task.getId())
                .ifPresent(p -> {
                    p.setResolved(true);
                    p.setResolvedAt(Instant.now());
                    pendingTaskRepository.save(p);
                });

        return recalculateDailyPlan(task.getDailyPlan());
    }

    @Transactional
    public DailyPlan handleMissedOrUnavailableDay(User user, MissedDayRequest request) {
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();
        DailyPlan plan = getOrCreateDailyPlan(user, date, null);

        boolean isEmergency = "HEALTH".equalsIgnoreCase(request.getReasonCategory()) ||
                              "FAMILY_EMERGENCY".equalsIgnoreCase(request.getReasonCategory());

        plan.setUnavailableDay(true);
        plan.setUnavailableReason(request.getReasonCategory());
        plan.setStatus(isEmergency ? "POSTPONED" : "MISSED");

        List<Task> incompleteTasks = plan.getTasks().stream()
                .filter(t -> !"COMPLETED".equalsIgnoreCase(t.getStatus()))
                .toList();

        int carriedCount = 0;
        for (Task t : incompleteTasks) {
            t.setStatus(isEmergency ? "RESCHEDULED" : "PENDING");
            t.setCarryForwardCount(t.getCarryForwardCount() + 1);
            taskRepository.save(t);

            // Add to pending tasks
            PendingTask pending = PendingTask.builder()
                    .user(user)
                    .originalTask(t)
                    .originalDate(date)
                    .carriedToDate(date.plusDays(1))
                    .reason(request.getReasonCategory() + (request.getExplanation() != null ? ": " + request.getExplanation() : ""))
                    .isResolved(false)
                    .build();
            pendingTaskRepository.save(pending);
            carriedCount++;
        }

        ReschedulingHistory history = ReschedulingHistory.builder()
                .user(user)
                .reasonCategory(request.getReasonCategory())
                .explanation(request.getExplanation())
                .rescheduledTaskCount(carriedCount)
                .timestamp(Instant.now())
                .build();
        reschedulingHistoryRepository.save(history);

        return dailyPlanRepository.save(plan);
    }

    @Transactional
    public DailyPlan recalculateDailyPlan(DailyPlan plan) {
        List<Task> tasks = taskRepository.findByDailyPlanOrderByCreatedAtAsc(plan);
        int totalMinutes = tasks.stream().mapToInt(Task::getEstimatedMinutes).sum();
        int completedMinutes = tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .mapToInt(Task::getEstimatedMinutes)
                .sum();

        BigDecimal percentage = totalMinutes > 0
                ? BigDecimal.valueOf((double) completedMinutes / totalMinutes * 100.0).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        plan.setScheduledMinutes(totalMinutes);
        plan.setCompletedMinutes(completedMinutes);
        plan.setCompletionPercentage(percentage);

        if (percentage.compareTo(new BigDecimal("100.00")) >= 0) {
            plan.setStatus("COMPLETED");
        } else if (plan.isUnavailableDay()) {
            // Keep postponed/missed
        } else {
            plan.setStatus("IN_PROGRESS");
        }

        return dailyPlanRepository.save(plan);
    }
}
