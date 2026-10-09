package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ScoreCategoryDto(
    String label,
    int score,
    int weight,
    String description,
    String status
) {
    public ScoreCategoryDto {
        // Enforce valid score bounds 0 - 100
        score = Math.max(0, Math.min(100, score));
        if (status == null || status.isBlank()) {
            if (score >= 80) status = "excellent";
            else if (score >= 68) status = "good";
            else if (score >= 50) status = "needs-work";
            else status = "critical";
        }
    }
}

