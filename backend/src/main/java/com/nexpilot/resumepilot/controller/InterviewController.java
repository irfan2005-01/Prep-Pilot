package com.nexpilot.resumepilot.controller;

import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.service.InterviewSessionManager;
import com.nexpilot.resumepilot.service.InterviewSimulatorService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {

    private static final Logger log = LoggerFactory.getLogger(InterviewController.class);

    private final InterviewSimulatorService interviewService;
    private final InterviewSessionManager sessionManager;
    private final com.nexpilot.resumepilot.service.StudentIdentityService identityService;
    private final com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService;
    private final com.nexpilot.resumepilot.repository.InterviewSessionRepository interviewSessionRepository;

    public InterviewController(
        InterviewSimulatorService interviewService,
        InterviewSessionManager sessionManager,
        com.nexpilot.resumepilot.service.StudentIdentityService identityService,
        com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService,
        com.nexpilot.resumepilot.repository.InterviewSessionRepository interviewSessionRepository
    ) {
        this.interviewService = interviewService;
        this.sessionManager = sessionManager;
        this.identityService = identityService;
        this.persistenceService = persistenceService;
        this.interviewSessionRepository = interviewSessionRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<InterviewSessionStartResponse> startInterview(
        @Valid @RequestBody InterviewSetupRequest request,
        @org.springframework.web.bind.annotation.RequestHeader(value = "X-Student-Token", required = false) String studentToken
    ) {
        identityService.requireAuthenticatedRequest();
        log.info("Received request to start interview: role={}, type={}, diff={}, count={}",
            request.roleId(), request.interviewType(), request.difficulty(), request.questionCount());

        InterviewSessionStartResponse response = interviewService.startInterview(request);

        // Resolve candidate profile & persist interview session start
        com.nexpilot.resumepilot.model.StudentEntity student = identityService.resolveOrCreateStudent(studentToken);
        try {
            InterviewSessionManager.InterviewSession session = sessionManager.getSession(response.sessionId());
            persistenceService.saveInterviewStart(student, response, session.getQuestions(), session.isEnableFollowUps());
        } catch (Exception e) {
            log.error("Non-fatal: failed to persist interview start: {}", e.getMessage());
        }

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        if (!identityService.isAuthenticatedRequest()) {
            headers.set("X-Student-Token", student.getStudentToken());
            headers.set("Access-Control-Expose-Headers", "X-Student-Token");
        }

        return ResponseEntity.ok()
            .headers(headers)
            .body(response);
    }

    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
        @PathVariable String sessionId,
        @Valid @RequestBody SubmitAnswerRequest request
    ) {
        requireOwnedSession(sessionId);
        log.info("Received answer submission for session: {}, question: {}", sessionId, request.questionId());

        SubmitAnswerResponse response = interviewService.submitAnswer(sessionId, request);

        try {
            InterviewQuestionDto followUp = response.nextQuestion() != null && Boolean.TRUE.equals(response.nextQuestion().isFollowUp())
                ? response.nextQuestion()
                : null;
            persistenceService.recordAnswerSubmission(sessionId, request.questionId(), request.answerText(), response.feedback(), followUp);
        } catch (Exception e) {
            log.error("Non-fatal: failed to persist interview answer: {}", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<InterviewSummaryResponse> finishInterview(
        @PathVariable String sessionId
    ) {
        requireOwnedSession(sessionId);
        log.info("Received finish request for interview session: {}", sessionId);

        InterviewSummaryResponse response = interviewService.finishInterview(sessionId);

        try {
            persistenceService.recordInterviewCompletion(sessionId, response);
        } catch (Exception e) {
            log.error("Non-fatal: failed to persist interview summary: {}", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    private void requireOwnedSession(String sessionId) {
        identityService.requireAuthenticatedRequest();
        var student = identityService.resolveOrCreateStudent(null);
        if (!interviewSessionRepository.existsBySessionIdAndStudent(sessionId, student)) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Interview session not found or not owned by student.");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Prep Pilot Mock Interview Simulator",
            "activeSessions", sessionManager.getActiveSessionCount()
        ));
    }
}

