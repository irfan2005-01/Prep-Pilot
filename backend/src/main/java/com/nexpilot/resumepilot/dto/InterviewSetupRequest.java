package com.nexpilot.resumepilot.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record InterviewSetupRequest(
    @NotBlank(message = "Target role ID is required")
    String roleId,

    @NotBlank(message = "Interview type is required (technical, behavioral, or mixed)")
    String interviewType,

    @NotBlank(message = "Difficulty is required (beginner, intermediate, or advanced)")
    String difficulty,

    @NotNull(message = "Question count is required")
    @Min(value = 3, message = "Minimum question count is 3")
    @Max(value = 10, message = "Maximum question count is 10")
    Integer questionCount,

    List<String> strengths,
    List<String> skillGaps,
    List<String> roadmapTopics
) {}
