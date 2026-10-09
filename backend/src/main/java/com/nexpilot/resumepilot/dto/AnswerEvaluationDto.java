package com.nexpilot.resumepilot.dto;

import java.util.List;

public record AnswerEvaluationDto(
    String questionId,
    int score,
    List<String> strengths,
    List<String> improvementAreas,
    List<String> missingConcepts,
    String suggestedAnswer,
    String nextStep,
    String rubricType,
    String practiceDisclaimer
) {}

