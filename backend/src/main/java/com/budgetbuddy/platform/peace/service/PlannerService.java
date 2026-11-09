package com.budgetbuddy.platform.peace.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.peace.dto.DailyPlanDto;
import com.budgetbuddy.platform.peace.dto.MissedDayRequest;
import com.budgetbuddy.platform.peace.dto.TaskDto;
import com.budgetbuddy.platform.peace.engine.AdaptiveSchedulingEngine;
import com.budgetbuddy.platform.peace.model.CareerRoadmap;
import com.budgetbuddy.platform.peace.model.DailyPlan;
import com.budgetbuddy.platform.peace.model.Task;
import com.budgetbuddy.platform.peace.repository.CareerRoadmapRepository;
import com.budgetbuddy.platform.peace.repository.DailyPlanRepository;
import com.budgetbuddy.platform.peace.repository.TaskRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlannerService {

    private final DailyPlanRepository dailyPlanRepository;
    private final TaskRepository taskRepository;
    private final CareerRoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final AdaptiveSchedulingEngine schedulingEngine;

    @Transactional
    public DailyPlanDto getDailyPlanForDate(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        CareerRoadmap roadmap = roadmapRepository.findFirstByUserAndStatusOrderByCreatedAtDesc(user, "ACTIVE").orElse(null);

        DailyPlan plan = schedulingEngine.getOrCreateDailyPlan(user, date, roadmap);
        return mapToDailyPlanDto(plan);
    }

    @Transactional
    public DailyPlanDto toggleTask(Long userId, Long taskId, boolean completed, Integer actualMinutes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        DailyPlan plan = schedulingEngine.updateTaskCompletion(user, taskId, completed, actualMinutes);
        return mapToDailyPlanDto(plan);
    }

    @Transactional
    public DailyPlanDto handleMissedDay(Long userId, MissedDayRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        DailyPlan plan = schedulingEngine.handleMissedOrUnavailableDay(user, request);
        return mapToDailyPlanDto(plan);
    }

    @Transactional
    public TaskDto createCustomTask(Long userId, TaskDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        LocalDate date = dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now();
        CareerRoadmap roadmap = roadmapRepository.findFirstByUserAndStatusOrderByCreatedAtDesc(user, "ACTIVE").orElse(null);
        DailyPlan plan = schedulingEngine.getOrCreateDailyPlan(user, date, roadmap);

        Task task = Task.builder()
                .dailyPlan(plan)
                .user(user)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .instructions(dto.getInstructions())
                .expectedResult(dto.getExpectedResult())
                .priority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM")
                .category(dto.getCategory() != null ? dto.getCategory() : "INCOME_TASK")
                .estimatedMinutes(dto.getEstimatedMinutes() != null ? dto.getEstimatedMinutes() : 30)
                .actualMinutes(0)
                .status("NOT_STARTED")
                .dueDate(date)
                .build();

        task = taskRepository.save(task);
        schedulingEngine.recalculateDailyPlan(plan);

        return mapToTaskDto(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getCalendarTasks(Long userId, LocalDate start, LocalDate end) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        List<Task> tasks = taskRepository.findByUserAndDueDateBetweenOrderByDueDateAsc(user, start, end);
        return tasks.stream().map(this::mapToTaskDto).toList();
    }

    private DailyPlanDto mapToDailyPlanDto(DailyPlan plan) {
        List<Task> tasks = taskRepository.findByDailyPlanOrderByCreatedAtAsc(plan);
        List<TaskDto> taskDtos = tasks.stream().map(this::mapToTaskDto).toList();

        return DailyPlanDto.builder()
                .id(plan.getId())
                .planDate(plan.getPlanDate())
                .totalAvailableMinutes(plan.getTotalAvailableMinutes())
                .scheduledMinutes(plan.getScheduledMinutes())
                .completedMinutes(plan.getCompletedMinutes())
                .completionPercentage(plan.getCompletionPercentage())
                .isUnavailableDay(plan.isUnavailableDay())
                .unavailableReason(plan.getUnavailableReason())
                .status(plan.getStatus())
                .tasks(taskDtos)
                .build();
    }

    private TaskDto mapToTaskDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .dailyPlanId(task.getDailyPlan() != null ? task.getDailyPlan().getId() : null)
                .milestoneId(task.getMilestone() != null ? task.getMilestone().getId() : null)
                .title(task.getTitle())
                .description(task.getDescription())
                .instructions(task.getInstructions())
                .expectedResult(task.getExpectedResult())
                .priority(task.getPriority())
                .category(task.getCategory())
                .estimatedMinutes(task.getEstimatedMinutes())
                .actualMinutes(task.getActualMinutes())
                .status(task.getStatus())
                .carryForwardCount(task.getCarryForwardCount())
                .dueDate(task.getDueDate())
                .completedAt(task.getCompletedAt())
                .build();
    }
}
