package com.nexpilot.resumepilot.dto;

import java.time.Instant;

public record InterviewSessionStartResponse(
    String sessionId,
    String roleId,
    String roleTitle,
    String interviewType,
    String difficulty,
    int totalQuestions,
    InterviewQuestionDto currentQuestion,
    Instant createdAt
) {}
