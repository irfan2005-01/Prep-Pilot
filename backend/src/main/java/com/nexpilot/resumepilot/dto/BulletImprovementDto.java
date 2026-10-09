package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record BulletImprovementDto(
    String id,
    String section,
    String original,
    String improved,
    String critique,
    String formula
) {
}

