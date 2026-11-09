package com.budgetbuddy.platform.security;

import com.budgetbuddy.platform.user.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class SecurityAndAuthTest {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    @DisplayName("Should securely hash passwords with BCrypt and match correctly")
    void shouldHashPasswordWithBcrypt() {
        String rawPassword = "StrongSecretPassword123!";
        String encoded = passwordEncoder.encode(rawPassword);

        assertNotEquals(rawPassword, encoded);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
        assertFalse(passwordEncoder.matches("WrongPassword", encoded));
    }

    @Test
    @DisplayName("UserPrincipal should correctly wrap user details and roles")
    void shouldCreateUserPrincipal() {
        User user = User.builder()
                .id(1L)
                .email("test@budgetbuddy.app")
                .passwordHash("hashed")
                .firstName("Satish")
                .lastName("Reddy")
                .role("ROLE_USER")
                .build();

        UserPrincipal principal = UserPrincipal.create(user);

        assertEquals("test@budgetbuddy.app", principal.getUsername());
        assertEquals(1L, principal.getId());
        assertEquals(1, principal.getAuthorities().size());
        assertEquals("ROLE_USER", principal.getAuthorities().iterator().next().getAuthority());
        assertTrue(principal.isEnabled());
    }
}
