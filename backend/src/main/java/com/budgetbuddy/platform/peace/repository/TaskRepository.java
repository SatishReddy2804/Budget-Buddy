package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.DailyPlan;
import com.budgetbuddy.platform.peace.model.Task;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByDailyPlanOrderByCreatedAtAsc(DailyPlan dailyPlan);
    List<Task> findByUserAndDueDate(User user, LocalDate dueDate);
    List<Task> findByUserAndStatus(User user, String status);
    List<Task> findByUserAndDueDateBetweenOrderByDueDateAsc(User user, LocalDate startDate, LocalDate endDate);
}
