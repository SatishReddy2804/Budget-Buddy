package com.budgetbuddy.platform.peace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissedDayRequest {

    private LocalDate date;

    @NotBlank(message = "Reason category is required")
    private String reasonCategory; // HEALTH, FAMILY_EMERGENCY, HOLIDAY, BIRTHDAY, TRAVEL, WORKLOAD, MOTIVATION, OTHER

    private String explanation;

    private boolean postponeFullDay;
}
