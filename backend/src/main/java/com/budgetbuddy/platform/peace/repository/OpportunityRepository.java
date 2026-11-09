package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByCategory(String category);

    @Query("SELECT o FROM Opportunity o WHERE " +
           "(:category IS NULL OR o.category = :category) AND " +
           "(:maxCapital IS NULL OR o.requiredCapital <= :maxCapital) AND " +
           "(:maxDailyHours IS NULL OR o.dailyHoursRequired <= :maxDailyHours) AND " +
           "(:riskLevel IS NULL OR o.riskLevel = :riskLevel)")
    List<Opportunity> filterOpportunities(
            @Param("category") String category,
            @Param("maxCapital") BigDecimal maxCapital,
            @Param("maxDailyHours") BigDecimal maxDailyHours,
            @Param("riskLevel") String riskLevel
    );
}
