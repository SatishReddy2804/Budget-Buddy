package com.budgetbuddy.platform.peace.model;

import com.budgetbuddy.platform.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "daily_plans", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_plan_date", columnNames = {"user_id", "plan_date"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate planDate;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalAvailableMinutes = 240;

    @Column(nullable = false)
    @Builder.Default
    private Integer scheduledMinutes = 240;

    @Column(nullable = false)
    @Builder.Default
    private Integer completedMinutes = 0;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal completionPercentage = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private boolean isUnavailableDay = false;

    private String unavailableReason; // ILLNESS, FAMILY_EMERGENCY, HOLIDAY, BIRTHDAY, TRAVEL, WORKLOAD, MOTIVATION, OTHER

    @Column(nullable = false)
    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, POSTPONED, MISSED

    @OneToMany(mappedBy = "dailyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
