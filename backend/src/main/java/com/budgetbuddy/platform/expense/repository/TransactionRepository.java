package com.budgetbuddy.platform.expense.repository;

import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.expense.model.Transaction;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:categoryId IS NULL OR t.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(t.merchant) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.notes) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:startDate IS NULL OR t.transactionDate >= :startDate) AND " +
           "(:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "ORDER BY t.transactionDate DESC, t.id DESC")
    Page<Transaction> searchTransactions(
            @Param("user") User user,
            @Param("type") String type,
            @Param("categoryId") Long categoryId,
            @Param("search") String search,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(User user, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserAndCategoryAndTransactionDateBetween(User user, ExpenseCategory category, LocalDate startDate, LocalDate endDate);
}
