package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FreeResourceDto(
    String title,
    String url,
    String provider,
    String skillCovered,
    String freeStatus,
    String type
) {
}

