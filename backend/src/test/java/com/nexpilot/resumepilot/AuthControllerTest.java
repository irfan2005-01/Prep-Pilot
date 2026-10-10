package com.nexpilot.resumepilot;

import com.nexpilot.resumepilot.controller.AuthController;
import com.nexpilot.resumepilot.model.StudentEntity;
import com.nexpilot.resumepilot.repository.StudentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
    @Mock StudentRepository students;
    @Mock PasswordEncoder passwords;
    @Mock HttpServletRequest request;
    @Mock HttpSession session;
    private AuthController controller;

    @BeforeEach void setup() { controller = new AuthController(students, passwords); }

    private void csrf() {
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("csrf")).thenReturn("csrf-token");
        when(request.getHeader("X-CSRF-Token")).thenReturn("csrf-token");
    }

    @Test void registrationStoresOnlyPasswordHashAndCreatesSession() {
        csrf();
        when(request.getSession(true)).thenReturn(session);
        when(students.existsByEmailIgnoreCase("student@example.com")).thenReturn(false);
        when(passwords.encode("A sufficiently long password")).thenReturn("$2a$12$hash");
        when(students.saveAndFlush(any(StudentEntity.class))).thenAnswer(call -> call.getArgument(0));

        AuthController.UserResponse user = controller.register(
            new AuthController.RegisterRequest("Student", " Student@Example.com ", "A sufficiently long password"), request);

        assertEquals("student@example.com", user.email());
        verify(passwords).encode("A sufficiently long password");
        verify(students).saveAndFlush(argThat(student -> "$2a$12$hash".equals(student.getPasswordHash())
            && student.getEmail().equals("student@example.com")));
        verify(session).setAttribute(eq("authenticatedStudentId"), anyString());
    }

    @Test void registrationRejectsMissingCsrfHeaderBeforePersisting() {
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("csrf")).thenReturn("session-token");
        when(request.getHeader("X-CSRF-Token")).thenReturn(null);

        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> controller.register(
            new AuthController.RegisterRequest("Student", "student@example.com", "A sufficiently long password"), request));

        assertEquals(403, error.getStatusCode().value());
        verifyNoInteractions(students);
        verifyNoInteractions(passwords);
    }

    @Test void registrationRejectsCsrfTokenFromAnotherSessionBeforePersisting() {
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("csrf")).thenReturn("current-session-token");
        when(request.getHeader("X-CSRF-Token")).thenReturn("stale-session-token");

        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> controller.register(
            new AuthController.RegisterRequest("Student", "student@example.com", "A sufficiently long password"), request));

        assertEquals(403, error.getStatusCode().value());
        verifyNoInteractions(students);
        verifyNoInteractions(passwords);
    }

    @Test void duplicateEmailIsRejected() {
        csrf();
        when(students.existsByEmailIgnoreCase("student@example.com")).thenReturn(true);
        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> controller.register(
            new AuthController.RegisterRequest("Student", "student@example.com", "A sufficiently long password"), request));
        assertEquals(409, error.getStatusCode().value());
        verify(students, never()).saveAndFlush(any());
    }

    @Test void invalidCredentialsAreRejected() {
        csrf();
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        StudentEntity account = new StudentEntity(UUID.randomUUID(), "s_test_token_123456");
        account.setEmail("student@example.com");
        account.setPasswordHash("bcrypt-hash");
        when(students.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(account));
        when(passwords.matches("wrong password", "bcrypt-hash")).thenReturn(false);
        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> controller.login(
            new AuthController.LoginRequest("student@example.com", "wrong password"), request));
        assertEquals(401, error.getStatusCode().value());
    }
}
