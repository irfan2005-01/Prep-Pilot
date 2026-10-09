package com.nexpilot.resumepilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubmitAnswerRequest(
    @NotBlank(message = "Question ID is required")
    String questionId,

    @NotBlank(message = "Answer text cannot be blank")
    @Size(min = 5, max = 10000, message = "Answer must be between 5 and 10,000 characters")
    String answerText
) {}
