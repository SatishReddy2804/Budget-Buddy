package com.budgetbuddy.platform.expense.repository;

import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {

    @Query("SELECT c FROM ExpenseCategory c WHERE c.user IS NULL OR c.user = :user ORDER BY c.name ASC")
    List<ExpenseCategory> findAvailableCategoriesForUser(@Param("user") User user);
}
