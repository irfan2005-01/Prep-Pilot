package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SkillGapDto(
    String skill,
    String priority,
    String rationale
) {
}

