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
public class UserDataExportDto {
    private UserDto user;
    private UserProfileDto profile;
    private FinancialProfileDto financialProfile;
    private Instant exportTimestamp;
}
