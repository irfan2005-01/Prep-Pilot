package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ScoreBreakdownDto(
    int overall,
    String verdict,
    ScoreCategoriesDto categories
) {
    public ScoreBreakdownDto {
        overall = Math.max(0, Math.min(100, overall));
        if (verdict == null || verdict.isBlank()) {
            if (overall >= 82) verdict = "Ready for Application";
            else if (overall >= 70) verdict = "Strong Contender";
            else if (overall >= 55) verdict = "Optimization Needed";
            else verdict = "Requires Overhaul";
        }
    }
}

