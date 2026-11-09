package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.DailyPlan;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPlanRepository extends JpaRepository<DailyPlan, Long> {
    Optional<DailyPlan> findByUserAndPlanDate(User user, LocalDate planDate);
    List<DailyPlan> findByUserAndPlanDateBetweenOrderByPlanDateAsc(User user, LocalDate startDate, LocalDate endDate);
}
