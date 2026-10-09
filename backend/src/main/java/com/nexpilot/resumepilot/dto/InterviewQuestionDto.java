package com.nexpilot.resumepilot.dto;

public record InterviewQuestionDto(
    String id,
    int questionNumber,
    int totalQuestions,
    String category,
    String competency,
    String questionText,
    String difficulty,
    Boolean isFollowUp,
    String parentQuestionId
) {
    public InterviewQuestionDto(
        String id,
        int questionNumber,
        int totalQuestions,
        String category,
        String competency,
        String questionText,
        String difficulty
    ) {
        this(id, questionNumber, totalQuestions, category, competency, questionText, difficulty, false, null);
    }
}
