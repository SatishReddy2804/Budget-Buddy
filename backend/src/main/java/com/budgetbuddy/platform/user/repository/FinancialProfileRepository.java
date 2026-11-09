package com.budgetbuddy.platform.user.repository;

import com.budgetbuddy.platform.user.model.FinancialProfile;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialProfileRepository extends JpaRepository<FinancialProfile, Long> {
    Optional<FinancialProfile> findByUser(User user);
    Optional<FinancialProfile> findByUserId(Long userId);
}
