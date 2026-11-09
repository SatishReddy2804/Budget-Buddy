package com.budgetbuddy.platform.user.service;

import com.budgetbuddy.platform.common.exception.BadRequestException;
import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.security.JwtTokenProvider;
import com.budgetbuddy.platform.security.UserPrincipal;
import com.budgetbuddy.platform.user.dto.AuthRequest;
import com.budgetbuddy.platform.user.dto.AuthResponse;
import com.budgetbuddy.platform.user.dto.RefreshTokenRequest;
import com.budgetbuddy.platform.user.dto.RegisterRequest;
import com.budgetbuddy.platform.user.model.RefreshToken;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.FinancialProfileRepository;
import com.budgetbuddy.platform.user.repository.RefreshTokenRepository;
import com.budgetbuddy.platform.user.repository.UserProfileRepository;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserProfileRepository userProfileRepository;
    private final FinancialProfileRepository financialProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Value("${application.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .role("ROLE_USER")
                .status("ACTIVE")
                .preferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "en")
                .themePreference(request.getThemePreference() != null ? request.getThemePreference() : "system")
                .build();

        user = userRepository.save(user);

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateToken(userPrincipal);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .preferredLanguage(user.getPreferredLanguage())
                .themePreference(user.getThemePreference())
                .onboardingCompleted(false)
                .build();
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = tokenProvider.generateToken(userPrincipal);
        RefreshToken refreshToken = createRefreshToken(user);

        boolean onboardingCompleted = userProfileRepository.findByUser(user).isPresent() &&
                financialProfileRepository.findByUser(user).isPresent();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .preferredLanguage(user.getPreferredLanguage())
                .themePreference(user.getThemePreference())
                .onboardingCompleted(onboardingCompleted)
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.isExpired()) {
            throw new BadRequestException("Refresh token is expired or revoked. Please log in again.");
        }

        User user = refreshToken.getUser();
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateToken(userPrincipal);

        boolean onboardingCompleted = userProfileRepository.findByUser(user).isPresent();

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .preferredLanguage(user.getPreferredLanguage())
                .themePreference(user.getThemePreference())
                .onboardingCompleted(onboardingCompleted)
                .build();
    }

    @Transactional
    public void logout(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            refreshTokenRepository.deleteAllByUser(user);
        }
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusMillis(refreshTokenExpirationMs))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }
}
