package com.budgetbuddy.platform.expense.service;

import com.budgetbuddy.platform.common.dto.PageResponse;
import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.expense.dto.CreateTransactionRequest;
import com.budgetbuddy.platform.expense.dto.TransactionDto;
import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.expense.model.Receipt;
import com.budgetbuddy.platform.expense.model.Transaction;
import com.budgetbuddy.platform.expense.repository.ExpenseCategoryRepository;
import com.budgetbuddy.platform.expense.repository.ReceiptRepository;
import com.budgetbuddy.platform.expense.repository.TransactionRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionDto createTransaction(Long userId, CreateTransactionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        Receipt receipt = null;
        if (request.getReceiptId() != null) {
            receipt = receiptRepository.findById(request.getReceiptId())
                    .orElse(null);
            if (receipt != null && receipt.getUser().getId().equals(userId)) {
                receipt.setStatus("COMMITTED");
                receiptRepository.save(receipt);
            }
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .receipt(receipt)
                .category(category)
                .type(request.getType() != null ? request.getType().toUpperCase() : "EXPENSE")
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .transactionDate(request.getTransactionDate())
                .merchant(request.getMerchant().trim())
                .notes(request.getNotes())
                .isRecurring(request.isRecurring())
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToDto(transaction);
    }

    @Transactional
    public TransactionDto updateTransaction(Long userId, Long transactionId, CreateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Transaction not found");
        }

        ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        transaction.setCategory(category);
        transaction.setType(request.getType().toUpperCase());
        transaction.setAmount(request.getAmount());
        transaction.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setMerchant(request.getMerchant().trim());
        transaction.setNotes(request.getNotes());
        transaction.setRecurring(request.isRecurring());

        transaction = transactionRepository.save(transaction);
        return mapToDto(transaction);
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionDto> searchTransactions(
            Long userId, String type, Long categoryId, String search, LocalDate startDate, LocalDate endDate, Pageable pageable) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Page<Transaction> page = transactionRepository.searchTransactions(
                user, type, categoryId, search, startDate, endDate, pageable);

        Page<TransactionDto> dtoPage = page.map(this::mapToDto);
        return PageResponse.from(dtoPage);
    }

    @Transactional
    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Transaction not found");
        }

        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public String exportTransactionsCsv(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(6);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<Transaction> list = transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(user, start, end);

        StringBuilder sb = new StringBuilder();
        sb.append("ID,Date,Type,Merchant,Category,Amount,Currency,Recurring,Notes\n");
        for (Transaction t : list) {
            sb.append(t.getId()).append(",")
                    .append(t.getTransactionDate()).append(",")
                    .append(t.getType()).append(",")
                    .append("\"").append(t.getMerchant().replace("\"", "\"\"")).append("\",")
                    .append("\"").append(t.getCategory() != null ? t.getCategory().getName() : "Uncategorized").append("\",")
                    .append(t.getAmount()).append(",")
                    .append(t.getCurrency()).append(",")
                    .append(t.isRecurring()).append(",")
                    .append("\"").append(t.getNotes() != null ? t.getNotes().replace("\"", "\"\"") : "").append("\"\n");
        }
        return sb.toString();
    }

    public TransactionDto mapToDto(Transaction t) {
        return TransactionDto.builder()
                .id(t.getId())
                .receiptId(t.getReceipt() != null ? t.getReceipt().getId() : null)
                .categoryId(t.getCategory() != null ? t.getCategory().getId() : null)
                .categoryName(t.getCategory() != null ? t.getCategory().getName() : "Uncategorized")
                .categoryIcon(t.getCategory() != null ? t.getCategory().getIcon() : "tag")
                .categoryColor(t.getCategory() != null ? t.getCategory().getColor() : "#3b82f6")
                .type(t.getType())
                .amount(t.getAmount())
                .currency(t.getCurrency())
                .transactionDate(t.getTransactionDate())
                .merchant(t.getMerchant())
                .notes(t.getNotes())
                .isRecurring(t.isRecurring())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
