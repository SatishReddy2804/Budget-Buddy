package com.budgetbuddy.platform.expense.repository;

import com.budgetbuddy.platform.expense.model.Receipt;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    Page<Receipt> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    List<Receipt> findByUserAndStatus(User user, String status);
}
