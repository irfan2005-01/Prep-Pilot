package com.nexpilot.resumepilot.service;

import com.nexpilot.resumepilot.model.StudentEntity;
import com.nexpilot.resumepilot.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentIdentityService {

    private static final Logger log = LoggerFactory.getLogger(StudentIdentityService.class);

    private final StudentRepository studentRepository;

    public StudentIdentityService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional
    public StudentEntity resolveOrCreateStudent(String tokenHeader) {
        ServletRequestAttributes attributes = RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes servlet ? servlet : null;
        jakarta.servlet.http.HttpSession session = attributes == null ? null : attributes.getRequest().getSession(false);
        Object accountId = session == null ? null : session.getAttribute(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID);
        if (accountId instanceof String id) {
            try {
                return studentRepository.findById(UUID.fromString(id))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in again."));
            } catch (IllegalArgumentException invalidSession) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in again.");
            }
        }
        if (tokenHeader != null && !tokenHeader.trim().isBlank()) {
            String sanitizedToken = tokenHeader.trim();
            // Validate token format (alphanumeric, hyphens, underscores up to 64 chars)
            if (sanitizedToken.matches("^[a-zA-Z0-9_-]{8,64}$")) {
                Optional<StudentEntity> existing = studentRepository.findByStudentToken(sanitizedToken);
                if (existing.isPresent()) {
                    StudentEntity student = existing.get();
                    student.setUpdatedAt(Instant.now());
                    return studentRepository.save(student);
                }

                // If a valid token was sent from a client that does not exist yet in DB, create it
                StudentEntity newStudent = new StudentEntity(UUID.randomUUID(), sanitizedToken);
                newStudent.setName("Prep Pilot Candidate");
                log.info("Registered candidate profile for an existing anonymous identity token");
                return studentRepository.save(newStudent);
            } else {
                log.warn("Invalid student token format provided. Generating fresh anonymous identity.");
            }
        }

        // Generate a new cryptographically random token
        String generatedToken = "s_" + UUID.randomUUID().toString().replace("-", "");
        StudentEntity student = new StudentEntity(UUID.randomUUID(), generatedToken);
        student.setName("Prep Pilot Candidate");
        log.info("Issued a new anonymous candidate identity");
        return studentRepository.save(student);
    }

    public boolean isAuthenticatedRequest() {
        ServletRequestAttributes attributes = RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes servlet ? servlet : null;
        jakarta.servlet.http.HttpSession session = attributes == null ? null : attributes.getRequest().getSession(false);
        return session != null && session.getAttribute(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID) instanceof String;
    }

    public void requireAuthenticatedRequest() {
        if (!isAuthenticatedRequest()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Please sign in to continue.");
        }
    }

    @Transactional(readOnly = true)
    public Optional<StudentEntity> findStudent(String tokenHeader) {
        if (tokenHeader == null || tokenHeader.trim().isBlank()) {
            return Optional.empty();
        }
        return studentRepository.findByStudentToken(tokenHeader.trim());
    }
}

