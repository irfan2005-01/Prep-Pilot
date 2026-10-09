package com.nexpilot.resumepilot.dto;

public record PerQuestionResultDto(
    InterviewQuestionDto question,
    String answerText,
    AnswerEvaluationDto feedback,
    boolean answered
) {}
