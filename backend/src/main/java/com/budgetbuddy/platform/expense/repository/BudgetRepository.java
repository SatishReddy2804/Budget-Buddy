package com.budgetbuddy.platform.expense.repository;

import com.budgetbuddy.platform.expense.model.Budget;
import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, ExpenseCategory category, Integer month, Integer year);
}
