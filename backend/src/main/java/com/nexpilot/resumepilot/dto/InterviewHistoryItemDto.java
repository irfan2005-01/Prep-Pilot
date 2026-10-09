package com.nexpilot.resumepilot.dto;

import java.util.UUID;

public record InterviewHistoryItemDto(
    UUID id,
    String sessionId,
    String roleId,
    String roleTitle,
    String interviewType,
    String difficulty,
    int totalQuestions,
    int answeredCount,
    Integer overallScore,
    String status,
    boolean isFinished,
    String createdAt
) {}

