package com.nexpilot.resumepilot.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record RoadmapGenerationRequest(
    @NotBlank(message = "roleId is required")
    String roleId,
    String roleTitle,
    List<String> strengths,
    List<String> missingKeywords,
    List<String> matchedKeywords,
    Integer currentScore
) {
}

