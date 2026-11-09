package com.budgetbuddy.platform.peace.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.peace.dto.PendingTaskDto;
import com.budgetbuddy.platform.peace.engine.AdaptiveSchedulingEngine;
import com.budgetbuddy.platform.peace.model.PendingTask;
import com.budgetbuddy.platform.peace.model.Task;
import com.budgetbuddy.platform.peace.repository.PendingTaskRepository;
import com.budgetbuddy.platform.peace.repository.TaskRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PendingTaskService {

    private final PendingTaskRepository pendingTaskRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AdaptiveSchedulingEngine schedulingEngine;

    @Transactional(readOnly = true)
    public List<PendingTaskDto> getActivePendingTasks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        List<PendingTask> list = pendingTaskRepository.findByUserAndIsResolvedFalseOrderByOriginalDateAsc(user);
        return list.stream().map(this::mapToDto).toList();
    }

    @Transactional
    public void resolvePendingTask(Long userId, Long pendingTaskId, boolean completed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        PendingTask pending = pendingTaskRepository.findById(pendingTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending task not found: " + pendingTaskId));

        if (!pending.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task does not belong to user");
        }

        pending.setResolved(true);
        pending.setResolvedAt(Instant.now());
        pendingTaskRepository.save(pending);

        Task orig = pending.getOriginalTask();
        if (completed) {
            orig.setStatus("COMPLETED");
            orig.setCompletedAt(Instant.now());
            orig.setActualMinutes(orig.getEstimatedMinutes());
            taskRepository.save(orig);
            if (orig.getDailyPlan() != null) {
                schedulingEngine.recalculateDailyPlan(orig.getDailyPlan());
            }
        }
    }

    @Transactional
    public void carryForwardToToday(Long userId, Long pendingTaskId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        PendingTask pending = pendingTaskRepository.findById(pendingTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending task not found: " + pendingTaskId));

        if (!pending.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task does not belong to user");
        }

        Task orig = pending.getOriginalTask();
        orig.setDueDate(LocalDate.now());
        orig.setStatus("NOT_STARTED");
        orig.setCarryForwardCount(orig.getCarryForwardCount() + 1);
        taskRepository.save(orig);

        pending.setCarriedToDate(LocalDate.now());
        pendingTaskRepository.save(pending);
    }

    private PendingTaskDto mapToDto(PendingTask p) {
        Task t = p.getOriginalTask();
        return PendingTaskDto.builder()
                .id(p.getId())
                .originalTaskId(t != null ? t.getId() : null)
                .title(t != null ? t.getTitle() : "Task")
                .description(t != null ? t.getDescription() : "")
                .priority(t != null ? t.getPriority() : "MEDIUM")
                .category(t != null ? t.getCategory() : "GENERAL")
                .estimatedMinutes(t != null ? t.getEstimatedMinutes() : 30)
                .originalDate(p.getOriginalDate())
                .carriedToDate(p.getCarriedToDate())
                .reason(p.getReason())
                .isResolved(p.isResolved())
                .build();
    }
}
