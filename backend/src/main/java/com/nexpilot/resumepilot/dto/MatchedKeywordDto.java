package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MatchedKeywordDto(
    String keyword,
    int frequency,
    String importance
) {
}

