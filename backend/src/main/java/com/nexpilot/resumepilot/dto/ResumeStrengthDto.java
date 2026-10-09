package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResumeStrengthDto(
    String id,
    String title,
    String description,
    String category,
    String highlightedText
) {
}

