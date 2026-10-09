package com.nexpilot.resumepilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubmitAnswerRequest(
    @NotBlank(message = "Question ID is required")
    String questionId,

    @NotBlank(message = "Answer text is required")
    @Size(min = 10, max = 5000, message = "Answer must be between 10 and 5000 characters")
    String answerText,

    Boolean allowFollowUp
) {
    public SubmitAnswerRequest(String questionId, String answerText) {
        this(questionId, answerText, true);
    }
}
