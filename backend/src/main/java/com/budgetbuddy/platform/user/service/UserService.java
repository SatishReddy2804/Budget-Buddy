package com.budgetbuddy.platform.user.service;

import com.budgetbuddy.platform.common.exception.BadRequestException;
import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.user.dto.*;
import com.budgetbuddy.platform.user.model.FinancialProfile;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.model.UserProfile;
import com.budgetbuddy.platform.user.repository.FinancialProfileRepository;
import com.budgetbuddy.platform.user.repository.UserProfileRepository;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final FinancialProfileRepository financialProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserDto getUserDto(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        boolean onboardingCompleted = userProfileRepository.findByUser(user).isPresent();

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status(user.getStatus())
                .preferredLanguage(user.getPreferredLanguage())
                .themePreference(user.getThemePreference())
                .createdAt(user.getCreatedAt())
                .onboardingCompleted(onboardingCompleted)
                .build();
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return userProfileRepository.findByUser(user)
                .map(this::mapToProfileDto)
                .orElse(null);
    }

    @Transactional
    public UserProfileDto saveUserProfile(Long userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElse(UserProfile.builder().user(user).build());

        profile.setEmploymentStatus(dto.getEmploymentStatus());
        profile.setCurrentCity(dto.getCurrentCity());
        profile.setState(dto.getState());
        profile.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
        profile.setWillingToRelocate(dto.isWillingToRelocate());
        profile.setEducationLevel(dto.getEducationLevel());
        profile.setPrimarySkills(dto.getPrimarySkills());
        profile.setSkillsToLearn(dto.getSkillsToLearn());
        profile.setExperienceYears(dto.getExperienceYears() != null ? dto.getExperienceYears() : 0);
        profile.setPreferredWorkType(dto.getPreferredWorkType() != null ? dto.getPreferredWorkType() : "REMOTE");
        profile.setDailyAvailableHours(dto.getDailyAvailableHours());
        profile.setWeeklyAvailableHours(dto.getWeeklyAvailableHours());
        profile.setRiskTolerance(dto.getRiskTolerance() != null ? dto.getRiskTolerance() : "MODERATE");
        profile.setHealthAccessibilityNeeds(dto.getHealthAccessibilityNeeds());
        profile.setFamilyCommitments(dto.getFamilyCommitments());

        UserProfile saved = userProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    @Transactional(readOnly = true)
    public FinancialProfileDto getFinancialProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return financialProfileRepository.findByUser(user)
                .map(this::mapToFinancialDto)
                .orElse(null);
    }

    @Transactional
    public FinancialProfileDto saveFinancialProfile(Long userId, FinancialProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        FinancialProfile profile = financialProfileRepository.findByUser(user)
                .orElse(FinancialProfile.builder().user(user).build());

        profile.setCurrentMonthlyIncome(dto.getCurrentMonthlyIncome());
        profile.setCurrentSavings(dto.getCurrentSavings());
        profile.setMonthlyEssentialExpenses(dto.getMonthlyEssentialExpenses());
        profile.setExistingDebts(dto.getExistingDebts() != null ? dto.getExistingDebts() : java.math.BigDecimal.ZERO);
        profile.setTargetWealthAmount(dto.getTargetWealthAmount());
        profile.setTargetDurationYears(dto.getTargetDurationYears());
        profile.setEmergencyFundTarget(dto.getEmergencyFundTarget() != null ? dto.getEmergencyFundTarget() : java.math.BigDecimal.ZERO);
        profile.setRiskComfortLevel(dto.getRiskComfortLevel() != null ? dto.getRiskComfortLevel() : "MODERATE");

        FinancialProfile saved = financialProfileRepository.save(profile);
        return mapToFinancialDto(saved);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void updatePreferences(Long userId, String language, String theme) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (language != null && !language.isBlank()) {
            user.setPreferredLanguage(language.trim());
        }
        if (theme != null && !theme.isBlank()) {
            user.setThemePreference(theme.trim());
        }
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserDataExportDto exportUserData(Long userId) {
        UserDto userDto = getUserDto(userId);
        UserProfileDto profileDto = getUserProfile(userId);
        FinancialProfileDto financialDto = getFinancialProfile(userId);

        return UserDataExportDto.builder()
                .user(userDto)
                .profile(profileDto)
                .financialProfile(financialDto)
                .exportTimestamp(Instant.now())
                .build();
    }

    @Transactional
    public void deleteAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        userRepository.delete(user);
    }

    private UserProfileDto mapToProfileDto(UserProfile profile) {
        return UserProfileDto.builder()
                .id(profile.getId())
                .employmentStatus(profile.getEmploymentStatus())
                .currentCity(profile.getCurrentCity())
                .state(profile.getState())
                .country(profile.getCountry())
                .willingToRelocate(profile.isWillingToRelocate())
                .educationLevel(profile.getEducationLevel())
                .primarySkills(profile.getPrimarySkills())
                .skillsToLearn(profile.getSkillsToLearn())
                .experienceYears(profile.getExperienceYears())
                .preferredWorkType(profile.getPreferredWorkType())
                .dailyAvailableHours(profile.getDailyAvailableHours())
                .weeklyAvailableHours(profile.getWeeklyAvailableHours())
                .riskTolerance(profile.getRiskTolerance())
                .healthAccessibilityNeeds(profile.getHealthAccessibilityNeeds())
                .familyCommitments(profile.getFamilyCommitments())
                .build();
    }

    private FinancialProfileDto mapToFinancialDto(FinancialProfile profile) {
        return FinancialProfileDto.builder()
                .id(profile.getId())
                .currentMonthlyIncome(profile.getCurrentMonthlyIncome())
                .currentSavings(profile.getCurrentSavings())
                .monthlyEssentialExpenses(profile.getMonthlyEssentialExpenses())
                .existingDebts(profile.getExistingDebts())
                .targetWealthAmount(profile.getTargetWealthAmount())
                .targetDurationYears(profile.getTargetDurationYears())
                .emergencyFundTarget(profile.getEmergencyFundTarget())
                .riskComfortLevel(profile.getRiskComfortLevel())
                .build();
    }
}
