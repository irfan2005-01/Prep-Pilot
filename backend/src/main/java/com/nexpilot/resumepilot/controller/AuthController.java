package com.nexpilot.resumepilot.controller;

import com.nexpilot.resumepilot.model.StudentEntity;
import com.nexpilot.resumepilot.repository.StudentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    public static final String STUDENT_ID = "authenticatedStudentId";
    private final StudentRepository students;
    private final PasswordEncoder passwords;
    private final ConcurrentHashMap<String, AttemptWindow> attempts = new ConcurrentHashMap<>();

    public AuthController(StudentRepository students, PasswordEncoder passwords) {
        this.students = students;
        this.passwords = passwords;
    }

    public record RegisterRequest(@NotBlank @Size(max=128) String name, @NotBlank @Email @Size(max=254) String email,
                                  @NotBlank @Size(min=12,max=72) String password) {}
    public record LoginRequest(@NotBlank @Email @Size(max=254) String email, @NotBlank @Size(max=72) String password) {}
    public record UserResponse(String name, String email) {}
    private record AttemptWindow(long started, AtomicInteger count) {}

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest body, HttpServletRequest request) {
        requireCsrf(request);
        String email = body.email().trim().toLowerCase(java.util.Locale.ROOT);
        if (body.password().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be no more than 72 UTF-8 bytes.");
        if (students.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        StudentEntity student = new StudentEntity(UUID.randomUUID(), "s_" + UUID.randomUUID().toString().replace("-", ""));
        student.setEmail(email);
        student.setName(body.name().trim());
        student.setPasswordHash(passwords.encode(body.password()));
        try { students.saveAndFlush(student); }
        catch (DataIntegrityViolationException duplicate) { throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists."); }
        establishSession(student, request);
        return new UserResponse(student.getName(), student.getEmail());
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest body, HttpServletRequest request) {
        requireCsrf(request);
        if (body.password().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect.");
        String key = request.getRemoteAddr() + ":" + body.email().trim().toLowerCase(java.util.Locale.ROOT);
        AttemptWindow window = attempts.compute(key, (ignored, existing) -> existing == null || System.currentTimeMillis()-existing.started()>900_000
            ? new AttemptWindow(System.currentTimeMillis(), new AtomicInteger()) : existing);
        if (window.count().incrementAndGet() > 10) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many sign-in attempts. Try again in 15 minutes.");
        StudentEntity student = students.findByEmailIgnoreCase(body.email().trim().toLowerCase(java.util.Locale.ROOT))
            .filter(candidate -> candidate.getPasswordHash() != null && passwords.matches(body.password(), candidate.getPasswordHash()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect."));
        attempts.remove(key);
        establishSession(student, request);
        return new UserResponse(student.getName(), student.getEmail());
    }

    @GetMapping("/session")
    public UserResponse session(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object id = session == null ? null : session.getAttribute(STUDENT_ID);
        if (!(id instanceof String studentId)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in.");
        StudentEntity student = students.findById(UUID.fromString(studentId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in."));
        return new UserResponse(student.getName(), student.getEmail());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        requireCsrf(request);
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
    }

    private void establishSession(StudentEntity student, HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        request.changeSessionId();
        session.setAttribute(STUDENT_ID, student.getId().toString());
        session.setAttribute("csrf", UUID.randomUUID().toString());
    }

    private static void requireCsrf(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String expected = session == null ? null : (String)session.getAttribute("csrf");
        if (expected == null || !expected.equals(request.getHeader("X-CSRF-Token")))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid security token. Refresh and try again.");
    }

    @GetMapping("/csrf")
    public Map<String,String> csrf(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        String token = (String)session.getAttribute("csrf");
        if (token == null) { token = UUID.randomUUID().toString(); session.setAttribute("csrf", token); }
        return Map.of("token", token);
    }
}
