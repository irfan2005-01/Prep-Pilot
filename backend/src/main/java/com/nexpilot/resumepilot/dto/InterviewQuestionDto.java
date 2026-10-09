package com.nexpilot.resumepilot.dto;

public record InterviewQuestionDto(
    String id,
    int questionNumber,
    int totalQuestions,
    String category,
    String competency,
    String questionText,
    String difficulty
) {}

