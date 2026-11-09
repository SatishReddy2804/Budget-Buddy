package com.budgetbuddy.platform.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String status;
    private String preferredLanguage;
    private String themePreference;
    private Instant createdAt;
    private boolean onboardingCompleted;
}
