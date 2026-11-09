package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.ReschedulingHistory;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReschedulingHistoryRepository extends JpaRepository<ReschedulingHistory, Long> {
    List<ReschedulingHistory> findByUserOrderByTimestampDesc(User user);
}
