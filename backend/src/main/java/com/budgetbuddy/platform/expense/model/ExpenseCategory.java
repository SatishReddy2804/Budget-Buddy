package com.budgetbuddy.platform.expense.model;

import com.budgetbuddy.platform.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "expense_categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // null if global system category

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private String icon = "tag";

    @Builder.Default
    private String color = "#3b82f6";

    @Builder.Default
    private boolean isDefault = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
