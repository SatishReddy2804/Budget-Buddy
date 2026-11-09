package com.budgetbuddy.platform.expense.repository;

import com.budgetbuddy.platform.expense.model.Receipt;
import com.budgetbuddy.platform.expense.model.ReceiptLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptLineItemRepository extends JpaRepository<ReceiptLineItem, Long> {
    List<ReceiptLineItem> findByReceipt(Receipt receipt);
}
