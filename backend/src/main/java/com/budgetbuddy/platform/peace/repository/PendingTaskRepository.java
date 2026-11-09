package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.PendingTask;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PendingTaskRepository extends JpaRepository<PendingTask, Long> {
    List<PendingTask> findByUserAndIsResolvedFalseOrderByOriginalDateAsc(User user);
    Optional<PendingTask> findByOriginalTaskIdAndIsResolvedFalse(Long taskId);
}
