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

    public InterviewController(
        InterviewSimulatorService interviewService,
        InterviewSessionManager sessionManager
    ) {
        this.interviewService = interviewService;
        this.sessionManager = sessionManager;
    }

    @PostMapping("/start")
    public ResponseEntity<InterviewSessionStartResponse> startInterview(
        @Valid @RequestBody InterviewSetupRequest request
    ) {
        log.info("Received request to start interview: role={}, type={}, diff={}, count={}",
            request.roleId(), request.interviewType(), request.difficulty(), request.questionCount());

        InterviewSessionStartResponse response = interviewService.startInterview(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
        @PathVariable String sessionId,
        @Valid @RequestBody SubmitAnswerRequest request
    ) {
        log.info("Received answer submission for session: {}, question: {}", sessionId, request.questionId());

        SubmitAnswerResponse response = interviewService.submitAnswer(sessionId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<InterviewSummaryResponse> finishInterview(
        @PathVariable String sessionId
    ) {
        log.info("Received finish request for interview session: {}", sessionId);

        InterviewSummaryResponse response = interviewService.finishInterview(sessionId);
        return ResponseEntity.ok(response);
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

