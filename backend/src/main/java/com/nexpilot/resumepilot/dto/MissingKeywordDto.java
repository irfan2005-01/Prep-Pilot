package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MissingKeywordDto(
    String keyword,
    String importance,
    String rationale,
    String suggestedContext
) {
}

