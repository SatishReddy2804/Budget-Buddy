package com.budgetbuddy.platform.peace.model;

import com.budgetbuddy.platform.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "rescheduling_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReschedulingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String reasonCategory; // ILLNESS, FAMILY_EMERGENCY, HOLIDAY, BIRTHDAY, TRAVEL, WORKLOAD, MOTIVATION, OTHER

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false)
    @Builder.Default
    private Integer rescheduledTaskCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();
}
