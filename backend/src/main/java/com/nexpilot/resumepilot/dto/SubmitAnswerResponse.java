package com.nexpilot.resumepilot.dto;

public record SubmitAnswerResponse(
    String questionId,
    AnswerEvaluationDto feedback,
    boolean hasNextQuestion,
    InterviewQuestionDto nextQuestion,
    boolean isFinished
) {}
