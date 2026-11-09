package com.budgetbuddy.platform.user.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.security.UserPrincipal;
import com.budgetbuddy.platform.user.dto.*;
import com.budgetbuddy.platform.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User & Profile", description = "Endpoints for user profile, onboarding data, preferences, and account management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDto userDto = userService.getUserDto(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get user employment and background profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileDto profile = userService.getUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PostMapping("/profile")
    @Operation(summary = "Create or update user background profile (Onboarding)")
    public ResponseEntity<ApiResponse<UserProfileDto>> saveUserProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserProfileDto profileDto) {
        UserProfileDto saved = userService.saveUserProfile(userPrincipal.getId(), profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile saved successfully", saved));
    }

    @GetMapping("/financial-profile")
    @Operation(summary = "Get user financial onboarding metrics")
    public ResponseEntity<ApiResponse<FinancialProfileDto>> getFinancialProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        FinancialProfileDto profile = userService.getFinancialProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PostMapping("/financial-profile")
    @Operation(summary = "Create or update user financial metrics (Onboarding)")
    public ResponseEntity<ApiResponse<FinancialProfileDto>> saveFinancialProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody FinancialProfileDto profileDto) {
        FinancialProfileDto saved = userService.saveFinancialProfile(userPrincipal.getId(), profileDto);
        return ResponseEntity.ok(ApiResponse.success("Financial profile saved successfully", saved));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change account password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update language and theme preferences")
    public ResponseEntity<ApiResponse<Void>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> preferences) {
        String lang = preferences.get("preferredLanguage");
        String theme = preferences.get("themePreference");
        userService.updatePreferences(userPrincipal.getId(), lang, theme);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated", null));
    }

    @GetMapping("/export")
    @Operation(summary = "Export all user account and profile data (GDPR/Data Portability)")
    public ResponseEntity<ApiResponse<UserDataExportDto>> exportData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDataExportDto export = userService.exportUserData(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Data export generated", export));
    }

    @DeleteMapping("/account")
    @Operation(summary = "Delete user account and all associated data")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        userService.deleteAccount(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }
}
