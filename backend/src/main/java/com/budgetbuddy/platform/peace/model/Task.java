package com.budgetbuddy.platform.peace.model;

import com.budgetbuddy.platform.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_plan_id", nullable = false)
    private DailyPlan dailyPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id")
    private RoadmapMilestone milestone;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String expectedResult;

    @Column(nullable = false)
    @Builder.Default
    private String priority = "MEDIUM"; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String category; // MORNING_FOCUS, SKILL_LEARNING, INCOME_TASK, CLIENT_OUTREACH, SAVINGS_ACTION, HEALTH_ACTION, REVIEW_TASK

    @Column(nullable = false)
    @Builder.Default
    private Integer estimatedMinutes = 30;

    @Column(nullable = false)
    @Builder.Default
    private Integer actualMinutes = 0;

    @Column(nullable = false)
    @Builder.Default
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED, PENDING, SKIPPED, RESCHEDULED

    @Column(nullable = false)
    @Builder.Default
    private Integer carryForwardCount = 0;

    @Column(nullable = false)
    private LocalDate dueDate;

    private Instant completedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
